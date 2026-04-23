"use client";

import { CalendarRange, Filter } from "lucide-react";

import { Select } from "@/components/ui/select";
import { defaultDashboardFilters, objectives, platforms, statuses } from "@/lib/constants";
import type { DashboardFilters } from "@/types/ads";

const dateRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
] as const;

export function FiltersBar({
  filters,
  onChange,
}: {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
}) {
  return (
    <div className="surface-panel rounded-[2rem] p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <Filter className="size-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-950">Performance filters</p>
            <p>Refine channel mix, objectives, and lifecycle state.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label className="text-sm">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <CalendarRange className="size-3.5" />
              Date Range
            </span>
            <Select
              value={filters.dateRange}
              onChange={(event) => onChange({ ...filters, dateRange: event.target.value as DashboardFilters["dateRange"] })}
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Platform</span>
            <Select
              value={filters.platform}
              onChange={(event) => onChange({ ...filters, platform: event.target.value as DashboardFilters["platform"] })}
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </Select>
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Objective</span>
            <Select
              value={filters.objective}
              onChange={(event) => onChange({ ...filters, objective: event.target.value as DashboardFilters["objective"] })}
            >
              {objectives.map((objective) => (
                <option key={objective} value={objective}>
                  {objective}
                </option>
              ))}
            </Select>
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</span>
            <Select
              value={filters.status}
              onChange={(event) => onChange({ ...filters, status: event.target.value as DashboardFilters["status"] })}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </label>

          <button
            type="button"
            className="mt-auto h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => onChange(defaultDashboardFilters)}
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}
