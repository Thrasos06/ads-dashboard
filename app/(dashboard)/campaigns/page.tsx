import { Download } from "lucide-react";

import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { QueryProvider } from "@/components/providers/query-provider";
import { Button } from "@/components/ui/button";
import { CampaignsClient } from "@/features/campaigns/components/campaigns-client";
import { getCampaignPerformance } from "@/lib/api/mock-ads";
import { defaultDashboardFilters } from "@/lib/constants";

export default async function CampaignsPage() {
  const initialCampaigns = await getCampaignPerformance(defaultDashboardFilters);

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
      <QueryProvider>
        <CampaignsClient initialCampaigns={initialCampaigns} />
      </QueryProvider>
    </div>
  );
}
