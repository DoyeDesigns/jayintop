"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  defaultContent,
  getAt,
  mergeContent,
  setAt,
  type AdminContent,
} from "@/lib/admin-content";

const STORAGE_KEY = "jayintop:admin-content:v1";

type AdminContentContextValue = {
  content: AdminContent;
  setPath: (path: string, value: unknown) => void;
  mutate: (recipe: (draft: AdminContent) => void) => void;
  reset: () => void;
};

const AdminContentContext = createContext<AdminContentContextValue | null>(null);

export function AdminContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AdminContent>(defaultContent);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setContent(mergeContent(defaultContent(), JSON.parse(saved)));
      } catch {
        setContent(defaultContent());
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      window.alert("This change could not be saved. Image storage is full.");
    }
  }, [content, ready]);

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
        "Reset all content to defaults? Everything you have written will be lost.",
      )
    ) {
      setContent(defaultContent());
    }
  };

  return (
    <AdminContentContext.Provider value={{ content, setPath, mutate, reset }}>
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
