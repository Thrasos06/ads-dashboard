export type Platform = "Google Ads" | "Meta Ads" | "LinkedIn Ads" | "TikTok Ads";

export type CampaignObjective = "Lead Generation" | "Conversions" | "Brand Awareness" | "Traffic";

export type CampaignStatus = "Active" | "Paused" | "Learning" | "Completed";

export type DateRangePreset = "7d" | "14d" | "30d";

export interface DashboardFilters {
  dateRange: DateRangePreset;
  platform: Platform | "All";
  objective: CampaignObjective | "All";
  status: CampaignStatus | "All";
}

export interface OverviewMetric {
  label: string;
  value: number;
  change: number;
  changeLabel: string;
  format: "currency" | "compact" | "decimal" | "percent";
}

export interface DashboardOverview {
  metrics: OverviewMetric[];
  spendTrend: Array<{ date: string; spend: number; conversions: number; roas: number }>;
  platformComparison: Array<{ platform: Platform; spend: number; conversions: number; roas: number }>;
  budgetAllocation: Array<{ platform: Platform; value: number }>;
  topCampaigns: Array<{
    id: string;
    name: string;
    platform: Platform;
    roas: number;
    spend: number;
    conversions: number;
  }>;
  creativeInsights: Array<{
    id: string;
    name: string;
    platform: Platform;
    format: string;
    ctr: number;
    cvr: number;
    engagements: number;
    conversions: number;
  }>;
}

export interface CampaignTableRow {
  id: string;
  name: string;
  platform: Platform;
  objective: CampaignObjective;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  status: CampaignStatus;
}
