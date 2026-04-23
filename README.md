# Ads Dashboard

Portfolio-quality digital advertising analytics dashboard built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Recharts, TanStack Query, Zod, Lucide React, and Framer Motion.

## Proposed structure

```text
app/
  (dashboard)/
    campaigns/
    analytics/
    creatives/
components/
  dashboard/
  layout/
  providers/
  ui/
data/
  mock/
features/
  campaigns/components/
  dashboard/components/
hooks/
lib/
  api/
  validators/
types/
```

## Data model

- `Campaign`: campaign-level rollup used for the table and summary KPIs
- `DailyMetric`: time-series records used by charts and trend analysis
- `CreativeInsight`: creative-level engagement and conversion snapshots
- `DashboardFilters`: shared query state for date range, platform, objective, and status
- `DashboardOverview`: aggregated shape that feeds the overview page UI

## Reusable components

- `DashboardShell`: responsive sidebar + topbar app shell
- `DashboardPageHeader`: consistent page intro and actions
- `FiltersBar`: shared dashboard filters
- `MetricCard`: reusable KPI card for summary metrics
- `PerformanceCharts`: grouped Recharts section for trend and comparison views
- `CampaignTable`: sortable, searchable, paginated table scaffold
- `components/ui/*`: shadcn-style base primitives for buttons, cards, badges, tables, inputs, and selects

## Roadmap

1. Foundation
   Create app shell, typed domain models, mock API layer, query setup, and overview route.
2. Reporting depth
   Expand analytics pages, compare date ranges, add saved reports, and richer drill-downs.
3. Platform polish
   Add dark mode, auth, export flows, empty states, loading states, and accessibility hardening.
4. Real backend
   Replace mock API with route handlers, Supabase, or warehouse-backed queries while preserving the UI and hook contracts.

## Key architecture decisions

- App Router stays server-first, while client boundaries are limited to interactive filters, queries, tables, charts, and motion.
- TanStack Query is wired now, even with mocked async functions, so the app already behaves like a real SaaS frontend.
- Zod validates mock datasets up front to keep future API integration and refactors safer.
- The structure is feature-oriented above the shared UI layer, which makes it easier to scale pages without turning the app into a flat components folder.
