import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency, formatDecimal, formatPercent } from "@/lib/formatters";
import type { OverviewMetric } from "@/types/ads";

function formatMetric(metric: OverviewMetric) {
  switch (metric.format) {
    case "currency":
      return formatCurrency(metric.value);
    case "compact":
      return formatCompactNumber(metric.value);
    case "percent":
      return formatPercent(metric.value);
    case "decimal":
    default:
      return formatDecimal(metric.value);
  }
}

export function MetricCard({ metric }: { metric: OverviewMetric }) {
  const positive = metric.change >= 0;
  const ChangeIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{formatMetric(metric)}</p>
          </div>
          <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            <span className="flex items-center gap-1">
              <ChangeIcon className="size-4" />
              {formatPercent(Math.abs(metric.change))}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">{metric.changeLabel}</p>
      </CardContent>
    </Card>
  );
}
