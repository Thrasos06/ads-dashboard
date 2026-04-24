import { type ReactNode } from "react";
import { BarChart3 } from "lucide-react";

import { DashboardNavLinks } from "@/components/layout/dashboard-nav-links";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";

function SidebarFrame() {
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

      <DashboardNavLinks />

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
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="surface-panel hidden w-[280px] shrink-0 rounded-[2rem] p-6 lg:block">
          <SidebarFrame />
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
              <MobileNavDrawer />
            </div>
          </header>

          <main id="main-content" className="pb-8" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
