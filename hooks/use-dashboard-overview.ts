"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardOverview } from "@/lib/api/mock-ads";
import { dashboardKeys } from "@/lib/query-keys";
import type { DashboardFilters, DashboardOverview } from "@/types/ads";

export function useDashboardOverview(filters: DashboardFilters, initialData?: DashboardOverview) {
  return useQuery({
    queryKey: dashboardKeys.overview(filters),
    queryFn: () => getDashboardOverview(filters),
    initialData,
  });
}
