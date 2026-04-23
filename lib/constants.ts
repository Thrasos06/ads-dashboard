import type { CampaignObjective, CampaignStatus, DashboardFilters, Platform } from "@/types/ads";

export const platforms: Array<Platform | "All"> = ["All", "Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads"];

export const objectives: Array<CampaignObjective | "All"> = [
  "All",
  "Lead Generation",
  "Conversions",
  "Brand Awareness",
  "Traffic",
];

export const statuses: Array<CampaignStatus | "All"> = ["All", "Active", "Paused", "Learning", "Completed"];

export const defaultDashboardFilters: DashboardFilters = {
  dateRange: "14d",
  platform: "All",
  objective: "All",
  status: "All",
};
