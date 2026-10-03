"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadSiteContent, saveSiteContent } from "@/app/admin/content-actions";
import {
  defaultContent,
  getAt,
  setAt,
  type AdminContent,
} from "@/lib/admin-content";

type AdminContentContextValue = {
  content: AdminContent;
  dirty: boolean;
  saving: boolean;
  status: string | null;
  setPath: (path: string, value: unknown) => void;
  mutate: (recipe: (draft: AdminContent) => void) => void;
  save: () => Promise<void>;
  reset: () => void;
};

const AdminContentContext = createContext<AdminContentContextValue | null>(null);

export function AdminContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AdminContent>(defaultContent);
  const [saved, setSaved] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    let ignore = false;
    loadSiteContent().then((loaded) => {
      if (ignore) return;
      setContent(loaded);
      setSaved(JSON.stringify(loaded));
      setReady(true);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const dirty = ready && JSON.stringify(content) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setStatus(null);
    const result = await saveSiteContent(contentRef.current);
    setSaving(false);
    if (!result.ok) {
      window.alert(result.error);
      return;
    }
    setContent(result.content);
    setSaved(JSON.stringify(result.content));
    setStatus("Saved");
  };

  const setPath = (path: string, value: unknown) => {
    setContent((current) => setAt(current, path, value));
  };

  const mutate = (recipe: (draft: AdminContent) => void) => {
    setContent((current) => {
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
      setContent(defaultContent());
    }
  };

  return (
    <AdminContentContext.Provider
      value={{ content, dirty, saving, status, setPath, mutate, save, reset }}
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
