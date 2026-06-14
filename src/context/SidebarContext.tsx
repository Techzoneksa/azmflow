"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type SidebarContextValue = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isDesktop: boolean;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) return;
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, isDesktop, toggleCollapsed, openMobile, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
