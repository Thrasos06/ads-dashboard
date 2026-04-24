import { Download, SlidersHorizontal } from "lucide-react";

import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { QueryProvider } from "@/components/providers/query-provider";
import { Button } from "@/components/ui/button";
import { OverviewClient } from "@/features/dashboard/components/overview-client";
import { getDashboardOverview } from "@/lib/api/mock-ads";
import { defaultDashboardFilters } from "@/lib/constants";

export default async function DashboardOverviewPage() {
  const initialOverview = await getDashboardOverview(defaultDashboardFilters);

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
      <QueryProvider>
        <OverviewClient initialOverview={initialOverview} />
      </QueryProvider>
    </div>
  );
}
