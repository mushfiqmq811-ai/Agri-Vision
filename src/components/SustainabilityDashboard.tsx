import React from "react";
import {
  Leaf,
  Droplets,
  Zap,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Award,
  Globe,
  ArrowRight,
  Info,
} from "lucide-react";
import { GeoField, Language } from "../types";

interface Props {
  selectedField: GeoField;
  language: Language;
}

export const SustainabilityDashboard: React.FC<Props> = ({ selectedField, language }) => {
  const isBn = language === "bn";

  // Sustainability calculations for selected parcel
  const bigha = selectedField.areaBigha;
  // Traditional flood irrigation uses ~1100 m3 water/bigha for Boro rice
  // AGRI-VISION smart AWD (Alternate Wetting and Drying) uses ~720 m3
  const waterSavedM3 = Math.round(bigha * 380);
  const fuelDieselSavedLiters = Math.round((waterSavedM3 / 30) * 1.2); // ~1.2L diesel per 30m3 pumping
  const co2AvoidedKg = Math.round(fuelDieselSavedLiters * 2.68); // 2.68 kg CO2 per liter diesel
  const waterProductivityKgM3 = 1.35; // kg grain per m3 of water (standard is ~0.85)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {isBn ? "টেকসই পরিবেশ ও কার্বন পদচিহ্ন পর্যবেক্ষণ" : "AGRO-ECOLOGICAL SUSTAINABILITY & ESG INDEX"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
              SDG 2, 6, 12, 13
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {isBn
              ? `${selectedField.nameBn} পানি সাশ্রয়, কার্বন হ্রাস ও মৃত্তিকা স্বাস্থ্য`
              : `${selectedField.name} Water Conservation, Carbon Mitigation & Soil Health`}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Eco-Efficiency Grade: A+</span>
        </div>
      </div>

      {/* Hero Environmental Savings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Water Saved */}
        <div className="bg-gradient-to-br from-sky-50 to-white p-5 rounded-3xl border border-sky-200 shadow-xs">
          <div className="flex items-center justify-between text-sky-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isBn ? "ভূগর্ভস্থ পানি সাশ্রয়" : "Groundwater Preserved"}
            </span>
            <Droplets className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-sky-950 font-mono">
            {waterSavedM3.toLocaleString()}{" "}
            <span className="text-sm font-semibold text-sky-700">m³</span>
          </div>
          <div className="text-xs text-sky-700 font-medium mt-1">
            ~{(waterSavedM3 * 1000).toLocaleString()} {isBn ? "লিটার পানি সংরক্ষিত" : "Liters Saved this Season"}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isBn
              ? "পরিমিত সেচ ও এডব্লিউডি (AWD) প্রযুক্তির ফলে প্রচলিত প্লাবন সেচের চেয়ে ৩৫% পানি সাশ্রয় হয়েছে।"
              : "34.5% conservation compared to conventional continuous flooding regime."}
          </p>
        </div>

        {/* Diesel & Fuel Saved */}
        <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-3xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isBn ? "পাম্পের জ্বালানি সাশ্রয়" : "Pumping Energy Saved"}
            </span>
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-950 font-mono">
            {fuelDieselSavedLiters}{" "}
            <span className="text-sm font-semibold text-amber-700">Liters</span>
          </div>
          <div className="text-xs text-amber-800 font-medium mt-1">
            ~৳{(fuelDieselSavedLiters * 108).toLocaleString()} {isBn ? "খরচ হ্রাস" : "BDT Fuel Cost Saved"}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isBn
              ? "পাম্প চলার সময় কমে যাওয়ায় কৃষকের সরাসরি ডিজেল বা বিদ্যুৎ ব্যয় কমেছে।"
              : "Direct operating expense curtailment from optimized pump runtime scheduling."}
          </p>
        </div>

        {/* CO2 Emissions Mitigated */}
        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isBn ? "কার্বন নির্গমন হ্রাস" : "CO₂e Avoided"}
            </span>
            <Globe className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-950 font-mono">
            {co2AvoidedKg}{" "}
            <span className="text-sm font-semibold text-emerald-700">kg CO₂e</span>
          </div>
          <div className="text-xs text-emerald-800 font-medium mt-1">
            Methane (CH₄) Suppression: -42%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isBn
              ? "মাটিতে নিয়মিত বাতাস চলাচলের কারণে অ্যানারোবিক মিথেন নির্গমন উল্লেখযোগ্য পরিমাণে কমেছে।"
              : "Periodic aeration breaks anaerobic soil conditions, suppressing enteric methanogenesis."}
          </p>
        </div>
      </div>

      {/* Detailed Ecological Indices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Fertilizer Leaching & Water Quality */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "নাইট্রেট লিচিং ও ভূগর্ভস্থ পানিদূষণ ঝুঁকি" : "Nitrate Leaching & Groundwater Eutrophication"}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Low Risk (12%)
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Nitrogen Runoff Vulnerability</span>
                <span className="text-emerald-700 font-mono font-bold">Safe (14 kg N/ha)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Aquifer Salinity Contamination</span>
                <span className="text-sky-700 font-mono font-bold">Stable (&lt; 0.8 dS/m)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-600 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            {isBn
              ? "আবহাওয়ার পূর্বাভাস দেখে ইউরিয়া প্রয়োগ করায় বৃষ্টির পানিতে সার ধুয়ে যাওয়ার ঝুঁকি ন্যূনতম।"
              : "Split top-dressing synchronized with weather forecasts prevents non-point source fertilizer runoff."}
          </div>
        </div>

        {/* Water Productivity & Resource Efficiency */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "পানির উৎপাদনশীলতা সূচক (Water Productivity)" : "Agricultural Water Productivity (WP)"}
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {waterProductivityKgM3} kg/m³
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">AGRI-VISION Field</span>
              <span className="text-xl font-extrabold text-emerald-800 font-mono">
                {waterProductivityKgM3} kg/m³
              </span>
              <span className="text-[10px] text-emerald-700 block font-medium mt-0.5">
                +58% over baseline
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">National Average</span>
              <span className="text-xl font-extrabold text-slate-500 font-mono">
                0.85 kg/m³
              </span>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                Standard flood practice
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {isBn
              ? "প্রতি ঘনমিটার পানিতে ১.৩৫ কেজি ধান উৎপাদিত হচ্ছে। পানির অপচয় রোধ হওয়ায় একই পানি দিয়ে বেশি খাদ্য উৎপাদন সম্ভব হচ্ছে।"
              : "Grain produced per unit volume of water consumed, demonstrating high hydrodynamic resource efficiency."}
          </p>
        </div>
      </div>
    </div>
  );
};
