"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { type ComponentType, type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, FolderKanban, LayoutDashboard, Menu, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: FolderKanban },
  { href: "/analytics", label: "Analytics", icon: BarChart3, disabled: true },
  { href: "/creatives", label: "Creatives", icon: Sparkles, disabled: true },
] satisfies Array<{ href: Route; label: string; icon: ComponentType<{ className?: string }>; disabled?: boolean }>;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
          <BarChart3 className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Portfolio Build</p>
          <h1 className="text-lg font-semibold text-slate-950">Ads Dashboard</h1>
        </div>
      </div>

      <nav aria-label="Primary" className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const className = cn(
            "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
            active
              ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
              : "text-slate-600 hover:bg-white hover:text-slate-950",
            item.disabled && "pointer-events-none opacity-50",
          );

          if (item.disabled) {
            return (
              <div key={item.href} className={className} aria-disabled="true">
                <span className="flex items-center gap-3">
                  <Icon className="size-4" />
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={className} aria-current={active ? "page" : undefined}>
              <span className="flex items-center gap-3">
                <Icon className="size-4" />
                {item.label}
              </span>
              {active ? <span className="text-xs text-slate-300">Live</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5">
        <p className="text-sm font-semibold text-slate-950">Agency-ready shell</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Built to showcase performance reporting, campaign monitoring, and scalable product structure.
        </p>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const drawerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  function handleDrawerKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements || focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="surface-panel hidden w-[280px] shrink-0 rounded-[2rem] p-6 lg:block">
          <SidebarContent />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="surface-panel sticky top-4 z-30 flex items-center justify-between rounded-[2rem] px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Digital Advertising Intelligence</p>
              <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Performance command center</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right sm:block">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                <p className="text-sm font-semibold text-slate-900">Northstar Media</p>
              </div>
              <Button
                ref={triggerRef}
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation"
                aria-expanded={isOpen}
                aria-controls={drawerId}
                aria-haspopup="dialog"
              >
                <Menu className="size-5" />
              </Button>
            </div>
          </header>

          <main id="main-content" className="pb-8" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation overlay"
            />
            <motion.aside
              id={drawerId}
              ref={drawerRef}
              className="surface-panel fixed inset-y-4 left-4 z-50 w-[min(86vw,320px)] rounded-[2rem] p-6 lg:hidden"
              initial={shouldReduceMotion ? false : { x: -40, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { x: 0, opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { x: -40, opacity: 0 }}
              transition={shouldReduceMotion ? undefined : { duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-label="Primary navigation"
              onKeyDown={handleDrawerKeyDown}
            >
              <div className="mb-5 flex justify-end">
                <Button ref={closeButtonRef} variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close navigation">
                  <X className="size-5" />
                </Button>
              </div>
              <SidebarContent onNavigate={() => setIsOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
