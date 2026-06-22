"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Report } from "@/services/db";

// Dynamically load the Leaflet map with SSR disabled to avoid SSR errors
const MapComponentInternal = dynamic(
  () => import("./MapComponentInternal"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted/40 flex items-center justify-center text-sm text-muted-foreground font-medium border border-border rounded-lg min-h-[400px]">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Initialising Smart-City Map Engine...</span>
        </div>
      </div>
    )
  }
);

interface MapProps {
  reports: Report[];
  onReportSelect?: (report: Report) => void;
  selectedReport?: Report | null;
}

export default function MapComponent({ reports, onReportSelect, selectedReport }: MapProps) {
  return (
    <MapComponentInternal
      reports={reports}
      onReportSelect={onReportSelect}
      selectedReport={selectedReport}
    />
  );
}
