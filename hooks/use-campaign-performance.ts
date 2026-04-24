"use client";

import { useQuery } from "@tanstack/react-query";

import { getCampaignPerformance } from "@/lib/api/mock-ads";
import { dashboardKeys } from "@/lib/query-keys";
import type { CampaignTableRow, DashboardFilters } from "@/types/ads";

export function useCampaignPerformance(filters: DashboardFilters, initialData?: CampaignTableRow[]) {
  return useQuery({
    queryKey: dashboardKeys.campaigns(filters),
    queryFn: () => getCampaignPerformance(filters),
    initialData,
  });
}
