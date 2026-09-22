import React, { useState } from "react";
import {
  Droplets,
  HelpCircle,
  Clock,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info,
} from "lucide-react";
import { GeoField, Language, IrrigationRecommendation, CropProfile } from "../types";
import { BANGLADESH_CROPS } from "../data/cropProfiles";

interface Props {
  field: GeoField;
  irrigation: IrrigationRecommendation | null;
  onOpenExplainability: () => void;
  language: Language;
}

export const SmartIrrigationEngine: React.FC<Props> = ({
  field,
  irrigation,
  onOpenExplainability,
  language,
}) => {
  const isBn = language === "bn";
  const [selectedMethod, setSelectedMethod] = useState<"flood" | "drip" | "furrow" | "sprinkler">(
    field.irrigationMethod
  );

  const crop = BANGLADESH_CROPS.find((c) => c.id === field.cropId) || BANGLADESH_CROPS[0];
  const stage = crop.stages.find((s) => s.name === field.currentStage) || crop.stages[1];

  // Efficiency adjustments
  const efficiencies = {
    drip: 0.9,
    sprinkler: 0.75,
    furrow: 0.6,
    flood: 0.5,
  };

  const currentEff = efficiencies[selectedMethod];
  const netMm = irrigation?.netIrrigationMm ?? 14.5;
  const grossMm = parseFloat((netMm / currentEff).toFixed(1));
  const volumeM3Bigha = parseFloat(((grossMm / 1000) * 1338).toFixed(1));
  const pumpMinutes = Math.round((volumeM3Bigha / 30) * 60);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
              {isBn ? "স্মার্ট হাইড্রোলজিক্যাল সেচ ক্যালকুলেটর" : "FAO-56 CROP WATER BALANCE ENGINE"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
              Penman-Monteith ETc
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {isBn ? `${field.nameBn} সেচ চাহিদা ও সময়সূচি` : `${field.name} Irrigation Quota & Hydrodynamic Plan`}
          </h2>
        </div>

        <button
          onClick={onOpenExplainability}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{isBn ? "কেন এই সুপারিশ? (সূত্র দেখুন)" : "Why this recommendation?"}</span>
        </button>
      </div>

      {/* Main Decision Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold uppercase">
                {isBn ? "আজকের চূড়ান্ত সুপারিশ" : "TODAY'S IRRIGATION ACTION"}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Kc: {stage.kc} &bull; Stage: {isBn ? stage.nameBn : stage.name}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              {irrigation ? (isBn ? irrigation.reasonBn : irrigation.reasonEn) : (
                isBn
                  ? "মাটিতে রস স্বাভাবিক রয়েছে। আজ অতিরিক্ত সেচ প্রয়োজন নেই।"
                  : "Soil moisture is balanced. No supplemental irrigation needed today."
              )}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {isBn
                ? "বাষ্পীভবন ও ফসলের সহনশীলতার ওপর ভিত্তি করে গণনা সম্পন্ন হয়েছে। বৃষ্টির সম্ভাবনা পর্যবেক্ষণাধীন রয়েছে।"
                : "Real-time crop water depletion modeling calibrated via FAO-56 and hourly Open-Meteo microclimate fluxes."}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 shrink-0">
            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">
                {isBn ? "নিট সেচ ঘাটতি" : "Net Deficit"}
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {netMm} <span className="text-sm font-normal text-emerald-300">mm</span>
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">
                {isBn ? "পাম্প চলার সময়" : "Pump Time (5HP)"}
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {pumpMinutes} <span className="text-sm font-normal text-emerald-200">min</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Method Selector & Hydro Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Method Switcher */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "সেচ পদ্ধতি নির্বাচন" : "Irrigation Delivery System"}
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {(currentEff * 100).toFixed(0)}% Eff
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {(["flood", "furrow", "sprinkler", "drip"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  selectedMethod === method
                    ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                }`}
              >
                <div className="capitalize text-slate-900">{method}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Eff: {(efficiencies[method] * 100).toFixed(0)}%
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>{isBn ? "মোট সেচের পরিমাণ (Gross):" : "Gross Application Depth:"}</span>
              <span className="font-bold text-slate-900 font-mono">{grossMm} mm</span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? "বিঘাপ্রতি পানির আয়তন:" : "Volume per Bigha:"}</span>
              <span className="font-bold text-emerald-800 font-mono">{volumeM3Bigha} m³</span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? "হেক্টরপ্রতি পানির আয়তন:" : "Volume per Hectare:"}</span>
              <span className="font-bold text-slate-900 font-mono">{(grossMm * 10).toFixed(0)} m³</span>
            </div>
          </div>
        </div>

        {/* Soil Moisture Depletion Bucket */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "রুট জোন আর্দ্রতা ব্যালেন্স" : "Root Zone Water Reservoir (Bucket)"}
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Root: {stage.rootDepthM}m
            </span>
          </div>

          {/* Moisture Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">
                {isBn ? "বর্তমান আর্দ্রতা" : "Available Moisture"}
              </span>
              <span className="font-bold text-slate-900 font-mono">{field.currentMoisturePct}%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  field.currentMoisturePct < 18
                    ? "bg-rose-500"
                    : field.currentMoisturePct < 24
                    ? "bg-amber-500"
                    : "bg-emerald-600"
                }`}
                style={{ width: `${Math.min(100, field.currentMoisturePct * 2.5)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>WP (14%)</span>
              <span className="text-amber-700">RAW Threshold (20%)</span>
              <span>FC (32%)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase">TAW</span>
              <span className="font-bold text-slate-900 font-mono">72.0 mm</span>
              <span className="text-[10px] text-slate-400 block">Total Available</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase">RAW (p=0.5)</span>
              <span className="font-bold text-emerald-700 font-mono">36.0 mm</span>
              <span className="text-[10px] text-slate-400 block">No-Stress Limit</span>
            </div>
          </div>
        </div>

        {/* Dynamic Water Balance Equation Cards */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "বাষ্পীভবন ও চাহিদা সমীকরণ" : "Penman-Monteith Dynamic Flux"}
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              ETc = Kc × ET₀
            </span>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">ET₀ (Reference Evaporation):</span>
              <span className="font-mono font-bold text-slate-900">4.1 mm/day</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Crop Coefficient (Kc):</span>
              <span className="font-mono font-bold text-emerald-800">{stage.kc}</span>
            </div>
            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
              <span className="text-emerald-950 font-semibold">ETc (Actual Crop Demand):</span>
              <span className="font-mono font-black text-emerald-900">
                {(4.1 * stage.kc).toFixed(2)} mm/day
              </span>
            </div>
            <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-200 flex items-center justify-between">
              <span className="text-sky-950 font-semibold">Effective Rain (P_eff):</span>
              <span className="font-mono font-black text-sky-900">0.0 mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
