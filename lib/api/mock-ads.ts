import { mockAdsData } from "@/data/mock/ads-data";
import type {
  CampaignTableRow,
  DashboardFilters,
  DashboardOverview,
  OverviewMetric,
  Platform,
} from "@/types/ads";

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDaysFromRange(dateRange: DashboardFilters["dateRange"]) {
  switch (dateRange) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "14d":
    default:
      return 14;
  }
}

function matchesFilters<T extends { platform: Platform; objective?: string; status?: string }>(
  item: T,
  filters: DashboardFilters,
) {
  const platformMatch = filters.platform === "All" || item.platform === filters.platform;
  const objectiveMatch = filters.objective === "All" || item.objective === filters.objective;
  const statusMatch = filters.status === "All" || item.status === filters.status;

  return platformMatch && objectiveMatch && statusMatch;
}

function getFilteredCampaigns(filters: DashboardFilters) {
  return mockAdsData.campaigns.filter((campaign) => matchesFilters(campaign, filters));
}

function getFilteredDailyMetrics(filters: DashboardFilters) {
  const filteredCampaignIds = new Set(getFilteredCampaigns(filters).map((campaign) => campaign.id));
  const days = getDaysFromRange(filters.dateRange);

  return mockAdsData.dailyMetrics
    .filter((metric) => filteredCampaignIds.has(metric.campaignId))
    .slice(-days * Math.max(1, filters.platform === "All" ? 4 : 1));
}

function buildOverviewMetrics(filters: DashboardFilters): OverviewMetric[] {
  const campaigns = getFilteredCampaigns(filters);

  const totals = campaigns.reduce(
    (acc, campaign) => {
      acc.spend += campaign.spend;
      acc.impressions += campaign.impressions;
      acc.clicks += campaign.clicks;
      acc.conversions += campaign.conversions;
      acc.revenue += campaign.revenue;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
  );

  const ctr = totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0;
  const cpc = totals.clicks ? totals.spend / totals.clicks : 0;
  const cpa = totals.conversions ? totals.spend / totals.conversions : 0;
  const roas = totals.spend ? totals.revenue / totals.spend : 0;

  return [
    { label: "Total Spend", value: totals.spend, change: 12.4, changeLabel: "vs previous period", format: "currency" },
    { label: "Impressions", value: totals.impressions, change: 8.2, changeLabel: "delivery growth", format: "compact" },
    { label: "Clicks", value: totals.clicks, change: 10.1, changeLabel: "traffic lift", format: "compact" },
    { label: "CTR", value: ctr, change: 1.8, changeLabel: "engagement change", format: "percent" },
    { label: "CPC", value: cpc, change: -3.6, changeLabel: "cost efficiency", format: "currency" },
    { label: "Conversions", value: totals.conversions, change: 14.2, changeLabel: "pipeline impact", format: "compact" },
    { label: "CPA", value: cpa, change: -6.1, changeLabel: "acquisition cost", format: "currency" },
    { label: "ROAS", value: roas, change: 9.3, changeLabel: "return uplift", format: "decimal" },
  ];
}

export async function getDashboardOverview(filters: DashboardFilters): Promise<DashboardOverview> {
  await delay();

  const campaigns = getFilteredCampaigns(filters);
  const dailyMetrics = getFilteredDailyMetrics(filters);
  const metricsByDate = new Map<string, { spend: number; conversions: number; revenue: number }>();
  const platformMap = new Map<Platform, { spend: number; conversions: number; revenue: number }>();

  for (const entry of dailyMetrics) {
    const dayTotals = metricsByDate.get(entry.date) ?? { spend: 0, conversions: 0, revenue: 0 };
    dayTotals.spend += entry.spend;
    dayTotals.conversions += entry.conversions;
    dayTotals.revenue += entry.revenue;
    metricsByDate.set(entry.date, dayTotals);

    const platformTotals = platformMap.get(entry.platform) ?? { spend: 0, conversions: 0, revenue: 0 };
    platformTotals.spend += entry.spend;
    platformTotals.conversions += entry.conversions;
    platformTotals.revenue += entry.revenue;
    platformMap.set(entry.platform, platformTotals);
  }

  return {
    metrics: buildOverviewMetrics(filters),
    spendTrend: Array.from(metricsByDate.entries()).map(([date, values]) => ({
      date,
      spend: values.spend,
      conversions: values.conversions,
      roas: values.spend ? values.revenue / values.spend : 0,
    })),
    platformComparison: Array.from(platformMap.entries()).map(([platform, values]) => ({
      platform,
      spend: values.spend,
      conversions: values.conversions,
      roas: values.spend ? values.revenue / values.spend : 0,
    })),
    budgetAllocation: campaigns.reduce<Array<{ platform: Platform; value: number }>>((acc, campaign) => {
      const existing = acc.find((entry) => entry.platform === campaign.platform);
      if (existing) {
        existing.value += campaign.budget;
      } else {
        acc.push({ platform: campaign.platform, value: campaign.budget });
      }
      return acc;
    }, []),
    topCampaigns: [...campaigns]
      .sort((a, b) => b.revenue / b.spend - a.revenue / a.spend)
      .slice(0, 5)
      .map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platform,
        roas: campaign.spend ? campaign.revenue / campaign.spend : 0,
        spend: campaign.spend,
        conversions: campaign.conversions,
      })),
    creativeInsights: mockAdsData.creatives.filter((creative) => filters.platform === "All" || creative.platform === filters.platform),
  };
}

export async function getCampaignPerformance(filters: DashboardFilters): Promise<CampaignTableRow[]> {
  await delay(250);
  return getFilteredCampaigns(filters).map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    platform: campaign.platform,
    objective: campaign.objective,
    budget: campaign.budget,
    spend: campaign.spend,
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    conversions: campaign.conversions,
    roas: campaign.spend ? campaign.revenue / campaign.spend : 0,
    status: campaign.status,
  }));
}
