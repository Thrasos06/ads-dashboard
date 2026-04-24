"use client";

import { useState } from "react";

import { FiltersBar } from "@/components/dashboard/filters-bar";
import { defaultDashboardFilters } from "@/lib/constants";
import { useCampaignPerformance } from "@/hooks/use-campaign-performance";
import { CampaignTable } from "@/features/campaigns/components/campaign-table";
import type { CampaignTableRow } from "@/types/ads";

function isDefaultFilterSelection(filters: typeof defaultDashboardFilters) {
  return (
    filters.dateRange === defaultDashboardFilters.dateRange &&
    filters.platform === defaultDashboardFilters.platform &&
    filters.objective === defaultDashboardFilters.objective &&
    filters.status === defaultDashboardFilters.status
  );
}

export function CampaignsClient({ initialCampaigns }: { initialCampaigns: CampaignTableRow[] }) {
  const [filters, setFilters] = useState(defaultDashboardFilters);
  const { data, isLoading } = useCampaignPerformance(filters, isDefaultFilterSelection(filters) ? initialCampaigns : undefined);

  return (
    <>
      <FiltersBar filters={filters} onChange={setFilters} />
      {data ? <CampaignTable campaigns={data} /> : <div className="surface-panel h-80 animate-pulse rounded-[2rem] bg-white/70" aria-hidden="true" />}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isLoading ? "Refreshing campaign performance table." : "Campaign performance table loaded."}
      </p>
    </>
  );
}
