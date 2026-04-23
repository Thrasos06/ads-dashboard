import type { DashboardFilters } from "@/types/ads";

export const dashboardKeys = {
  overview: (filters: DashboardFilters) => ["dashboard-overview", filters] as const,
  campaigns: (filters: DashboardFilters) => ["campaign-performance", filters] as const,
};
