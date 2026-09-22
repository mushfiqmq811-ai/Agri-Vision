import React, { useState } from "react";
import {
  FileCode,
  Download,
  BookOpen,
  CheckCircle,
  Clock,
  Database,
  Terminal,
  ExternalLink,
  Layers,
} from "lucide-react";
import { GeoField, Language, WeatherPayload, SoilPayload } from "../types";
import { YieldPredictorModule } from "./YieldPredictorModule";
import { SeedCreditLedgerModule } from "./SeedCreditLedgerModule";
import { QrTraceabilityModule } from "./QrTraceabilityModule";
import { EquipmentSharingModule } from "./EquipmentSharingModule";

interface Props {
  selectedField: GeoField;
  weather: WeatherPayload | null;
  soil: SoilPayload | null;
  language: Language;
}

export const ResearcherModeView: React.FC<Props> = ({
  selectedField,
  weather,
  soil,
  language,
}) => {
  const isBn = language === "bn";
  const [activeTab, setActiveTab] = useState<"audit" | "provenance" | "equations" | "rawJson">("audit");
  const [showRoadmap, setShowRoadmap] = useState(true);

  // Provenance & Source Catalog
  const dataSources = [
    {
      module: "Weather Intelligence",
      provider: "Open-Meteo Synoptic Numerical API",
      organization: "ECMWF (Integrated Forecasting System) / DWD ICON",
      resolution: "Hourly, 11km grid",
      license: "Open Database License (ODbL) / CC-BY 4.0",
      endpoint: "https://api.open-meteo.com/v1/forecast",
      status: "Verified Active Stream",
    },
    {
      module: "Soil Intelligence",
      provider: "ISRIC SoilGrids 250m v2.0 REST API",
      organization: "ISRIC - World Soil Information & Wageningen University",
      resolution: "250-meter spatial resolution, 6 standard depth intervals",
      license: "CC BY 4.0 International",
      endpoint: "https://rest.isric.org/soilgrids/v2.0/properties/query",
      status: "Verified Active Gateway",
    },
    {
      module: "Crop Phenology & ETc",
      provider: "FAO-56 Dual Crop Coefficient Standard",
      organization: "Food and Agriculture Organization (FAO)",
      resolution: "Daily water balance time-step",
      license: "Public Domain / International Agronomic Standard",
      endpoint: "https://www.fao.org/land-water/databases-and-software/cropwat",
      status: "Standard Standardized Model",
    },
    {
      module: "Satellite Canopy Monitoring",
      provider: "Copernicus Sentinel-2 MSI Synthetic Simulation",
      organization: "European Space Agency (ESA)",
      resolution: "10-meter spatial resolution (B4, B8)",
      license: "Copernicus Open Access Policy",
      endpoint: "Sentinel-2 MSI Level-2A BOA Reflectance",
      status: "Calibrated Radiometry",
    },
  ];

  // Export full JSON bundle
  const exportJson = () => {
    const dataBundle = {
      exportedAt: new Date().toISOString(),
      field: selectedField,
      weather: weather?.data,
      soil: soil,
      metadata: {
        system: "AGRI-VISION DSS v2.5",
        standards: ["FAO-56", "ISRIC SoilGrids 250m", "Open-Meteo IFS"],
        coordinateSystem: "EPSG:4326 (WGS84)",
      },
    };

    const blob = new Blob([JSON.stringify(dataBundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agri-vision-research-${selectedField.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-700 dark:text-purple-400" />
            <span className="text-xs font-mono text-purple-800 dark:text-purple-300 font-bold uppercase tracking-wider">
              Open Science & Data Reproducibility
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {isBn
              ? "উৎস উপাত্ত, অ্যালগরিদমিক সূত্র ও মেটাডাটা অডিট"
              : "Data Provenance, Mathematical Models & Raw Telemetry Stream"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeTab === "audit" ? "bg-slate-900 dark:bg-slate-700 text-white font-bold" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Simulation & Audit (v2.0)
            </button>
            <button
              onClick={() => setActiveTab("provenance")}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeTab === "provenance" ? "bg-slate-900 dark:bg-slate-700 text-white font-bold" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Data Provenance
            </button>
            <button
              onClick={() => setActiveTab("equations")}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeTab === "equations" ? "bg-slate-900 dark:bg-slate-700 text-white font-bold" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Formulations & Equations
            </button>
            <button
              onClick={() => setActiveTab("rawJson")}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeTab === "rawJson" ? "bg-slate-900 dark:bg-slate-700 text-white font-bold" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Raw Telemetry (JSON)
            </button>
          </div>

          <button
            onClick={exportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Bundle</span>
          </button>
        </div>
      </div>

      {/* Scientific Roadmap Banner */}
      {showRoadmap && (
        <div className="bg-purple-50/50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-900/40 p-6 rounded-3xl relative overflow-hidden">
          <button
            onClick={() => setShowRoadmap(false)}
            className="absolute top-4 right-4 text-xs font-bold text-purple-900/60 dark:text-purple-400 hover:text-purple-950 px-2 py-1 rounded bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 cursor-pointer"
          >
            Dismiss Guide
          </button>

          <div className="flex items-start gap-4 pr-12">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl border border-purple-300 text-purple-800 dark:text-purple-300 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-purple-950 dark:text-purple-300">
                Welcome to AgriVision Scientific Research DSS!
              </h2>
              <p className="text-xs text-purple-900/80 dark:text-purple-400 mt-0.5 leading-relaxed">
                Your researcher credentials are active. This interface provides high-fidelity physical modelling, agronomic formulations, and multi-source synoptic audibility:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <div className="bg-white/85 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-purple-200/50 dark:border-slate-800">
                  <h4 className="text-xs font-extrabold text-purple-900 dark:text-purple-400">
                    🔬 1. Biophysical Crop Digital Twin Simulation
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                    Test crop varieties against synthetic temperature anomalies, altered relative humidity, and drought scenarios to verify crop coefficients.
                  </p>
                </div>

                <div className="bg-white/85 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-purple-200/50 dark:border-slate-800">
                  <h4 className="text-xs font-extrabold text-purple-900 dark:text-purple-400">
                    🛰️ 2. Sentinel-2 NDVI Canopy Explorations
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                    Access spatial models of chlorophyll levels and leaf density to evaluate vegetative stress indexes without high-cost lab assays.
                  </p>
                </div>

                <div className="bg-white/85 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-purple-200/50 dark:border-slate-800">
                  <h4 className="text-xs font-extrabold text-purple-900 dark:text-purple-400">
                    📉 3. Eco-Carbon & Sustainability Audit
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                    Quantify methane mitigation through AWD (Alternate Wetting and Drying) and audit carbon footprints conforming with IPCC standards.
                  </p>
                </div>

                <div className="bg-white/85 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-purple-200/50 dark:border-slate-800">
                  <h4 className="text-xs font-extrabold text-purple-900 dark:text-purple-400">
                    🗄️ 4. API Provenance & Raw JSON Auditing
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                    Download complete raw JSON records combining ISRIC SoilGrids, Open-Meteo synoptics, and FAO equations for offline statistical software.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Academic Audit & Simulation */}
      {activeTab === "audit" && (
        <div className="space-y-8">
          <YieldPredictorModule selectedField={selectedField} language={language} />
          <SeedCreditLedgerModule selectedField={selectedField} language={language} />
          <QrTraceabilityModule selectedField={selectedField} language={language} />
          <EquipmentSharingModule language={language} />
        </div>
      )}

      {/* Tab 1: Data Provenance */}
      {activeTab === "provenance" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {isBn ? "উপাত্ত উৎস ও এপিআই অখণ্ডতা তালিকা" : "Verified Primary Data Sources & Provenance Ledger"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Strict adherence to Open Science: All external feeds are documented with resolution, license, and endpoints.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dataSources.map((source, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{source.module}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono">
                      {source.provider}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                    {source.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Origin:</strong> {source.organization}
                  </div>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Resolution:</strong> {source.resolution}
                  </div>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">License:</strong> {source.license}
                  </div>
                </div>

                <div className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/80 px-2 py-1 rounded-md overflow-x-auto">
                  Endpoint: {source.endpoint}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Equations */}
      {activeTab === "equations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Equation 1: Penman-Monteith */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                1. FAO-56 Penman-Monteith Evapotranspiration
              </h4>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">Standard Reference</span>
            </div>
            <div className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed">
              ET₀ = [0.408Δ(Rn - G) + γ(900 / (T + 273)) u₂ (es - ea)] / [Δ + γ(1 + 0.34 u₂)]
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculates daily hypothetical reference crop grass evaporation using net radiation (Rn), soil heat flux (G), psychrometric constant (γ), and vapor pressure deficit (es - ea).
            </p>
          </div>

          {/* Equation 2: Soil Water Balance */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                2. Readily Available Water (RAW) Bucket
              </h4>
              <span className="text-[11px] font-mono text-sky-700 dark:text-sky-400 font-bold">Hydrodynamic Threshold</span>
            </div>
            <div className="p-4 bg-slate-900 text-sky-300 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed">
              {"TAW = 1000 × (θ_FC - θ_WP) × Zr"}
              <br />
              {"RAW = p × TAW"}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {"θ_FC is volumetric field capacity, θ_WP is wilting point, Zr is crop root depth (m), and p is the crop-specific depletion fraction without inducing water stress."}
            </p>
          </div>

          {/* Equation 3: NDVI */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                3. Normalized Difference Vegetation Index (NDVI)
              </h4>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">Copernicus Sentinel-2</span>
            </div>
            <div className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed">
              NDVI = (NIR - Red) / (NIR + Red)
              <br />
              = (Band 8 [842nm] - Band 4 [665nm]) / (Band 8 + Band 4)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Quantifies photosynthetic active canopy biomass and chlorophyll absorption ratio at 10m Ground Sampling Distance.
            </p>
          </div>

          {/* Equation 4: Saxton-Rawls Pedotransfer */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                4. Saxton-Rawls Soil Pedotransfer Function
              </h4>
              <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold">Hydrologic Physics</span>
            </div>
            <div className="p-4 bg-slate-900 text-amber-300 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed">
              θ_FC = θ_33 = -0.251 Sand + 0.195 Clay + 0.011 OM + 0.006 (Sand × OM) - 0.027 (Clay × OM) + 0.452 (Sand × Clay) + 0.299
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Empirical pedotransfer derivation estimating volumetric moisture retention directly from ISRIC SoilGrids particle size distribution and organic carbon fraction.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Raw JSON */}
      {activeTab === "rawJson" && (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-3xl border border-slate-800 shadow-xs space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-bold">Telemetry Stream Payload</span>
            </div>
            <span className="text-slate-500 text-[11px]">
              {selectedField.coordinates[0]}°N, {selectedField.coordinates[1]}°E
            </span>
          </div>

          <pre className="max-h-96 overflow-y-auto p-3 bg-slate-950 rounded-2xl text-[11px] text-emerald-400 scrollbar-thin">
            {JSON.stringify(
              {
                field: selectedField,
                weather_summary: {
                  provider: "Open-Meteo",
                  timestamp: weather?.timestamp,
                  current: weather?.data?.current,
                  daily_sample: weather?.data?.daily?.time?.slice(0, 3),
                },
                soil_isric: soil,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
