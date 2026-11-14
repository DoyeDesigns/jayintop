"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  deletePersistedCase,
  loadSiteContent,
  saveSiteContent,
} from "@/app/admin/content-actions";
import {
  defaultContent,
  getAt,
  setAt,
  type AdminContent,
} from "@/lib/admin-content";

type AdminContentContextValue = {
  content: AdminContent;
  dirty: boolean;
  ready: boolean;
  saving: boolean;
  status: string | null;
  setPath: (path: string, value: unknown) => void;
  mutate: (recipe: (draft: AdminContent) => void) => void;
  save: () => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  reset: () => void;
};

const AdminContentContext = createContext<AdminContentContextValue | null>(null);

function applyLive(setContent: (content: AdminContent) => void, setSaved: (value: string) => void, live: AdminContent) {
  setContent(live);
  setSaved(JSON.stringify(live));
}

export function AdminContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AdminContent | null>(null);
  const [saved, setSaved] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    let ignore = false;
    loadSiteContent().then((result) => {
      if (ignore) return;
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
      applyLive(setContent, setSaved, result.content);
      setReady(true);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const dirty = ready && content !== null && JSON.stringify(content) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const save = async () => {
    if (!ready || saving || !contentRef.current) return;
    setSaving(true);
    setStatus(null);
    const result = await saveSiteContent(contentRef.current);
    setSaving(false);
    if (!result.ok) {
      if ("content" in result && result.content) {
        applyLive(setContent, setSaved, result.content);
      }
      window.alert(result.error);
      setStatus(result.error);
      return;
    }
    applyLive(setContent, setSaved, result.content);
    setStatus("Saved");
  };

  const deleteCase = async (id: string) => {
    if (!ready || saving || !contentRef.current) return;
    const persisted = saved ? (JSON.parse(saved) as AdminContent).cases.some((item) => item.id === id) : false;
    if (!persisted) {
      setContent((current) => {
        if (!current) return current;
        return { ...current, cases: current.cases.filter((item) => item.id !== id) };
      });
      return;
    }

    setSaving(true);
    setStatus(null);
    const result = await deletePersistedCase(id, contentRef.current.updatedAt);
    setSaving(false);
    if (!result.ok) {
      if ("content" in result && result.content) {
        applyLive(setContent, setSaved, result.content);
      }
      window.alert(result.error);
      setStatus(result.error);
      return;
    }
    applyLive(setContent, setSaved, result.content);
    setStatus("Deleted");
  };

  const setPath = (path: string, value: unknown) => {
    setContent((current) => (current ? setAt(current, path, value) : current));
  };

  const mutate = (recipe: (draft: AdminContent) => void) => {
    setContent((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      recipe(next);
      return next;
    });
  };

  const reset = () => {
    if (
      window.confirm(
        "Reset all fields to the starter text? Click Save to publish that reset.",
      )
    ) {
      setContent({ ...defaultContent(), updatedAt: contentRef.current?.updatedAt ?? "" });
    }
  };

  return (
    <AdminContentContext.Provider
      value={{
        content: content ?? defaultContent(),
        dirty,
        ready,
        saving,
        status: ready ? status : (status ?? "Loading live content…"),
        setPath,
        mutate,
        save,
        deleteCase,
        reset,
      }}
    >
      {children}
    </AdminContentContext.Provider>
  );
}

export function useAdminContent() {
  const value = useContext(AdminContentContext);
  if (!value) {
    throw new Error("useAdminContent must be used within AdminContentProvider");
  }
  return value;
}

export function useList<T>(path: string) {
  const { content, mutate } = useAdminContent();
  const items = (getAt(content, path) as T[]) ?? [];

  return {
    items,
    add(item: T) {
      mutate((draft) => {
        (getAt(draft, path) as T[]).push(structuredClone(item));
      });
    },
    remove(index: number) {
      mutate((draft) => {
        (getAt(draft, path) as T[]).splice(index, 1);
      });
    },
    set(index: number, value: T) {
      mutate((draft) => {
        (getAt(draft, path) as T[])[index] = value;
      });
    },
    move(index: number, direction: -1 | 1) {
      mutate((draft) => {
        const list = getAt(draft, path) as T[];
        const next = index + direction;
        if (next < 0 || next >= list.length) return;
        const [item] = list.splice(index, 1);
        list.splice(next, 0, item);
      });
    },
  };
}
