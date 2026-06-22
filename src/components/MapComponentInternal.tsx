"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { Report, MAP_CENTER } from "@/services/db";

// Helper component to programmatically pan/zoom the map
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

interface MapInternalProps {
  reports: Report[];
  onReportSelect?: (report: Report) => void;
  selectedReport?: Report | null;
}

export default function MapComponentInternal({
  reports,
  onReportSelect,
  selectedReport
}: MapInternalProps) {
  // Create beautiful custom marker icons using Tailwind classes
  const createCustomIcon = (report: Report) => {
    let colorClass = "bg-amber-500 ring-amber-300"; // Default Warning (Yellow)
    let dotClass = "bg-amber-600";
    let pulseClass = "";

    if (report.status === "Resolved") {
      colorClass = "bg-emerald-500 ring-emerald-300"; // Success (Green)
      dotClass = "bg-emerald-600";
    } else {
      if (report.severity >= 8) {
        colorClass = "bg-red-500 ring-red-300"; // Critical (Red)
        dotClass = "bg-red-600";
        pulseClass = "animate-ping opacity-75 absolute inline-flex h-full w-full rounded-full bg-red-400";
      } else if (report.severity >= 5) {
        colorClass = "bg-orange-500 ring-orange-300"; // High (Orange)
        dotClass = "bg-orange-600";
      } else {
        colorClass = "bg-amber-500 ring-amber-300"; // Moderate (Yellow)
        dotClass = "bg-amber-600";
      }
    }

    const html = `
      <div class="relative flex items-center justify-center w-8 h-8">
        <span class="${pulseClass}"></span>
        <div class="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-md ${colorClass} transition-all duration-300 hover:scale-125">
          <div class="w-2 h-2 rounded-full ${dotClass}"></div>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: "custom-leaflet-icon",
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const center: [number, number] = selectedReport
    ? [selectedReport.latitude, selectedReport.longitude]
    : MAP_CENTER;

  const zoom = selectedReport ? 15 : 13;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Dynamic Map panning */}
        <MapController center={center} zoom={zoom} />

        {/* Position Zoom controls to bottom right */}
        <div className="leaflet-bottom leaflet-right !mb-4 !mr-4">
          <div className="leaflet-control leaflet-bar flex flex-col gap-0.5 border border-border shadow-sm rounded-lg overflow-hidden">
            <button 
              onClick={(e) => {
                e.preventDefault();
                // MapContainer handles zoom through map context; standard leaflet button action
              }}
              className="w-8 h-8 flex items-center justify-center bg-card text-foreground hover:bg-secondary border-b border-border text-sm font-semibold"
              title="Zoom in"
            >
              +
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
              }}
              className="w-8 h-8 flex items-center justify-center bg-card text-foreground hover:bg-secondary text-sm font-semibold"
              title="Zoom out"
            >
              -
            </button>
          </div>
        </div>

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(report)}
            eventHandlers={{
              click: () => {
                if (onReportSelect) onReportSelect(report);
              }
            }}
          />
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3.5 shadow-sm text-card-foreground z-[1000] max-w-xs">
        <h4 className="text-xs font-bold text-foreground mb-2">Severity & Status</h4>
        <div className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm"></span>
            <span>Resolved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm"></span>
            <span>Moderate (Severity 1-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-sm"></span>
            <span>High Priority (Severity 5-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm animate-pulse"></span>
            <span>Critical (Severity 8-10)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
