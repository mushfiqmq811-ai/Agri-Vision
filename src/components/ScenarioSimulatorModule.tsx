import React, { useState } from "react";
import {
  Sliders,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Leaf,
  Droplets,
  Sparkles,
  Info,
} from "lucide-react";
import { GeoField, Language } from "../types";
import { BANGLADESH_CROPS } from "../data/cropProfiles";

interface Props {
  selectedField: GeoField;
  language: Language;
}

export const ScenarioSimulatorModule: React.FC<Props> = ({ selectedField, language }) => {
  const isBn = language === "bn";

  // Sliders state
  const [tempDelta, setTempDelta] = useState<number>(0); // -5 to +5 °C
  const [rainDeltaPct, setRainDeltaPct] = useState<number>(0); // -50% to +100%
  const [irrigationDelayDays, setIrrigationDelayDays] = useState<number>(0); // 0 to 10 days
  const [nitrogenDeltaPct, setNitrogenDeltaPct] = useState<number>(0); // -40% to +50%
  const [soilOrganicCarbon, setSoilOrganicCarbon] = useState<number>(1.5); // 0.5% to 3.5%

  const resetAll = () => {
    setTempDelta(0);
    setRainDeltaPct(0);
    setIrrigationDelayDays(0);
    setNitrogenDeltaPct(0);
    setSoilOrganicCarbon(1.5);
  };

  // Agronomic impact formulas
  // 1. Yield impact
  let yieldDeltaPct = 0;
  if (tempDelta > 2) yieldDeltaPct -= (tempDelta - 2) * 4.5;
  if (tempDelta < -2) yieldDeltaPct -= Math.abs(tempDelta + 2) * 3.0;

  if (irrigationDelayDays > 2) yieldDeltaPct -= (irrigationDelayDays - 2) * 3.8;
  if (nitrogenDeltaPct > 20) yieldDeltaPct += 4.5 - (nitrogenDeltaPct - 20) * 0.2;
  else if (nitrogenDeltaPct < -10) yieldDeltaPct += nitrogenDeltaPct * 0.3;

  if (soilOrganicCarbon > 1.5) yieldDeltaPct += (soilOrganicCarbon - 1.5) * 5.0;
  else yieldDeltaPct -= (1.5 - soilOrganicCarbon) * 4.0;

  yieldDeltaPct = parseFloat(yieldDeltaPct.toFixed(1));

  // 2. ETc shift
  const baseEtc = 4.8;
  const simulatedEtc = parseFloat((baseEtc * (1 + tempDelta * 0.04) * (1 - rainDeltaPct * 0.001)).toFixed(2));

  // 3. Blast disease risk shift
  let simulatedBlastRisk = 35;
  if (tempDelta >= -1 && tempDelta <= 2) simulatedBlastRisk += 15;
  if (rainDeltaPct > 20) simulatedBlastRisk += 25;
  if (nitrogenDeltaPct > 15) simulatedBlastRisk += 20;
  simulatedBlastRisk = Math.min(95, Math.max(10, simulatedBlastRisk));

  // 4. Irrigation requirement shift
  const baseWaterM3 = 38.5; // per bigha
  const simulatedWaterM3 = parseFloat(
    (baseWaterM3 * (1 + tempDelta * 0.05) * (1 - rainDeltaPct * 0.005)).toFixed(1)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {isBn ? "কৃষি জলবায়ু দৃশ্যপট ও পরিবর্তন সিমুলেটর" : "AGRONOMIC SCENARIO & STRESS SIMULATOR"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
              Deterministic Bio-Physical Model
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {isBn
              ? "কী ঘটবে যদি তাপমাত্রা বৃদ্ধি বা সেচ বিলম্ব হয়? (What-If Analysis)"
              : "Microclimate Shift & Farm Management Sensitivity Analysis"}
          </h2>
        </div>

        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isBn ? "আসল মানে ফিরুন" : "Reset to Baseline"}</span>
        </button>
      </div>

      {/* Main Grid: Controls vs Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Sliders */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>{isBn ? "দৃশ্যপট পরামিতি সমন্বয় (Scenario Levers)" : "Environmental & Management Variables"}</span>
          </h3>

          {/* Slider 1: Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">
                {isBn ? "তাপমাত্রা পরিবর্তন (Temperature Shift):" : "Ambient Temperature Deviation:"}
              </span>
              <span className="font-mono font-bold text-emerald-800">
                {tempDelta > 0 ? `+${tempDelta}` : tempDelta}°C
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={tempDelta}
              onChange={(e) => setTempDelta(parseFloat(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-5°C (Cool Wave)</span>
              <span>Baseline (0°C)</span>
              <span>+5°C (Extreme Heat)</span>
            </div>
          </div>

          {/* Slider 2: Rainfall */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">
                {isBn ? "বৃষ্টিপাত পরিবর্তন (Precipitation Delta):" : "Precipitation Volume Change:"}
              </span>
              <span className="font-mono font-bold text-sky-800">
                {rainDeltaPct > 0 ? `+${rainDeltaPct}` : rainDeltaPct}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={rainDeltaPct}
              onChange={(e) => setRainDeltaPct(parseFloat(e.target.value))}
              className="w-full accent-sky-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-50% (Drought)</span>
              <span>Baseline (0%)</span>
              <span>+100% (Inundation)</span>
            </div>
          </div>

          {/* Slider 3: Irrigation Delay */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">
                {isBn ? "সেচ প্রয়োগে বিলম্ব (Irrigation Delay):" : "Irrigation Turnaround Delay:"}
              </span>
              <span className="font-mono font-bold text-amber-800">
                {irrigationDelayDays} {isBn ? "দিন" : "Days"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={irrigationDelayDays}
              onChange={(e) => setIrrigationDelayDays(parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 Days (On-time)</span>
              <span>5 Days (Moderate Stress)</span>
              <span>10 Days (Severe Deficit)</span>
            </div>
          </div>

          {/* Slider 4: Nitrogen Dose */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">
                {isBn ? "ইউরিয়া/নাইট্রোজেন মাত্রা (Nitrogen Dose):" : "Nitrogen Fertilizer Top-Dressing:"}
              </span>
              <span className="font-mono font-bold text-purple-800">
                {nitrogenDeltaPct > 0 ? `+${nitrogenDeltaPct}` : nitrogenDeltaPct}%
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="50"
              step="5"
              value={nitrogenDeltaPct}
              onChange={(e) => setNitrogenDeltaPct(parseFloat(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-40% (Starvation)</span>
              <span>Recommended (0%)</span>
              <span>+50% (Over-application)</span>
            </div>
          </div>

          {/* Slider 5: Soil Organic Carbon */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">
                {isBn ? "মাটির জৈব কার্বন (Soil Organic Carbon):" : "Target Soil Organic Carbon (SOC):"}
              </span>
              <span className="font-mono font-bold text-emerald-800">
                {soilOrganicCarbon}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.1"
              value={soilOrganicCarbon}
              onChange={(e) => setSoilOrganicCarbon(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.5% (Depleted)</span>
              <span>1.5% (National Average)</span>
              <span>3.5% (High Fertility)</span>
            </div>
          </div>
        </div>

        {/* Right: Real-time Agricultural Impact Outputs */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span>{isBn ? "অনুকরণকৃত ফলাফল (Simulated Agronomic Outputs)" : "Projected Agronomic Impacts"}</span>
            <span className="text-[11px] font-mono text-slate-500">
              Crop: {selectedField.variety}
            </span>
          </h3>

          {/* Metric 1: Projected Yield Shift */}
          <div className={`p-5 rounded-2xl border transition-all ${
            yieldDeltaPct >= 0
              ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
              : "bg-rose-50/70 border-rose-300 text-rose-950"
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">
                {isBn ? "প্রত্যাশিত ফলন পরিবর্তন" : "Projected Harvest Yield Delta"}
              </span>
              {yieldDeltaPct >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-700" />
              ) : (
                <TrendingDown className="w-5 h-5 text-rose-700" />
              )}
            </div>
            <div className="text-3xl font-black font-mono">
              {yieldDeltaPct > 0 ? `+${yieldDeltaPct}%` : `${yieldDeltaPct}%`}
            </div>
            <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
              {yieldDeltaPct < 0
                ? isBn
                  ? `উষ্ণতা বৃদ্ধি বা সেচ বিলম্বের কারণে আনুমানিক ${Math.abs(yieldDeltaPct)}% ফলন হ্রাসের আশঙ্কা তৈরি হয়েছে।`
                  : `Thermal spike or prolonged moisture delay projects a ${Math.abs(yieldDeltaPct)}% yield drop.`
                : isBn
                ? `জৈব পদার্থ ও পরিমিত পুষ্টির কারণে ফলন বৃদ্ধি প্রত্যাশিত।`
                : `Higher soil organic carbon and balanced nutrition boost projected production.`}
            </p>
          </div>

          {/* Secondary Projected Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* ETc Shift */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isBn ? "বাষ্পীভবন (ETc)" : "Crop ETc Flux"}</span>
                <Droplets className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {simulatedEtc} <span className="text-xs font-normal text-slate-500">mm/d</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Base: 4.80 mm/d
              </div>
            </div>

            {/* Irrigation Volume */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isBn ? "বিঘাপ্রতি পানি" : "Water Volume"}</span>
                <Droplets className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {simulatedWaterM3} <span className="text-xs font-normal text-slate-500">m³/bigha</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {simulatedWaterM3 > baseWaterM3 ? "+Water Demand" : "-Water Demand"}
              </div>
            </div>

            {/* Blast Disease Risk */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isBn ? "ব্লাস্ট রোগ ঝুঁকি" : "Blast Risk Index"}</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {simulatedBlastRisk}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {nitrogenDeltaPct > 20 ? "High due to excess N" : "Normal vulnerability"}
              </div>
            </div>

            {/* Soil Water Capacity */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isBn ? "জলধারণ ক্ষমতা" : "Available Water"}</span>
                <Leaf className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {(14 + soilOrganicCarbon * 3.5).toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                SOC-enhanced storage
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
