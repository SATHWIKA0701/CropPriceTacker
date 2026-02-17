"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { CalendarDays, TrendingUp } from "lucide-react";
import type { PricePoint } from "@/lib/crop-data";

interface PriceChartsProps {
  history7d: PricePoint[];
  history30d: PricePoint[];
  crop: string;
  isLoading: boolean;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          {"₹"}{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
}

export function PriceCharts({
  history7d,
  history30d,
  crop,
  isLoading,
}: PriceChartsProps) {
  if (isLoading) {
    return <ChartsSkeleton />;
  }

  if (!crop) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 7-Day Chart */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="font-display text-base text-foreground">
                7-Day Price History
              </CardTitle>
              <CardDescription>
                Daily price trend for {crop}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={history7d}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradient7d" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(152, 60%, 36%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(152, 60%, 36%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(140, 15%, 88%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(152, 60%, 36%)"
                  strokeWidth={2.5}
                  fill="url(#gradient7d)"
                  dot={{
                    r: 4,
                    fill: "hsl(152, 60%, 36%)",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(152, 60%, 36%)",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 30-Day Chart */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <div>
              <CardTitle className="font-display text-base text-foreground">
                30-Day Price Trend
              </CardTitle>
              <CardDescription>
                Monthly price movement for {crop}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={history30d}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(140, 15%, 88%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "hsl(150, 10%, 45%)" }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  width={65}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(80, 55%, 50%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "hsl(80, 55%, 50%)",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60 bg-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
