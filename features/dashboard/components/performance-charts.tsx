"use client";

import { Pie, PieChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency, formatDecimal } from "@/lib/formatters";
import type { DashboardOverview } from "@/types/ads";

const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export function PerformanceCharts({ overview }: { overview: DashboardOverview }) {
  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <Card className="xl:col-span-7">
        <CardHeader>
          <CardTitle>Spend and conversion momentum</CardTitle>
          <CardDescription>Track budget pacing alongside downstream conversion volume.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
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
              <Line yAxisId="left" type="monotone" dataKey="spend" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="hsl(var(--chart-4))" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="xl:col-span-5">
        <CardHeader>
          <CardTitle>Budget allocation</CardTitle>
          <CardDescription>Channel mix for active budget planning across platforms.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
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
        </CardContent>
      </Card>

      <Card className="xl:col-span-6">
        <CardHeader>
          <CardTitle>Platform comparison</CardTitle>
          <CardDescription>Spend and conversion volume by media channel.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overview.platformComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.24)" />
              <XAxis dataKey="platform" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={formatCompactNumber} />
              <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }} formatter={(value: number, name: string) => [name === "spend" ? formatCurrency(value) : value, name === "spend" ? "Spend" : "Conversions"]} />
              <Bar dataKey="spend" fill="hsl(var(--chart-2))" radius={[10, 10, 0, 0]} />
              <Bar dataKey="conversions" fill="hsl(var(--chart-1))" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
