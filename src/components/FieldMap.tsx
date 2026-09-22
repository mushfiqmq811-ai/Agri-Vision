import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { GeoField, Language } from "../types";
import { Layers, MapPin, Eye, Info, Bug } from "lucide-react";

interface Props {
  fields: GeoField[];
  selectedField: GeoField;
  onSelectField: (field: GeoField) => void;
  language: Language;
}

export const FieldMap: React.FC<Props> = ({
  fields,
  selectedField,
  onSelectField,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<"standard" | "satellite">("standard");
  const [showNdviOverlay, setShowNdviOverlay] = useState(true);
  const [showMoistureOverlay, setShowMoistureOverlay] = useState(false);
  const [showPestHotspots, setShowPestHotspots] = useState(true);

  const isBn = language === "bn";

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: selectedField.coordinates,
      zoom: 14,
      zoomControl: true,
    });

    const streetTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });

    streetTiles.addTo(map);

    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tile when layer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (activeLayer === "satellite") {
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 18,
        }
      ).addTo(map);
    } else {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
    }
  }, [activeLayer]);

  // Update Polygons & Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    fields.forEach((f) => {
      const isSelected = f.id === selectedField.id;

      // Color coding based on NDVI or Soil Moisture
      let fillColor = "#15803d"; // Default emerald
      let fillOpacity = isSelected ? 0.6 : 0.4;

      if (showNdviOverlay) {
        // Green scale based on NDVI
        if (f.ndviAverage >= 0.75) fillColor = "#15803d";
        else if (f.ndviAverage >= 0.6) fillColor = "#84cc16";
        else if (f.ndviAverage >= 0.4) fillColor = "#eab308";
        else fillColor = "#ef4444";
      } else if (showMoistureOverlay) {
        // Blue scale based on soil moisture
        if (f.currentMoisturePct >= 28) fillColor = "#0284c7";
        else if (f.currentMoisturePct >= 20) fillColor = "#38bdf8";
        else fillColor = "#fb923c";
      }

      const polygon = L.polygon(f.polygon, {
        color: isSelected ? "#047857" : "#334155",
        weight: isSelected ? 3.5 : 1.5,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        dashArray: isSelected ? undefined : "4, 4",
      });

      polygon.on("click", () => {
        onSelectField(f);
      });

      // Popup Content
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 4px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
            ${isBn ? f.nameBn : f.name}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            ${f.district} &bull; ${f.areaBigha} Bigha (${(f.areaBigha * 0.1338).toFixed(1)} ha)
          </div>
          <div style="font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #f8fafc; padding: 6px; border-radius: 6px;">
            <div><strong>Crop:</strong> ${f.variety}</div>
            <div><strong>Stage:</strong> ${isBn ? f.currentStageBn : f.currentStage}</div>
            <div><strong>NDVI:</strong> <span style="color:#15803d; font-weight:700;">${f.ndviAverage}</span></div>
            <div><strong>Moisture:</strong> <strong>${f.currentMoisturePct}%</strong></div>
          </div>
        </div>
      `;

      polygon.bindPopup(popupContent);
      group.addLayer(polygon);

      // Custom DivIcon marker for Field center
      const markerHtml = `
        <div style="background: ${isSelected ? "#047857" : "#0f172a"}; color: #ffffff; border-radius: 12px; padding: 3px 8px; font-size: 11px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid #ffffff; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
          <span>🌱</span>
          <span>${isBn ? f.nameBn.split(" ")[0] : f.name.split(" ")[0]}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "field-marker",
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });

      const marker = L.marker(f.coordinates, { icon: customIcon });
      marker.on("click", () => onSelectField(f));
      group.addLayer(marker);
    });

    // Render Crowdsourced Pest Hotspots if toggled
    if (showPestHotspots) {
      const lat = selectedField.coordinates[0];
      const lon = selectedField.coordinates[1];

      // Simulated hotspot 1: Fungal Blast
      const blastCircle = L.circle([lat + 0.007, lon - 0.006], {
        color: "#dc2626",
        fillColor: "#ef4444",
        fillOpacity: 0.35,
        radius: 350,
      });
      blastCircle.bindPopup(`
        <div style="font-family:system-ui,sans-serif; min-width:160px; padding:2px;">
          <strong style="color:#b91c1c; font-size:12px;">🚨 PEST OUTBREAK HOTSPOT</strong>
          <div style="font-size:11px; margin-top:4px;">
            <strong>Type:</strong> Leaf Blast Fungal Infection<br/>
            <strong>Reports:</strong> 14 Local Farmers<br/>
            <strong>Status:</strong> Active Red Zone<br/>
            <span style="color:#b45309;">⚠️ Researchers alerted automatically</span>
          </div>
        </div>
      `);
      group.addLayer(blastCircle);

      const blastIcon = L.divIcon({
        html: `<div class="animate-pulse flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white font-extrabold text-[10px] border border-white shadow-md">🐛</div>`,
        className: "pest-hotspot-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      group.addLayer(L.marker([lat + 0.007, lon - 0.006], { icon: blastIcon }));

      // Simulated hotspot 2: Bacterial Blight
      const blightCircle = L.circle([lat - 0.008, lon + 0.009], {
        color: "#ea580c",
        fillColor: "#f97316",
        fillOpacity: 0.3,
        radius: 280,
      });
      blightCircle.bindPopup(`
        <div style="font-family:system-ui,sans-serif; min-width:160px; padding:2px;">
          <strong style="color:#ea580c; font-size:12px;">🚨 WARNING ZONE</strong>
          <div style="font-size:11px; margin-top:4px;">
            <strong>Type:</strong> Bacterial Leaf Blight<br/>
            <strong>Reports:</strong> 11 Local Farmers<br/>
            <strong>Status:</strong> Warning Level<br/>
            <span style="color:#1b3b2b;">✓ Microclimate risk evaluated</span>
          </div>
        </div>
      `);
      group.addLayer(blightCircle);

      const blightIcon = L.divIcon({
        html: `<div class="animate-pulse flex items-center justify-center w-6 h-6 rounded-full bg-orange-600 text-white font-extrabold text-[10px] border border-white shadow-md">🦠</div>`,
        className: "pest-hotspot-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      group.addLayer(L.marker([lat - 0.008, lon + 0.009], { icon: blightIcon }));
    }

    // Fly to selected field
    mapInstanceRef.current.flyTo(selectedField.coordinates, 14, {
      duration: 1.2,
    });
  }, [fields, selectedField, showNdviOverlay, showMoistureOverlay, showPestHotspots, isBn]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs relative flex flex-col">
      {/* Top Map Control Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isBn ? "জিআইএস ফিল্ড ও ভেজিটেশন ম্যাপ" : "GIS Agricultural Parcel & Canopy Map"}
            </h3>
            <p className="text-[11px] text-slate-500">
              {isBn ? "বাংলাদেশ সমতল ও বরেন্দ্র অঞ্চল" : "OpenStreetMap & Sentinel-2 Optical Bounds"}
            </p>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Base Layer Switch */}
          <div className="flex bg-white rounded-xl border border-slate-200 p-0.5">
            <button
              onClick={() => setActiveLayer("standard")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeLayer === "standard"
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OSM Standard
            </button>
            <button
              onClick={() => setActiveLayer("satellite")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeLayer === "satellite"
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Satellite Imagery
            </button>
          </div>

          {/* Overlays */}
          <button
            onClick={() => {
              setShowNdviOverlay(!showNdviOverlay);
              if (!showNdviOverlay) setShowMoistureOverlay(false);
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showNdviOverlay
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>NDVI Canopy</span>
          </button>

          <button
            onClick={() => {
              setShowMoistureOverlay(!showMoistureOverlay);
              if (!showMoistureOverlay) setShowNdviOverlay(false);
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showMoistureOverlay
                ? "bg-sky-700 text-white border-sky-700"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Soil Moisture</span>
          </button>

          <button
            onClick={() => {
              setShowPestHotspots(!showPestHotspots);
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showPestHotspots
                ? "bg-[#9A3412] text-white border-[#9A3412]"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Bug className="w-3.5 h-3.5 animate-pulse" />
            <span>{isBn ? "কীটপতঙ্গ হটস্পট" : "Pest Hotspots"}</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[480px] sm:h-[540px] z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Legend */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200 shadow-md text-xs space-y-2 max-w-[210px]">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-500" />
            <span>
              {showNdviOverlay ? "NDVI Canopy Index" : showMoistureOverlay ? "Soil Moisture Contours" : "Cadastral Legend"}
            </span>
          </div>

          {showNdviOverlay && (
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#15803d]" />
                  <span>&gt; 0.75</span>
                </span>
                <span className="text-slate-500">Dense Vigorous</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#84cc16]" />
                  <span>0.60 - 0.74</span>
                </span>
                <span className="text-slate-500">Healthy Canopy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#eab308]" />
                  <span>0.40 - 0.59</span>
                </span>
                <span className="text-slate-500">Early/Sparse</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#ef4444]" />
                  <span>&lt; 0.40</span>
                </span>
                <span className="text-slate-500">Stress / Bare</span>
              </div>
            </div>
          )}

          {showMoistureOverlay && (
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#0284c7]" />
                  <span>&gt; 28%</span>
                </span>
                <span className="text-slate-500">High / Saturated</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#38bdf8]" />
                  <span>20 - 27%</span>
                </span>
                <span className="text-slate-500">Optimal Root</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#fb923c]" />
                  <span>&lt; 20%</span>
                </span>
                <span className="text-slate-500">Deficit Stress</span>
              </div>
            </div>
          )}

          {showPestHotspots && (
            <div className="space-y-1 text-[11px] border-t border-stone-100 pt-1.5 mt-1">
              <div className="flex items-center justify-between text-red-700 font-bold">
                <span className="flex items-center gap-1">
                  <span>🐛</span>
                  <span>Blast Spot</span>
                </span>
                <span>Active Outbreak</span>
              </div>
              <div className="flex items-center justify-between text-orange-700 font-bold">
                <span className="flex items-center gap-1">
                  <span>🦠</span>
                  <span>Blight Spot</span>
                </span>
                <span>Risk Warning</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Field Quick Badge */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-xs p-2.5 rounded-2xl border border-slate-200 shadow-md text-xs">
          <div className="text-[10px] text-slate-500 uppercase font-bold">
            {isBn ? "বর্তমান নির্বাচিত প্লট" : "Active Focus Plot"}
          </div>
          <div className="font-extrabold text-slate-900 text-sm">
            {isBn ? selectedField.nameBn : selectedField.name}
          </div>
          <div className="text-slate-600 text-[11px]">
            {selectedField.variety} &bull; {selectedField.areaBigha} Bigha
          </div>
        </div>
      </div>
    </div>
  );
};
