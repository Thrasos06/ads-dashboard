import { z } from "zod";

export const platformSchema = z.enum(["Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads"]);
export const campaignObjectiveSchema = z.enum(["Lead Generation", "Conversions", "Brand Awareness", "Traffic"]);
export const campaignStatusSchema = z.enum(["Active", "Paused", "Learning", "Completed"]);
export const dateRangeSchema = z.enum(["7d", "14d", "30d"]);

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: platformSchema,
  objective: campaignObjectiveSchema,
  budget: z.number(),
  spend: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  revenue: z.number(),
  status: campaignStatusSchema,
});

export const dailyMetricSchema = z.object({
  date: z.string(),
  spend: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  revenue: z.number(),
  platform: platformSchema,
  campaignId: z.string(),
});

export const creativeInsightSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: platformSchema,
  format: z.string(),
  ctr: z.number(),
  cvr: z.number(),
  engagements: z.number(),
  conversions: z.number(),
});

export const mockAdsDataSchema = z.object({
  campaigns: z.array(campaignSchema),
  dailyMetrics: z.array(dailyMetricSchema),
  creatives: z.array(creativeInsightSchema),
});

export type CampaignRecord = z.infer<typeof campaignSchema>;
export type DailyMetricRecord = z.infer<typeof dailyMetricSchema>;
export type CreativeInsightRecord = z.infer<typeof creativeInsightSchema>;
export type MockAdsDataRecord = z.infer<typeof mockAdsDataSchema>;
