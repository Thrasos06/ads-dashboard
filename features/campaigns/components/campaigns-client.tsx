"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import { FiltersBar } from "@/components/dashboard/filters-bar";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { defaultDashboardFilters } from "@/lib/constants";
import { useCampaignPerformance } from "@/hooks/use-campaign-performance";
import { CampaignTable } from "@/features/campaigns/components/campaign-table";

export function CampaignsClient() {
  const [filters, setFilters] = useState(defaultDashboardFilters);
  const { data } = useCampaignPerformance(filters);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Campaign Performance"
        title="Manage performance across channels"
        description="A sortable, filterable campaign table with portfolio-quality structure that can later be swapped to a real API or warehouse-backed dataset with minimal UI churn."
        actions={
          <Button>
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
        }
      />

      <FiltersBar filters={filters} onChange={setFilters} />
      {data ? <CampaignTable campaigns={data} /> : <div className="surface-panel h-80 animate-pulse rounded-[2rem] bg-white/70" />}
    </div>
  );
}
