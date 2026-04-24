"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardNavLinks } from "@/components/layout/dashboard-nav-links";

export function MobileNavDrawer() {
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
    const triggerElement = triggerRef.current;
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
      triggerElement?.focus();
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
    <>
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
              <div className="flex h-full flex-col gap-8">
                <DashboardNavLinks onNavigate={() => setIsOpen(false)} />
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
