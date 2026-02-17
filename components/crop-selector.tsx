"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CROPS } from "@/lib/crop-data";
import { Sprout } from "lucide-react";

interface CropSelectorProps {
  selectedCrop: string;
  onCropChange: (crop: string) => void;
}

export function CropSelector({ selectedCrop, onCropChange }: CropSelectorProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Sprout className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">
          Select Crop
        </h2>
      </div>
      <Select value={selectedCrop} onValueChange={onCropChange}>
        <SelectTrigger className="w-full max-w-sm border-primary/20 bg-card text-foreground shadow-sm transition-shadow hover:shadow-md focus:ring-primary/30">
          <SelectValue placeholder="Choose a crop to track" />
        </SelectTrigger>
        <SelectContent>
          {CROPS.map((crop) => (
            <SelectItem key={crop} value={crop}>
              {crop}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
