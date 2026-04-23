"use client";

import { motion } from "framer-motion";
import { Download, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { FiltersBar } from "@/components/dashboard/filters-bar";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { defaultDashboardFilters } from "@/lib/constants";
import { useDashboardOverview } from "@/hooks/use-dashboard-overview";
import { CreativeInsights } from "@/features/dashboard/components/creative-insights";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { PerformanceCharts } from "@/features/dashboard/components/performance-charts";

export function OverviewClient() {
  const [filters, setFilters] = useState(defaultDashboardFilters);
  const { data, isLoading } = useDashboardOverview(filters);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Overview"
        title="Advertising performance at a glance"
        description="A portfolio-grade overview built like a production analytics product, with reusable filters, validated mock data, and query-driven charts ready for a real backend later."
        actions={
          <>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 size-4" />
              Saved view
            </Button>
            <Button>
              <Download className="mr-2 size-4" />
              Export snapshot
            </Button>
          </>
        }
      />

      <FiltersBar filters={filters} onChange={setFilters} />

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {(data?.metrics ?? Array.from({ length: 8 })).map((metric, index) => (
          <motion.div
            key={metric?.label ?? index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.03 }}
          >
            {metric ? (
              <MetricCard metric={metric} />
            ) : (
              <div className="surface-panel h-[148px] animate-pulse rounded-3xl bg-white/70" />
            )}
          </motion.div>
        ))}
      </section>

      {data ? <PerformanceCharts overview={data} /> : null}
      {data ? <CreativeInsights overview={data} /> : null}

      {isLoading ? <p className="text-sm text-slate-500">Refreshing dashboard metrics...</p> : null}
    </div>
  );
}
