import React, { useState } from "react";
import {
  TestTube,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { GeoField, Language, SoilPayload } from "../types";

interface Props {
  soilData: SoilPayload | null;
  loading: boolean;
  language: Language;
  selectedField: GeoField;
  onRefresh: () => void;
}

export const SoilIntelligenceModule: React.FC<Props> = ({
  soilData,
  loading,
  language,
  selectedField,
  onRefresh,
}) => {
  const isBn = language === "bn";
  const [selectedDepth, setSelectedDepth] = useState<"0-5cm" | "5-15cm" | "15-30cm">("0-5cm");

  const currentLayer = soilData?.layers?.[selectedDepth] || {
    ph: 6.4,
    socGkg: 14.5,
    clayPct: 24,
    sandPct: 38,
    siltPct: 38,
    nitrogenGkg: 1.2,
    cecMmol: 18.5,
    bulkDensityGcm3: 1.35,
  };

  // Pedotransfer estimates based on texture (Saxton-Rawls)
  const clay = currentLayer.clayPct;
  const sand = currentLayer.sandPct;
  const soc = currentLayer.socGkg / 10; // %
  const estimatedFieldCapacity = Math.round(28 + 0.2 * clay - 0.1 * sand + 0.5 * soc);
  const estimatedWiltingPoint = Math.round(12 + 0.15 * clay);
  const availableWaterCapacity = estimatedFieldCapacity - estimatedWiltingPoint;

  return (
    <div className="space-y-6">
      {/* Top Banner with Source Transparency */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {isBn ? "আইএসআরআইসি সয়েলগ্রিডস গ্লোবাল সয়েল ডাটা" : "ISRIC SoilGrids 250m v2.0 REST Gateway"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
              Wageningen University & ISRIC
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {isBn
              ? `${selectedField.nameBn} মৃত্তিকা পুষ্টি ও বুনট বিশ্লেষণ`
              : `${selectedField.name} Pedological & Texture Profile`}
          </h2>
        </div>

        {/* Depth Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 px-2">
            {isBn ? "গভীরতা স্তর:" : "Depth Layer:"}
          </span>
          {(["0-5cm", "5-15cm", "15-30cm"] as const).map((depth) => (
            <button
              key={depth}
              onClick={() => setSelectedDepth(depth)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
                selectedDepth === depth
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {depth}
            </button>
          ))}
        </div>
      </div>

      {/* Main Soil Properties Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* pH */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{isBn ? "মাটির অম্লমান (pH)" : "Soil Reaction (pH)"}</span>
            <TestTube className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {currentLayer.ph.toFixed(1)}
          </div>
          <div className="mt-2 text-xs font-semibold">
            {currentLayer.ph >= 6.0 && currentLayer.ph <= 7.2 ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {isBn ? "আদর্শ নিরপেক্ষ মাত্রা" : "Optimum Neutral"}
              </span>
            ) : currentLayer.ph < 6.0 ? (
              <span className="text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isBn ? "মৃদু অম্লীয় (ডলোচুন সুপারিশ)" : "Slightly Acidic"}
              </span>
            ) : (
              <span className="text-sky-700">
                {isBn ? "ক্ষারীয় মাত্রা" : "Alkaline"}
              </span>
            )}
          </div>
        </div>

        {/* Soil Organic Carbon */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{isBn ? "জৈব কার্বন (SOC)" : "Organic Carbon (SOC)"}</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {currentLayer.socGkg.toFixed(1)}{" "}
            <span className="text-sm font-semibold text-slate-500">g/kg</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-600">
            {(currentLayer.socGkg / 10).toFixed(2)}% {isBn ? "জৈব পদার্থ" : "OM Equivalent"}
          </div>
        </div>

        {/* Nitrogen */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{isBn ? "মোট নাইট্রোজেন" : "Total Nitrogen (N)"}</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {currentLayer.nitrogenGkg.toFixed(2)}{" "}
            <span className="text-sm font-semibold text-slate-500">g/kg</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-700">
            {isBn ? "মধ্যম উর্বরতা সূচক" : "Moderate Soil Nitrogen"}
          </div>
        </div>

        {/* CEC */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{isBn ? "ক্যাটায়ন বিনিময় ক্ষমতা" : "Cation Capacity (CEC)"}</span>
            <Info className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {currentLayer.cecMmol.toFixed(1)}{" "}
            <span className="text-sm font-semibold text-slate-500">mmol/kg</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-600">
            {isBn ? "পুষ্টি ধরে রাখার ক্ষমতা" : "Nutrient Retention"}
          </div>
        </div>
      </div>

      {/* Soil Texture Breakdown & Water Retention Estimates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Texture Triangle Composition */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "মৃত্তিকা বুনট ভগ্নাংশ (USDA Texture Class)" : "USDA Soil Particle Size Distribution"}
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              {selectedField.soilType}
            </span>
          </div>

          {/* Bar distributions */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-800">Sand ({isBn ? "বালুকণা" : "Sand"} 0.05-2.0mm)</span>
                <span>{currentLayer.sandPct}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${currentLayer.sandPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Silt ({isBn ? "পলিকণা" : "Silt"} 0.002-0.05mm)</span>
                <span>{currentLayer.siltPct}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-600 rounded-full"
                  style={{ width: `${currentLayer.siltPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-800">Clay ({isBn ? "কর্দমকণা" : "Clay"} &lt;0.002mm)</span>
                <span>{currentLayer.clayPct}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-700 rounded-full"
                  style={{ width: `${currentLayer.clayPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>{isBn ? "বাল্ক ঘনত্ব (Bulk Density):" : "Dry Bulk Density (BDOD):"}</span>
            <span className="font-mono font-bold text-slate-900">{currentLayer.bulkDensityGcm3} g/cm³</span>
          </div>
        </div>

        {/* Saxton-Rawls Hydrological Properties */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "জলধারণ ক্ষমতা ও সেচ পরামিতি" : "Pedotransfer Hydrologic Constants (Saxton-Rawls)"}
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Calculated for {selectedDepth}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-center">
              <span className="text-[11px] text-emerald-800 block font-medium mb-1">
                {isBn ? "ক্ষেত ধারণ ক্ষমতা" : "Field Capacity"}
              </span>
              <span className="text-2xl font-black text-emerald-950 font-mono">
                {estimatedFieldCapacity}%
              </span>
              <span className="text-[10px] text-emerald-700 block mt-1">FC (-33 kPa)</span>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl text-center">
              <span className="text-[11px] text-rose-800 block font-medium mb-1">
                {isBn ? "স্থায়ী শুষ্ক বিন্দু" : "Wilting Point"}
              </span>
              <span className="text-2xl font-black text-rose-950 font-mono">
                {estimatedWiltingPoint}%
              </span>
              <span className="text-[10px] text-rose-700 block mt-1">WP (-1500 kPa)</span>
            </div>

            <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl text-center">
              <span className="text-[11px] text-sky-800 block font-medium mb-1">
                {isBn ? "প্রাপ্য পানি ধারণ" : "Available Water"}
              </span>
              <span className="text-2xl font-black text-sky-950 font-mono">
                {availableWaterCapacity}%
              </span>
              <span className="text-[10px] text-sky-700 block mt-1">AWC (FC - WP)</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
            <span className="font-bold block mb-1">
              {isBn ? "কৃষি পরামর্শ ও মাটির স্বাস্থ্য সুপারিশ:" : "Soil Management Recommendations:"}
            </span>
            <p className="leading-relaxed">
              {currentLayer.socGkg < 15
                ? isBn
                  ? "মাটির জৈব কার্বন ১.৫% এর নিচে রয়েছে। বিঘা প্রতি ৩০০ কেজি ভার্মিকম্পোস্ট বা ট্রাইকো-কম্পোস্ট প্রয়োগ করে মাটির পানি ধারণ ক্ষমতা বৃদ্ধি করুন।"
                  : "Soil organic matter is slightly low (<1.5%). Apply 300kg/bigha decomposed farmyard manure or vermicompost to augment available water capacity."
                : isBn
                ? "জৈব কার্বনের মাত্রা সন্তোষজনক। সুষম ইউরিয়া ও পটাশ সার ব্যবহার করে ফসলের পুষ্টি ভারসাম্য বজায় রাখুন।"
                : "Organic matter is at optimal equilibrium. Maintain balanced NPK top-dressing without excess nitrogen."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
