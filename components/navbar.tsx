"use client";

import { MapPin, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  selectedDistrict: string;
  selectedMandal: string;
  onOpenLocation: () => void;
}

export function Navbar({
  selectedDistrict,
  selectedMandal,
  onOpenLocation,
}: NavbarProps) {
  const locationLabel =
    selectedMandal && selectedDistrict
      ? `${selectedMandal}, ${selectedDistrict}`
      : selectedDistrict || "Telangana";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-card/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            CropPrice Tracker
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/30 text-foreground hover:bg-primary/10 hover:text-primary"
          onClick={onOpenLocation}
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">{locationLabel}</span>
          <span className="sm:hidden">Location</span>
        </Button>
      </nav>
    </header>
  );
}
