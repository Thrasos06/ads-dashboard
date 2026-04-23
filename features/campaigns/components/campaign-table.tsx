"use client";

import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompactNumber, formatCurrency, formatDecimal } from "@/lib/formatters";
import type { CampaignTableRow } from "@/types/ads";

type SortKey = keyof Pick<CampaignTableRow, "name" | "platform" | "budget" | "spend" | "clicks" | "conversions" | "roas" | "status">;

export function CampaignTable({ campaigns }: { campaigns: CampaignTableRow[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const filteredCampaigns = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const result = campaigns.filter((campaign) => {
      return (
        campaign.name.toLowerCase().includes(normalized) ||
        campaign.platform.toLowerCase().includes(normalized) ||
        campaign.objective.toLowerCase().includes(normalized)
      );
    });

    result.sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];

      if (typeof first === "number" && typeof second === "number") {
        return sortDirection === "asc" ? first - second : second - first;
      }

      const comparison = String(first).localeCompare(String(second));
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [campaigns, search, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filteredCampaigns.length / pageSize));
  const paginatedCampaigns = filteredCampaigns.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection("desc");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search campaigns, objectives, or platforms" className="pl-10" />
        </div>
        <p className="text-sm text-slate-500">{filteredCampaigns.length} campaigns in current view</p>
      </div>

      <div className="surface-panel overflow-hidden rounded-[2rem]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort("name")}>
                  Campaign
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Objective</TableHead>
              <TableHead>
                <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort("budget")}>
                  Budget
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort("spend")}>
                  Spend
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort("clicks")}>
                  Clicks
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort("conversions")}>
                  Conversions
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort("roas")}>
                  ROAS
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort("status")}>
                  Status
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-950">{campaign.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{formatCompactNumber(campaign.impressions)} impressions</p>
                  </div>
                </TableCell>
                <TableCell>{campaign.platform}</TableCell>
                <TableCell>{campaign.objective}</TableCell>
                <TableCell>{formatCurrency(campaign.budget)}</TableCell>
                <TableCell>{formatCurrency(campaign.spend)}</TableCell>
                <TableCell>{formatCompactNumber(campaign.clicks)}</TableCell>
                <TableCell>{campaign.conversions}</TableCell>
                <TableCell>
                  <span className="font-semibold text-emerald-700">{formatDecimal(campaign.roas)}x</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      campaign.status === "Active"
                        ? "success"
                        : campaign.status === "Paused"
                          ? "warning"
                          : campaign.status === "Completed"
                            ? "secondary"
                            : "info"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-slate-200/80 px-4 py-4">
          <p className="text-sm text-slate-500">
            Page {page} of {pageCount}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
              <ChevronLeft className="mr-1 size-4" />
              Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount}>
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
