"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { FiltersBar } from "@/components/dashboard/filters-bar";
import { defaultDashboardFilters } from "@/lib/constants";
import { useDashboardOverview } from "@/hooks/use-dashboard-overview";
import { CreativeInsights } from "@/features/dashboard/components/creative-insights";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import type { DashboardOverview } from "@/types/ads";

const PerformanceCharts = dynamic(
  () => import("@/features/dashboard/components/performance-charts").then((mod) => mod.PerformanceCharts),
  {
    ssr: false,
    loading: () => <div className="surface-panel h-[420px] animate-pulse rounded-[2rem] bg-white/70" aria-hidden="true" />,
  },
);

function isDefaultFilterSelection(filters: typeof defaultDashboardFilters) {
  return (
    filters.dateRange === defaultDashboardFilters.dateRange &&
    filters.platform === defaultDashboardFilters.platform &&
    filters.objective === defaultDashboardFilters.objective &&
    filters.status === defaultDashboardFilters.status
  );
}

export function OverviewClient({ initialOverview }: { initialOverview: DashboardOverview }) {
  const [filters, setFilters] = useState(defaultDashboardFilters);
  const { data, isLoading } = useDashboardOverview(filters, isDefaultFilterSelection(filters) ? initialOverview : undefined);
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <FiltersBar filters={filters} onChange={setFilters} />

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {(data?.metrics ?? Array.from({ length: 8 })).map((metric, index) => (
          <motion.div
            key={metric?.label ?? index}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.28, delay: index * 0.03 }}
          >
            {metric ? (
              <MetricCard metric={metric} />
            ) : (
              <div
                className={`surface-panel h-[148px] rounded-3xl bg-white/70 ${shouldReduceMotion ? "" : "animate-pulse"}`}
                aria-hidden="true"
              />
            )}
          </motion.div>
        ))}
      </section>

      {data ? <PerformanceCharts overview={data} /> : null}
      {data ? <CreativeInsights overview={data} /> : null}

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isLoading ? "Refreshing dashboard metrics." : "Dashboard metrics loaded."}
      </p>
      {isLoading ? <p className="text-sm text-slate-500" aria-hidden="true">Refreshing dashboard metrics...</p> : null}
    </>
  );
}
