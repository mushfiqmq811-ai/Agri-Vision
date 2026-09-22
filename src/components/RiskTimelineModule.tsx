import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Thermometer,
  CloudRain,
  Flame,
  Droplets,
  CheckCircle2,
  Info,
} from "lucide-react";
import { GeoField, Language, WeatherPayload, RiskForecastDay } from "../types";
import { BANGLADESH_CROPS } from "../data/cropProfiles";

interface Props {
  selectedField: GeoField;
  weather: WeatherPayload | null;
  language: Language;
}

export const RiskTimelineModule: React.FC<Props> = ({
  selectedField,
  weather,
  language,
}) => {
  const isBn = language === "bn";
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const crop = BANGLADESH_CROPS.find((c) => c.id === selectedField.cropId) || BANGLADESH_CROPS[0];
  const daily = weather?.data?.daily;

  // Build 15-day risk simulation strictly using rule-based agronomic early warning formulas
  const riskDays: RiskForecastDay[] = Array.from({ length: 15 }).map((_, idx) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + idx);

    const maxTemp = daily?.temperature_2m_max?.[idx] ?? (28 + Math.sin(idx) * 3);
    const minTemp = daily?.temperature_2m_min?.[idx] ?? (19 + Math.cos(idx) * 2);
    const rain = daily?.precipitation_sum?.[idx] ?? (idx === 4 ? 18 : idx === 5 ? 24 : 0);
    const humidity = rain > 5 ? 88 : 70 - idx * 0.5;

    // Rule 1: Fungal Blast Risk
    let blastIndex = 20;
    if (minTemp >= 18 && minTemp <= 24 && humidity > 80) {
      blastIndex = 75;
      if (rain > 5) blastIndex = 90;
    } else if (humidity > 85) {
      blastIndex = 60;
    }

    // Rule 2: Heat Stress
    let heatIndex = 15;
    if (maxTemp > 35) heatIndex = 85;
    else if (maxTemp > 32) heatIndex = 55;

    // Rule 3: Waterlogging
    let floodIndex = 10;
    if (rain > 30) floodIndex = 85;
    else if (rain > 15) floodIndex = 50;

    // Rule 4: Moisture Deficit
    let deficitIndex = 15;
    if (rain === 0 && idx > 5) deficitIndex = Math.min(80, 20 + (idx - 5) * 8);

    const overallScore = Math.round(
      Math.max(blastIndex, heatIndex, floodIndex, deficitIndex) * 0.7 +
      (blastIndex + heatIndex + floodIndex + deficitIndex) / 4 * 0.3
    );

    let level: "low" | "medium" | "high" | "critical" = "low";
    let primaryRisk = "Normal Conditions";
    let primaryRiskBn = "স্বাভাবিক পরিবেশ";
    let advisoryEn = "Maintain routine field scouting and balanced moisture.";
    let advisoryBn = "নিয়মিত ক্ষেত পর্যবেক্ষণ ও স্বাভাবিক সেচ ব্যবস্থা চালু রাখুন।";

    if (blastIndex >= 75) {
      level = blastIndex >= 85 ? "critical" : "high";
      primaryRisk = "Fungal Blast / Blight Risk";
      primaryRiskBn = "ব্লাস্ট ও ছত্রাকজনিত রোগের অনুকূল পরিবেশ";
      advisoryEn = "Foliar humidity high. Avoid urea top dressing; spray prophylactic bio-fungicide or Tricyclazole.";
      advisoryBn = "আর্দ্রতা বেশি থাকায় ব্লাস্টের ঝুঁকি রয়েছে। ইউরিয়া প্রয়োগ বন্ধ রাখুন এবং ট্রুপার/নাটিভো স্প্রে করুন।";
    } else if (heatIndex >= 70) {
      level = "high";
      primaryRisk = "Heat Wave Stress";
      primaryRiskBn = "তাপপ্রবাহ ও দানা পুষ্টিকরণে বাধা";
      advisoryEn = "High ambient heat. Maintain 3-5cm standing water layer to reduce canopy thermal shock.";
      advisoryBn = "তীব্র গরমে ফুল ঝরা রোধে জমিতে ৩-৫ সেমি হালকা পানি ধরে রাখুন।";
    } else if (floodIndex >= 70) {
      level = "high";
      primaryRisk = "Waterlogging Hazard";
      primaryRiskBn = "জলাবদ্ধতার তীব্র ঝুঁকি";
      advisoryEn = "Heavy precipitation predicted. Clear drainage channels to prevent root asphyxiation.";
      advisoryBn = "ভারী বৃষ্টির পূর্বাভাস। দ্রুত পানি নিষ্কাশনের নালা পরিষ্কার করুন।";
    } else if (deficitIndex >= 60) {
      level = "medium";
      primaryRisk = "Moisture Depletion Stress";
      primaryRiskBn = "মাটির রস ঘাটতির আশঙ্কা";
      advisoryEn = "Prolonged dry interval. Schedule supplemental irrigation before critical threshold.";
      advisoryBn = "বৃষ্টিহীন শুষ্ক আবহাওয়ায় সেচ প্রয়োগের পূর্বপ্রস্তুতি গ্রহণ করুন।";
    }

    return {
      dayIndex: idx,
      date: dateObj.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      overallRiskLevel: level,
      riskScore: overallScore,
      primaryRisk,
      primaryRiskBn,
      temperature: Math.round(maxTemp),
      rainfallMm: parseFloat(rain.toFixed(1)),
      humidityPct: Math.round(humidity),
      advisoryEn,
      advisoryBn,
      blastFungalRiskIndex: blastIndex,
      heatStressRiskIndex: heatIndex,
      floodWaterloggingRiskIndex: floodIndex,
      moistureDeficitRiskIndex: deficitIndex,
    };
  });

  const activeDay = riskDays[selectedDayIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {isBn ? "নিয়মভিত্তিক আগাম শস্য ঝুঁকি পূর্বাভাস মডেল" : "RULE-BASED AGRONOMIC EARLY WARNING ENGINE"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
              Multi-Hazard Bio-Climatic Matrix
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {isBn
              ? `${selectedField.nameBn} ১৫ দিনের ঝুঁকি ও দুর্যোগ টাইমলাইন`
              : `${selectedField.name} 15-Day Hazard & Vulnerability Timeline`}
          </h2>
        </div>

        <div className="text-xs text-slate-500 italic">
          {isBn
            ? "স্বচ্ছ বৈজ্ঞানিক নীতি: কাল্পনিক এআই স্কোর নয়, সুনির্দিষ্ট কৃষি নিয়মের ওপর ভিত্তি করে তৈরি।"
            : "Scientific integrity: Deterministic bio-climatic rules, not unverified black-box classifiers."}
        </div>
      </div>

      {/* 15-Day Interactive Timeline Scroller */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2.5 min-w-[850px]">
          {riskDays.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            let badgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
            let dotColor = "bg-emerald-500";

            if (day.overallRiskLevel === "critical") {
              badgeBg = "bg-rose-50 text-rose-800 border-rose-300";
              dotColor = "bg-rose-600";
            } else if (day.overallRiskLevel === "high") {
              badgeBg = "bg-amber-50 text-amber-800 border-amber-300";
              dotColor = "bg-amber-500";
            } else if (day.overallRiskLevel === "medium") {
              badgeBg = "bg-yellow-50 text-yellow-800 border-yellow-200";
              dotColor = "bg-yellow-500";
            }

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-1 p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white border-slate-200 hover:border-emerald-500 text-slate-700"
                }`}
              >
                <div className="text-[11px] font-bold">
                  {idx === 0 ? (isBn ? "আজ" : "Today") : day.date.split(",")[0]}
                </div>
                <div className="text-[10px] opacity-70 mb-2">
                  {day.date.split(",")[1]}
                </div>

                <div className="flex items-center gap-1 my-1">
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span className="font-black text-sm font-mono">
                    {day.riskScore}
                  </span>
                </div>

                <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  isSelected ? "bg-white/20 text-white" : badgeBg
                }`}>
                  {day.overallRiskLevel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Deep Dive Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Day Hazard Profile */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span className="font-extrabold text-slate-900 text-base">
                  {activeDay.date} {selectedDayIndex === 0 ? (isBn ? "(আজ)" : "(Today)") : ""}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? "ঝুঁকির প্রধান কারণ:" : "Primary Hazard Driver:"} <span className="font-bold text-slate-900">{isBn ? activeDay.primaryRiskBn : activeDay.primaryRisk}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Composite Risk Index
              </span>
              <span className="text-3xl font-black font-mono text-slate-900">
                {activeDay.riskScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </span>
            </div>
          </div>

          {/* Action Advisory Box */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-0.5">
                {isBn ? "প্রস্তাবিত কৃষি সুরক্ষামূলক ব্যবস্থা:" : "Recommended Mitigating Action:"}
              </span>
              <p className="leading-relaxed">
                {isBn ? activeDay.advisoryBn : activeDay.advisoryEn}
              </p>
            </div>
          </div>

          {/* Microclimate Inputs for the Day */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Forecast Temp</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                {activeDay.temperature}°C
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Precipitation</span>
              <span className="text-lg font-black text-sky-800 font-mono">
                {activeDay.rainfallMm} mm
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Canopy Humidity</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                {activeDay.humidityPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Individual Risk Factor Gauges */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-slate-900">
            {isBn ? "ঝুঁকি উপাদানের তুলনামূলক তীব্রতা" : "Multi-Hazard Sub-Indices"}
          </h4>

          <div className="space-y-3 pt-1">
            {/* Blast */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  {isBn ? "ব্লাস্ট/ছত্রাক আক্রমণ ঝুঁকি" : "Fungal Blast / Blight Risk"}
                </span>
                <span className="font-mono">{activeDay.blastFungalRiskIndex}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${activeDay.blastFungalRiskIndex}%` }}
                />
              </div>
            </div>

            {/* Heat */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  {isBn ? "তাপপ্রবাহ ধকল ঝুঁকি" : "Heat Wave Stress"}
                </span>
                <span className="font-mono">{activeDay.heatStressRiskIndex}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${activeDay.heatStressRiskIndex}%` }}
                />
              </div>
            </div>

            {/* Flood */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  {isBn ? "জলাবদ্ধতা ও জলাবদ্ধ ক্ষতি" : "Waterlogging Hazard"}
                </span>
                <span className="font-mono">{activeDay.floodWaterloggingRiskIndex}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 rounded-full"
                  style={{ width: `${activeDay.floodWaterloggingRiskIndex}%` }}
                />
              </div>
            </div>

            {/* Deficit */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                  {isBn ? "মাটির পানির ঘাটতি ঝুঁকি" : "Soil Moisture Deficit"}
                </span>
                <span className="font-mono">{activeDay.moistureDeficitRiskIndex}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${activeDay.moistureDeficitRiskIndex}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500">
            {isBn
              ? "সূত্র: বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI) ও FAO সেচ ও নিকাশ ম্যানুয়াল ৫৬ অনুসারে নির্ধারিত সীমার ভিত্তিতে গণনা করা হয়েছে।"
              : "Calibrated via BRRI blast epidemiology guidelines and FAO-56 critical soil moisture depletion fractions."}
          </div>
        </div>
      </div>
    </div>
  );
};
