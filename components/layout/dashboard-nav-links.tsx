"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { BarChart3, FolderKanban, LayoutDashboard, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: FolderKanban },
  { href: "/analytics", label: "Analytics", icon: BarChart3, disabled: true },
  { href: "/creatives", label: "Creatives", icon: Sparkles, disabled: true },
] satisfies Array<{ href: Route; label: string; icon: ComponentType<{ className?: string }>; disabled?: boolean }>;

export function DashboardNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        const className = cn(
          "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
          active ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "text-slate-600 hover:bg-white hover:text-slate-950",
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
  );
}
