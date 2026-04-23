"use client";

import { useQuery } from "@tanstack/react-query";

import { getCampaignPerformance } from "@/lib/api/mock-ads";
import { dashboardKeys } from "@/lib/query-keys";
import type { DashboardFilters } from "@/types/ads";

export function useCampaignPerformance(filters: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.campaigns(filters),
    queryFn: () => getCampaignPerformance(filters),
  });
}
