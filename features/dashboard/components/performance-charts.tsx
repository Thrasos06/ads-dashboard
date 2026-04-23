"use client";

import { Pie, PieChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency, formatDecimal } from "@/lib/formatters";
import type { DashboardOverview } from "@/types/ads";

const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

function getTrendSummary(overview: DashboardOverview) {
  const first = overview.spendTrend[0];
  const last = overview.spendTrend[overview.spendTrend.length - 1];

  if (!first || !last) {
    return "No spend trend data is available for the current filters.";
  }

  const spendDirection = last.spend >= first.spend ? "up" : "down";
  const conversionDirection = last.conversions >= first.conversions ? "up" : "down";

  return `Spend ended ${spendDirection} at ${formatCurrency(last.spend)} and conversions ended ${conversionDirection} at ${formatCompactNumber(last.conversions)} in the latest period shown.`;
}

function getBudgetSummary(overview: DashboardOverview) {
  const topPlatform = [...overview.budgetAllocation].sort((a, b) => b.value - a.value)[0];

  if (!topPlatform) {
    return "No budget allocation data is available for the current filters.";
  }

  return `${topPlatform.platform} has the largest budget allocation at ${formatCurrency(topPlatform.value)}.`;
}

function getPlatformSummary(overview: DashboardOverview) {
  const topSpend = [...overview.platformComparison].sort((a, b) => b.spend - a.spend)[0];
  const topConversions = [...overview.platformComparison].sort((a, b) => b.conversions - a.conversions)[0];

  if (!topSpend || !topConversions) {
    return "No platform comparison data is available for the current filters.";
  }

  return `${topSpend.platform} leads spend at ${formatCurrency(topSpend.spend)}, while ${topConversions.platform} leads conversions at ${formatCompactNumber(topConversions.conversions)}.`;
}

export function PerformanceCharts({ overview }: { overview: DashboardOverview }) {
  const trendSummary = getTrendSummary(overview);
  const budgetSummary = getBudgetSummary(overview);
  const platformSummary = getPlatformSummary(overview);

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <Card className="xl:col-span-7">
        <CardHeader>
          <CardTitle>Spend and conversion momentum</CardTitle>
          <CardDescription>Track budget pacing alongside downstream conversion volume.</CardDescription>
          <p className="text-sm text-slate-600">{trendSummary}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div aria-hidden="true" className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview.spendTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.24)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={formatCompactNumber} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [name === "spend" ? formatCurrency(value) : value, name === "spend" ? "Spend" : "Conversions"]}
                  contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }}
                />
                <Line yAxisId="left" type="monotone" dataKey="spend" name="Spend" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={false} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversions"
                  name="Conversions"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-900">Blue line:</span> spend
            </p>
            <p>
              <span className="font-semibold text-slate-900">Green line:</span> conversions
            </p>
          </div>
          <div className="sr-only">
            <h4>Spend and conversion data table</h4>
            <table>
              <caption>Spend and conversions by date.</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Spend</th>
                  <th scope="col">Conversions</th>
                  <th scope="col">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {overview.spendTrend.map((entry) => (
                  <tr key={entry.date}>
                    <th scope="row">{entry.date}</th>
                    <td>{formatCurrency(entry.spend)}</td>
                    <td>{formatCompactNumber(entry.conversions)}</td>
                    <td>{formatDecimal(entry.roas)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-5">
        <CardHeader>
          <CardTitle>Budget allocation</CardTitle>
          <CardDescription>Channel mix for active budget planning across platforms.</CardDescription>
          <p className="text-sm text-slate-600">{budgetSummary}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div aria-hidden="true" className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overview.budgetAllocation} dataKey="value" nameKey="platform" innerRadius={72} outerRadius={110} paddingAngle={3}>
                  {overview.budgetAllocation.map((entry, index) => (
                    <Cell key={entry.platform} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Budget"]} contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="grid gap-2 text-sm text-slate-600">
            {overview.budgetAllocation.map((entry, index) => (
              <li key={entry.platform} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-3 rounded-full"
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="text-slate-900">{entry.platform}</span>
                </span>
                <span className="font-medium text-slate-700">{formatCurrency(entry.value)}</span>
              </li>
            ))}
          </ul>
          <div className="sr-only">
            <h4>Budget allocation data table</h4>
            <table>
              <caption>Budget allocation by platform.</caption>
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col">Budget</th>
                </tr>
              </thead>
              <tbody>
                {overview.budgetAllocation.map((entry) => (
                  <tr key={entry.platform}>
                    <th scope="row">{entry.platform}</th>
                    <td>{formatCurrency(entry.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-6">
        <CardHeader>
          <CardTitle>Platform comparison</CardTitle>
          <CardDescription>Spend and conversion volume by media channel.</CardDescription>
          <p className="text-sm text-slate-600">{platformSummary}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div aria-hidden="true" className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.platformComparison}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.24)" />
                <XAxis dataKey="platform" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={formatCompactNumber} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }}
                  formatter={(value: number, name: string) => [name === "spend" ? formatCurrency(value) : value, name === "spend" ? "Spend" : "Conversions"]}
                />
                <Bar dataKey="spend" name="Spend" fill="hsl(var(--chart-2))" radius={[10, 10, 0, 0]} />
                <Bar dataKey="conversions" name="Conversions" fill="hsl(var(--chart-1))" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-900">Teal bars:</span> spend
            </p>
            <p>
              <span className="font-semibold text-slate-900">Blue bars:</span> conversions
            </p>
          </div>
          <div className="sr-only">
            <h4>Platform comparison data table</h4>
            <table>
              <caption>Spend, conversions, and ROAS by platform.</caption>
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col">Spend</th>
                  <th scope="col">Conversions</th>
                  <th scope="col">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {overview.platformComparison.map((entry) => (
                  <tr key={entry.platform}>
                    <th scope="row">{entry.platform}</th>
                    <td>{formatCurrency(entry.spend)}</td>
                    <td>{formatCompactNumber(entry.conversions)}</td>
                    <td>{formatDecimal(entry.roas)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-6">
        <CardHeader>
          <CardTitle>Top-performing campaigns</CardTitle>
          <CardDescription>Best return-driving initiatives in the current selection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {overview.topCampaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-950">{campaign.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{campaign.platform}</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  {formatDecimal(campaign.roas)}x ROAS
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Spend</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatCurrency(campaign.spend)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Conversions</p>
                  <p className="mt-1 font-semibold text-slate-900">{campaign.conversions}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
