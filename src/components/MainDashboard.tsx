import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sprout,
  Droplets,
  Sun,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  HelpCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  Mail,
  Volume2,
  MessageSquare,
  Map,
  CloudSun,
  TestTube,
  Stethoscope,
  Satellite,
  Sliders,
  Leaf,
  Bell,
  BarChart3,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GeoField, Language, WeatherPayload, SoilPayload, IrrigationRecommendation } from "../types";
import { BANGLADESH_CROPS } from "../data/cropProfiles";

interface Props {
  selectedField: GeoField;
  weather: WeatherPayload | null;
  soil: SoilPayload | null;
  irrigation: IrrigationRecommendation | null;
  language: Language;
  onNavigateTab: (tab: string) => void;
  onOpenExplainability: () => void;
}

export const MainDashboard: React.FC<Props> = ({
  selectedField,
  weather,
  soil,
  irrigation,
  language,
  onNavigateTab,
  onOpenExplainability,
}) => {
  const isBn = language === "bn";
  const crop = BANGLADESH_CROPS.find((c) => c.id === selectedField.cropId) || BANGLADESH_CROPS[0];
  const current = weather?.data?.current;

  const [showAdvanced, setShowAdvanced] = useState(false);

  const primaryModules = [
    { id: "aiSummary", labelEn: "AI Farmer Briefing", labelBn: "এআই শস্য ব্রিফিং", descEn: "Personalized daily action summary & agronomy guide", descBn: "দৈনিক কাস্টমাইজড কৃষি কাজ ও পরামর্শের সারসংক্ষেপ", icon: Sparkles, badgeEn: "Gemini 3.5", badgeBn: "এআই", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { id: "crop_doctor", labelEn: "AI Crop Doctor Desk", labelBn: "এআই শস্য ডাক্তার", descEn: "Diagnose diseases via visual analysis and audio", descBn: "ভয়েস ও ছবি দিয়ে ফসলের রোগবালাই সনাক্ত করুন", icon: Stethoscope, badgeEn: "Real-time", badgeBn: "লাইভ", color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20" },
    { id: "irrigation", labelEn: "Smart Irrigation", labelBn: "সেচ ক্যালকুলেটর", descEn: "Soil moisture-driven FAO-56 watering controller", descBn: "মাটির আর্দ্রতা মেপে বৈজ্ঞানিক উপায়ে সেচ নির্ধারণ", icon: Droplets, badgeEn: "FAO-56", badgeBn: "এফএও", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { id: "soil", labelEn: "Soil Intelligence", labelBn: "মাটির পুষ্টি ও আদ্রতা", descEn: "Live sensor feeds for NPK, pH and soil health", descBn: "মাটির পুষ্টি উপাদান (NPK), পিএইচ ও স্বাস্থ্য রিডিং", icon: TestTube, badgeEn: "NPK Feed", badgeBn: "সেন্সর", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20" },
    { id: "weather", labelEn: "Weather Intelligence", labelBn: "আবহাওয়া পূর্বাভাস", descEn: "Microclimate tracking & storm probability trends", descBn: "পরবর্তী ১০ দিনের আবহাওয়া ও ঝড়-বৃষ্টির লাইভ ট্র্যাকার", icon: CloudSun, badgeEn: "Penman-M.", badgeBn: "লাইভ", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
    { id: "alerts", labelEn: "Smart Alerts Dispatch", labelBn: "মোবাইল ব্রডকাস্ট", descEn: "Broadcast instant warnings via SMS and IVR Calls", descBn: "জরুরি সতর্কতা সরাসরি এসএমএস ও প্রচার করুন", icon: Bell, badgeEn: "Cellular", badgeBn: "সেলুলার", color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
  ];

  const secondaryModules = [
    { id: "cropDigitalTwin", labelEn: "Crop Digital Twin AI", labelBn: "শস্য ডিজিটাল টুইন এআই", descEn: "Simulate cellular crop health and salinity stress", descBn: "ফসলের শারীরবৃত্তীয় কার্যক্রম ও জলবায়ু সিমুলেটর", icon: Activity, badgeEn: "Interactive", badgeBn: "টুইন", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { id: "emailDesk", labelEn: "Automated Email", labelBn: "অটো ইমেইল ডেস্ক", descEn: "Schedule daily/weekly email summaries & alerts", descBn: "নিয়মিত শস্যের স্বাস্থ্য ও আবহাওয়া রিপোর্ট ইমেইলে", icon: Mail, badgeEn: "Scheduler", badgeBn: "ইমেইল", color: "text-sky-500 bg-sky-50 dark:bg-sky-950/20" },
    { id: "map", labelEn: "GIS Field Map", labelBn: "জিআইএস ফিল্ড ম্যাপ", descEn: "Satellite bounds and parcel monitoring overlay", descBn: "জমির সীমানা ও জিআইএস স্যাটেলাইট মনিটরিং", icon: Map, badgeEn: "GIS Bounds", badgeBn: "জিআইএস", color: "text-green-600 bg-green-50 dark:bg-green-950/20" },
    { id: "market", labelEn: "Agro-Market AI", labelBn: "কৃষি বাজার এআই", descEn: "Produce price tracking and seasonal arbitrage", descBn: "ফসল বিক্রির পাইকারি বাজার দর ও সর্বোচ্চ দামের পূর্বাভাস", icon: TrendingUp, badgeEn: "Projections", badgeBn: "বাজার", color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20" },
    { id: "satellite", labelEn: "Satellite NDVI Explorer", labelBn: "স্যাটেলাইট এনডিভিআই", descEn: "Sentinel-2 vegetation vigor & moisture indexes", descBn: "স্যাটেলাইটের মাধ্যমে ফসলের সবুজতা ও স্বাস্থ্য ট্র্যাক", icon: Satellite, badgeEn: "Copernicus", badgeBn: "সেন্টিনেল", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { id: "risks", labelEn: "15-Day Risk Timeline", labelBn: "১৫ দিনের ঝুঁকি তালিকা", descEn: "Predictive hazard modeling for flood, pest and blast", descBn: "বন্যা, পোকা ও শিলাবৃষ্টির আগাম ১৫ দিনের পূর্বাভাস", icon: AlertTriangle, badgeEn: "Predictive", badgeBn: "ঝুঁকি", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { id: "scenario", labelEn: "What-If Simulator", labelBn: "শস্য সিমুলেটর", descEn: "Test fertilizer & irrigation impacts in real-time", descBn: "সার ও সেচ পরিবর্তন করলে ফসলে কী প্রভাব পড়বে দেখুন", icon: Sliders, badgeEn: "What-If", badgeBn: "সিমুলেশন", color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
    { id: "sustainability", labelEn: "Sustainability ESG", labelBn: "পরিবেশ ও টেকসই স্থিতি", descEn: "Soil organic carbon & nitrogen emissions scoreboard", descBn: "কার্বন সঞ্চয় ও মাটির উর্বরতা স্কোরবোর্ড", icon: Leaf, badgeEn: "Carbon ESG", badgeBn: "ইএসজি", color: "text-green-600 bg-green-50 dark:bg-green-950/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Agricultural Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white p-6 sm:p-7 rounded-3xl shadow-sm relative overflow-hidden border border-[#40916C]"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                {isBn ? "সক্রিয় কৃষি পর্যবেক্ষণ" : "ACTIVE MONITORING"}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {selectedField.district} &bull; {selectedField.areaBigha} Bigha ({(selectedField.areaBigha * 0.1338).toFixed(1)} ha)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isBn ? selectedField.nameBn : selectedField.name} &mdash;{" "}
              <span className="text-emerald-400">{selectedField.variety}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isBn ? "বর্তমান বৃদ্ধি পর্যায়:" : "Growth Stage:"}{" "}
                  <strong className="text-white font-semibold">
                    {isBn ? selectedField.currentStageBn : selectedField.currentStage}
                  </strong>
                </span>
              </span>
              <span>&bull;</span>
              <span>
                {isBn ? "রোপণের তারিখ:" : "Sown:"}{" "}
                <strong className="text-white font-semibold">{selectedField.sowingDate}</strong>
              </span>
              <span>&bull;</span>
              <span>
                {isBn ? "আনুমানিক কর্তন:" : "Harvest In:"}{" "}
                <strong className="text-emerald-300 font-semibold">{Math.max(15, Math.round(145 * (1 - selectedField.stageProgressPct / 100)))} days</strong>
              </span>
            </div>
          </div>

          {/* Key Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("aiSummary")}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black transition shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isBn ? "কৃষক এআই সারাংশ" : "AI Farmer Briefing"}</span>
            </button>
            <button
              onClick={() => onNavigateTab("emailDesk")}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-2xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Mail className="w-4 h-4" />
              <span>{isBn ? "অটো ইমেইল ডেস্ক" : "Auto-Email Engine"}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ==========================================================
          SYSTEMS COMMAND LAUNCHPAD (Structured Quick Navigation Hub)
          ========================================================== */}
      <div className="bg-[#FFFDFB] dark:bg-[#14221B] p-5 sm:p-6 rounded-3xl border border-[#E8E0D5] dark:border-[#22382D] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAF7F2] dark:border-[#22382D] pb-3">
          <div>
            <h2 className="text-xs font-black text-[#1B4332] dark:text-[#FAF7F2] uppercase tracking-wider font-mono">
              {isBn ? "প্রাইমারি কোর সেবাসমূহ" : "Primary Core Services"}
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              {isBn ? "দৈনিক শস্য তদারকি ও সিদ্ধান্ত গ্রহণের প্রধান মডিউল" : "Most frequently used precision farming modules"}
            </p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded font-bold uppercase shrink-0">
            {isBn ? "৬টি মডিউল" : "6 core modules"}
          </span>
        </div>

        {/* Primary Core Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {primaryModules.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                className="group text-left p-3.5 bg-white dark:bg-[#182B21] border border-slate-100 dark:border-emerald-950 hover:border-emerald-600 dark:hover:border-emerald-400 rounded-2xl transition-all shadow-2xs hover:shadow-xs cursor-pointer relative overflow-hidden flex flex-col justify-between h-[125px] hover:scale-[1.01] active:scale-[0.99]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-[#FAF7F2] dark:bg-emerald-950 text-slate-700 dark:text-emerald-300 px-1.5 py-0.5 rounded uppercase">
                    {isBn ? item.badgeBn : item.badgeEn}
                  </span>
                </div>

                {/* Body */}
                <div className="mt-2 space-y-1">
                  <div className="text-[12px] font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                    <span>{isBn ? item.labelBn : item.labelEn}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                    {isBn ? item.descBn : item.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Collapsible Secondary/Advanced Options */}
        <div className="pt-2 border-t border-[#FAF7F2] dark:border-[#22382D]">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#111C15] dark:hover:bg-[#182a20] rounded-2xl text-xs font-bold text-slate-700 dark:text-[#FAF7F2] transition cursor-pointer border border-slate-200/50 dark:border-[#22382D]"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isBn
                  ? "উন্নত ও অতিরিক্ত বিশ্লেষণী মডিউল সমূহ"
                  : "Advanced Analytical & Simulation Modules"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400">
                {isBn ? `${secondaryModules.length}টি মডিউল` : `${secondaryModules.length} modules`}
              </span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </button>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4"
            >
              {secondaryModules.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigateTab(item.id)}
                    className="group text-left p-3.5 bg-white dark:bg-[#182B21] border border-slate-100 dark:border-emerald-950 hover:border-emerald-600 dark:hover:border-emerald-400 rounded-2xl transition-all shadow-2xs hover:shadow-xs cursor-pointer relative overflow-hidden flex flex-col justify-between h-[125px] hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-[#FAF7F2] dark:bg-emerald-950 text-slate-700 dark:text-emerald-300 px-1.5 py-0.5 rounded uppercase">
                        {isBn ? item.badgeBn : item.badgeEn}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="mt-2 space-y-1">
                      <div className="text-[12px] font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                        <span>{isBn ? item.labelBn : item.labelEn}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                        {isBn ? item.descBn : item.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* NDVI */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("satellite")}
          className="bg-[#FFFDFB] dark:bg-[#14221B] p-4 rounded-2xl border border-[#E8E0D5] dark:border-[#22382D] hover:border-[#8E2A2B] dark:hover:border-emerald-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#6B6355] dark:text-stone-400 text-xs mb-1 font-bangla">
            <span>{isBn ? "ক্যানোপি এনডিভিআই" : "Canopy NDVI"}</span>
            <Sprout className="w-4 h-4 text-emerald-700 dark:text-emerald-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-[#1B4332] dark:text-emerald-300 font-mono">
            {selectedField.ndviAverage}
          </div>
          <div className="text-[11px] text-[#2B4E3E] dark:text-emerald-400 font-medium mt-0.5">
            Dense Vigorous
          </div>
        </motion.div>

        {/* Moisture */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("irrigation")}
          className="bg-[#FFFDFB] dark:bg-[#14221B] p-4 rounded-2xl border border-[#E8E0D5] dark:border-[#22382D] hover:border-[#8E2A2B] dark:hover:border-sky-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#6B6355] dark:text-stone-400 text-xs mb-1 font-bangla">
            <span>{isBn ? "মাটির আর্দ্রতা" : "Root Moisture"}</span>
            <Droplets className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-[#3D352A] dark:text-stone-100 font-mono">
            {selectedField.currentMoisturePct}%
          </div>
          <div className="text-[11px] text-[#6B6355] dark:text-stone-400 mt-0.5">
            Optimum (FC 32%)
          </div>
        </motion.div>

        {/* Temp & Humidity */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("weather")}
          className="bg-[#FFFDFB] dark:bg-[#14221B] p-4 rounded-2xl border border-[#E8E0D5] dark:border-[#22382D] hover:border-[#8E2A2B] dark:hover:border-amber-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#6B6355] dark:text-stone-400 text-xs mb-1 font-bangla">
            <span>{isBn ? "আবহাওয়া" : "Microclimate"}</span>
            <Sun className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-[#3D352A] dark:text-stone-100 font-mono">
            {current?.temperature_2m ?? 28.4}°C
          </div>
          <div className="text-[11px] text-[#6B6355] dark:text-stone-400 mt-0.5">
            RH: {current?.relative_humidity_2m ?? 74}% &bull; Calm
          </div>
        </motion.div>

        {/* Irrigation Net Need */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("irrigation")}
          className="bg-[#FFFDFB] dark:bg-[#14221B] p-4 rounded-2xl border border-[#E8E0D5] dark:border-[#22382D] hover:border-[#8E2A2B] dark:hover:border-blue-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#6B6355] dark:text-stone-400 text-xs mb-1 font-bangla">
            <span>{isBn ? "সেচ নিট ঘাটতি" : "Irrigation Deficit"}</span>
            <Droplets className="w-4 h-4 text-blue-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-blue-900 dark:text-blue-300 font-mono">
            {irrigation?.netIrrigationMm ?? 0} <span className="text-xs font-normal">mm</span>
          </div>
          <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold mt-0.5">
            {irrigation?.action === "NO_IRRIGATION" ? "Pump OFF" : "Run Scheduled"}
          </div>
        </motion.div>

        {/* Soil pH & Texture */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("soil")}
          className="bg-[#FFFDFB] dark:bg-[#14221B] p-4 rounded-2xl border border-[#E8E0D5] dark:border-[#22382D] hover:border-[#8E2A2B] dark:hover:border-purple-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#6B6355] dark:text-stone-400 text-xs mb-1 font-bangla">
            <span>{isBn ? "মাটির পিএইচ" : "Soil Reaction"}</span>
            <Layers className="w-4 h-4 text-purple-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-[#3D352A] dark:text-stone-100 font-mono">
            {soil?.layers["0-5cm"].ph ?? 6.4} pH
          </div>
          <div className="text-[11px] text-purple-700 dark:text-purple-400 font-medium mt-0.5">
            Silty Clay Loam
          </div>
        </motion.div>

        {/* Blast Risk */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("risks")}
          className="bg-[#FFFDFB] dark:bg-[#14221B] p-4 rounded-2xl border border-[#E8E0D5] dark:border-[#22382D] hover:border-[#8E2A2B] dark:hover:border-red-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-[#6B6355] dark:text-stone-400 text-xs mb-1 font-bangla">
            <span>{isBn ? "রোগবালাই ঝুঁকি" : "Pest Risk"}</span>
            <ShieldAlert className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-amber-800 dark:text-amber-400 font-mono">
            42%
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-medium mt-0.5">
            Foliar Blast Watch
          </div>
        </motion.div>
      </div>

      {/* Featured Middle Section: 1) AI Farmer Summary Bar & 2) Explainable Recommendation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Decision Engine with Explainability */}
        <div className="lg:col-span-8 bg-[#FFFDFB] dark:bg-[#14221B] p-6 rounded-3xl border border-[#E8E0D5] dark:border-[#22382D] shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FAF7F2] dark:border-[#22382D] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-display">
                  {isBn ? "দৈনিক এগ্রোনমিক সিদ্ধান্ত ইঞ্জিন (FAO-56)" : "Autonomous Decision Engine (FAO-56)"}
                </h3>
              </div>
              <p className="text-xs text-[#5C5549] dark:text-stone-400 mt-0.5">
                {isBn
                  ? "পেনম্যান-মন্টেথ এবং রাডার মডেলের সমন্বয়ে রিয়েল-টাইম সুপারিশ"
                  : "Live Penman-Monteith ETc and radar rainfall assimilation"}
              </p>
            </div>

            <button
              onClick={onOpenExplainability}
              className="px-3 py-1.5 rounded-xl border border-[#C5BCAC] dark:border-emerald-700 bg-[#FAF7F2] dark:bg-emerald-950/50 text-[#8E2A2B] dark:text-emerald-300 text-xs font-bold hover:bg-[#F2ECE0] dark:hover:bg-emerald-900/60 transition flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isBn ? "কেন এই সিদ্ধান্ত? (ব্যাখ্যা)" : "Explain This Reasoning"}</span>
            </button>
          </div>

          {/* Primary Today's Prescription */}
          <div className="p-5 bg-[#FAF7F2] dark:bg-emerald-950/30 border border-[#E8E0D5] dark:border-emerald-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E2A2B] dark:text-emerald-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                <span>{isBn ? "আজকের সেচ সিদ্ধান্ত" : "Today's Irrigation Command"}</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/80 px-2.5 py-0.5 rounded-full font-bold">
                {irrigation?.action || "NO_IRRIGATION"}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {isBn
                ? irrigation?.reasonBn || "মাটির বর্তমান আর্দ্রতা ও সম্ভাব্য বৃষ্টির কারণে আজ পাম্প বন্ধ রাখুন।"
                : irrigation?.reasonEn || "Soil moisture storage is sufficient. Hold pump motors to prevent nitrogen leaching."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span>
                ETc: <strong className="text-slate-900 dark:text-slate-200">{irrigation?.ETc ?? 4.7} mm/d</strong>
              </span>
              <span>&bull;</span>
              <span>
                Forecast Rain: <strong className="text-slate-900 dark:text-slate-200">{irrigation?.effectiveRainfallMm ?? 0} mm</strong>
              </span>
              <span>&bull;</span>
              <span>
                Calculated: <strong className="text-slate-900 dark:text-slate-200">Just Now (Open-Meteo Synoptic)</strong>
              </span>
            </div>
          </div>

          {/* 4 Modular Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => onNavigateTab("aiSummary")}
              className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-50 rounded-2xl border border-amber-200 dark:border-amber-800/60 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold uppercase">AI Farmer Briefing</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">Today&apos;s Checklist & Voice</span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
                Open Daily Briefing <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div
              onClick={() => onNavigateTab("emailDesk")}
              className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-50 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">Automated Email</span>
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">Dispatch Advisory & CRON</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                Configure Dispatch <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div
              onClick={() => onNavigateTab("map")}
              className="p-3.5 bg-[#FAF7F2] dark:bg-stone-900/50 hover:bg-[#F2ECE0] dark:hover:bg-stone-800 rounded-2xl border border-[#E8E0D5] dark:border-[#22382D] transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">GIS Field Parcel</span>
                <Layers className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">OpenStreetMap & Bounds</span>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 mt-1">
                View Parcel GIS <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Right: Crop Phenology & Season Progress */}
        <div className="lg:col-span-4 bg-[#FFFDFB] dark:bg-[#14221B] p-6 rounded-3xl border border-[#E8E0D5] dark:border-[#22382D] shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#3D352A] dark:text-stone-100 flex items-center justify-between font-display">
            <span>{isBn ? "פסলের বৃদ্ধি পর্যায় ও অগ্রগতি" : "Crop Phenology Trajectory"}</span>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
              Day 45 / 145
            </span>
          </h3>

          <div className="space-y-3">
            {crop.stages.map((stage, idx) => {
              const isCurrent = stage.name === selectedField.currentStage;
              const isPassed = idx < crop.stages.findIndex((s) => s.name === selectedField.currentStage);

              return (
                <div
                  key={stage.name}
                  className={`p-3 rounded-2xl border text-xs transition ${
                    isCurrent
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-bold shadow-2xs"
                      : isPassed
                      ? "bg-[#FAF7F2]/70 dark:bg-[#1A2C22]/40 border-[#E8E0D5] dark:border-[#22382D] text-slate-500 dark:text-slate-400"
                      : "bg-[#FFFDFB] dark:bg-[#14221B] border-[#FAF7F2] dark:border-[#22382D] text-slate-400 dark:text-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isCurrent
                            ? "bg-emerald-600 dark:bg-emerald-400 animate-pulse"
                            : isPassed
                            ? "bg-slate-400"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                      <span>{isBn ? stage.nameBn : stage.name}</span>
                    </span>
                    <span className="font-mono text-[10px]">
                      Kc: {stage.kc} &bull; {stage.durationDays}d
                    </span>
                  </div>
                  {isCurrent && (
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-normal mt-1.5 leading-snug">
                      {isBn
                        ? `পানি সংবেদনশীলতা: ${stage.waterSensitivity === "critical" ? "অত্যন্ত সংবেদনশীল" : "স্বাভাবিক"}। রুট ডেপথ: ${stage.rootDepthM} মি.`
                        : `Water sensitivity: ${stage.waterSensitivity}. Active root depth: ${stage.rootDepthM}m.`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
