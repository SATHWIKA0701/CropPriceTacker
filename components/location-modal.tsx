"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  TELANGANA_DISTRICTS,
  MANDALS_BY_DISTRICT,
  MARKETS_BY_MANDAL,
} from "@/lib/crop-data";

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district: string;
  mandal: string;
  market: string;
  onDistrictChange: (value: string) => void;
  onMandalChange: (value: string) => void;
  onMarketChange: (value: string) => void;
}

export function LocationModal({
  open,
  onOpenChange,
  district,
  mandal,
  market,
  onDistrictChange,
  onMandalChange,
  onMarketChange,
}: LocationModalProps) {
  const mandals = district ? MANDALS_BY_DISTRICT[district] || [] : [];
  const markets = mandal ? MARKETS_BY_MANDAL[mandal] || [] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <MapPin className="h-5 w-5 text-primary" />
            Select Location
          </DialogTitle>
          <DialogDescription>
            Choose your district, mandal, and market to see local crop prices.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">State</label>
            <Select value="telangana" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="telangana">Telangana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">District</label>
            <Select value={district} onValueChange={onDistrictChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {TELANGANA_DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Mandal</label>
            <Select
              value={mandal}
              onValueChange={onMandalChange}
              disabled={mandals.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    mandals.length === 0
                      ? "Select a district first"
                      : "Select mandal"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {mandals.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Market</label>
            <Select
              value={market}
              onValueChange={onMarketChange}
              disabled={markets.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    markets.length === 0
                      ? "Select a mandal first"
                      : "Select market"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {markets.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Apply Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
