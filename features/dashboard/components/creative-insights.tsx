import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber, formatPercent } from "@/lib/formatters";
import type { DashboardOverview } from "@/types/ads";

export function CreativeInsights({ overview }: { overview: DashboardOverview }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Creative insights</CardTitle>
          <CardDescription>Identify which messages and formats are driving engagement and conversion lift.</CardDescription>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Sparkles className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {overview.creativeInsights.map((creative) => (
          <article key={creative.id} className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="info" className="mb-3">
                  {creative.platform}
                </Badge>
                <h3 className="text-base font-semibold text-slate-950">{creative.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{creative.format}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">CTR</p>
                <p className="mt-1 font-semibold text-slate-900">{formatPercent(creative.ctr)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">CVR</p>
                <p className="mt-1 font-semibold text-slate-900">{formatPercent(creative.cvr)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Engagements</p>
                <p className="mt-1 font-semibold text-slate-900">{formatCompactNumber(creative.engagements)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Conversions</p>
                <p className="mt-1 font-semibold text-slate-900">{creative.conversions}</p>
              </div>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
