"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  MapPin,
  BarChart3,
} from "lucide-react";
import type { PricePoint } from "@/lib/crop-data";

interface PriceDisplayProps {
  crop: string;
  market: string;
  price: number | null;
  priceChange: {
    value: number;
    percentage: number;
    isPositive: boolean;
  } | null;
  history7d: PricePoint[];
  isLoading: boolean;
}

export function PriceDisplay({
  crop,
  market,
  price,
  priceChange,
  history7d,
  isLoading,
}: PriceDisplayProps) {
  if (isLoading) {
    return <PriceDisplaySkeleton />;
  }

  if (!crop) {
    return (
      <Card className="border-dashed border-border bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-center text-muted-foreground">
            Select a crop to view today&apos;s market price
          </p>
        </CardContent>
      </Card>
    );
  }

  const minPrice =
    history7d.length > 0
      ? Math.min(...history7d.map((p) => p.price))
      : null;
  const maxPrice =
    history7d.length > 0
      ? Math.max(...history7d.map((p) => p.price))
      : null;

  return (
    <Card className="overflow-hidden border-primary/20 bg-card shadow-md transition-shadow hover:shadow-lg">
      <div className="h-1.5 bg-primary" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl text-foreground">
              {crop}
            </CardTitle>
            {market && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {market}
              </div>
            )}
          </div>
          <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-0">
            Updated Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {"Today's Price (per Quintal)"}
            </span>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="h-7 w-7 text-foreground" />
              <span className="font-display text-5xl font-bold tracking-tight text-foreground">
                {price?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {priceChange && (
            <div
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ${
                priceChange.isPositive
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {priceChange.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {priceChange.isPositive ? "+" : "-"}
              {priceChange.percentage.toFixed(1)}%
            </div>
          )}
        </div>

        {minPrice !== null && maxPrice !== null && (
          <div className="mt-4 flex gap-6 border-t border-border/60 pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">7d Low</span>
              <span className="text-sm font-semibold text-foreground">
                {"₹"}{minPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">7d High</span>
              <span className="text-sm font-semibold text-foreground">
                {"₹"}{maxPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">7d Avg</span>
              <span className="text-sm font-semibold text-foreground">
                {"₹"}
                {Math.round(
                  history7d.reduce((a, b) => a + b.price, 0) / history7d.length
                ).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PriceDisplaySkeleton() {
  return (
    <Card className="border-primary/20 bg-card">
      <div className="h-1.5 bg-primary/30" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-40 mb-2" />
        <Skeleton className="h-14 w-56" />
        <div className="mt-4 flex gap-6 border-t border-border/60 pt-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
