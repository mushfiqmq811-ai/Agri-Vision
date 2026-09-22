import React, { useState } from "react";
import {
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Language, GeoField } from "../types";

interface Props {
  language: Language;
  selectedField: GeoField;
}

const MARKET_HUBS = [
  { id: "dhaka", name: "Karwan Bazar, Dhaka", nameBn: "কারওয়ান বাজার, ঢাকা" },
  { id: "bogura", name: "Mahasthan Ganj, Bogura", nameBn: "মহাস্থানগড় হাট, বগুড়া" },
  { id: "jessore", name: "Rajarhat Market, Jessore", nameBn: "রাজারহাট বাজার, যশোর" },
  { id: "rajshahi", name: "Baneshwar Hat, Rajshahi", nameBn: "বানেশ্বর হাট, রাজশাহী" },
];

const COMMODITIES = [
  {
    id: "rice",
    name: "Fine Miniket Rice",
    nameBn: "সরু মিনিকেট চাল",
    unit: "Quintal (100kg)",
    unitBn: "কুইন্টাল (১০০ কেজি)",
    currentPrice: 6800,
    retailPrice: 74, // per kg
    change: +2.4,
    trend: "up",
    forecastData: [
      { week: "Week 1", price: 6800 },
      { week: "Week 2 (Proj)", price: 6920 },
      { week: "Week 3 (Proj)", price: 7100 },
      { week: "Week 4 (Proj)", price: 7250 },
    ],
    recommendationEn: "Strong Hold: Price is climbing due to festive seasonal demands. Best to delay bulk sales by 10-14 days.",
    recommendationBn: "ধরে রাখুন: উৎসবের চাহিদার কারণে মিনিকেটের দাম বাড়ছে। আগামী ১০-১৪ দিন পর পাইকারি বিক্রি করলে লাভবান হবেন।",
  },
  {
    id: "jute",
    name: "Tosha Quality Jute",
    nameBn: "তোষা উন্নত পাট",
    unit: "Maund (40kg)",
    unitBn: "মন (৪০ কেজি)",
    currentPrice: 3100,
    retailPrice: 85,
    change: -1.2,
    trend: "down",
    forecastData: [
      { week: "Week 1", price: 3100 },
      { week: "Week 2 (Proj)", price: 3050 },
      { week: "Week 3 (Proj)", price: 2980 },
      { week: "Week 4 (Proj)", price: 2900 },
    ],
    recommendationEn: "Sell Now: Bumper harvesting in Rajshahi region is saturating warehouses. Unload 70% of Tosha inventory.",
    recommendationBn: "বিক্রি করুন: রাজশাহীতে বাম্পার ফলনের কারণে গুদাম ভরে যাচ্ছে। তোষা পাটের স্টক দ্রুত বিক্রি করার পরামর্শ দেওয়া হলো।",
  },
  {
    id: "potato",
    name: "Diamant Premium Potato",
    nameBn: "ডায়মন্ড গোল আলু",
    unit: "Bag (80kg)",
    unitBn: "বস্তা (৮০ কেজি)",
    currentPrice: 2400,
    retailPrice: 38,
    change: +5.8,
    trend: "up",
    forecastData: [
      { week: "Week 1", price: 2400 },
      { week: "Week 2 (Proj)", price: 2550 },
      { week: "Week 3 (Proj)", price: 2700 },
      { week: "Week 4 (Proj)", price: 2820 },
    ],
    recommendationEn: "Partial Sell: Cool storage facility supply is decreasing. Release 40% of stocks to lock in high margins.",
    recommendationBn: "আংশিক বিক্রি করুন: হিমাগারের স্টক কমছে। সর্বোচ্চ মূল্যের সুযোগ নিতে আপনার আলুর ৪০% বাজারে ছাড়ুন।",
  },
  {
    id: "onion",
    name: "Deshi Local Onion",
    nameBn: "দেশি পেঁয়াজ",
    unit: "Maund (40kg)",
    unitBn: "মন (৪০ কেজি)",
    currentPrice: 4200,
    retailPrice: 110,
    change: +12.4,
    trend: "up",
    forecastData: [
      { week: "Week 1", price: 4200 },
      { week: "Week 2 (Proj)", price: 4500 },
      { week: "Week 3 (Proj)", price: 4850 },
      { week: "Week 4 (Proj)", price: 5100 },
    ],
    recommendationEn: "Critical Hold: Import volumes are down. Local premium onion rates will continue to rocket next month.",
    recommendationBn: "দীর্ঘমেয়াদী ধরে রাখুন: পেঁয়াজ আমদানি কমার ফলে দেশি পেঁয়াজের দাম আগামী মাসে রেকর্ড উচ্চতায় পৌঁছাতে পারে।",
  },
];

export const MarketIntelligenceModule: React.FC<Props> = ({ language, selectedField }) => {
  const isBn = language === "bn";
  const [selectedHub, setSelectedHub] = useState("dhaka");
  const [selectedCommodity, setSelectedCommodity] = useState(COMMODITIES[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {isBn ? "কৃষি বিপণন পূর্বাভাস ও মার্কেট এআই" : "AGRO-MARKET INTELLIGENCE & FORECASTING ENGINE"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
              Deshi Price Feed v1.2
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {isBn ? "প্রধান শস্যের পাইকারি বাজারদর ও পূর্বাভাস" : "Commodity Wholesale Pricing & AI Price Predictor"}
          </h2>
        </div>

        {/* Hub Selection */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer pr-1"
          >
            {MARKET_HUBS.map((hub) => (
              <option key={hub.id} value={hub.id}>
                {isBn ? hub.nameBn : hub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Commodities */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {COMMODITIES.map((comm) => {
          const isSelected = selectedCommodity.id === comm.id;
          return (
            <button
              key={comm.id}
              onClick={() => setSelectedCommodity(comm)}
              className={`p-4 rounded-2xl border text-left transition relative cursor-pointer flex flex-col justify-between h-36 ${
                isSelected
                  ? "bg-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/10"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {isBn ? comm.unitBn : comm.unit}
                  </span>
                  <div className={`p-1 rounded-lg ${comm.trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {comm.trend === "up" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 mt-2">
                  {isBn ? comm.nameBn : comm.name}
                </h3>
              </div>

              <div>
                <div className="text-lg font-black text-slate-900 font-mono">
                  ৳{comm.currentPrice}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-[10px] font-bold font-mono ${comm.trend === "up" ? "text-emerald-700" : "text-rose-600"}`}>
                    {comm.trend === "up" ? "+" : ""}{comm.change}%
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase font-mono">this week</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Forecast & AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Price Trajectory Area Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>
                  {isBn
                    ? `${selectedCommodity.nameBn} ৪ সপ্তাহের দামের পূর্বাভাস গতিপথ`
                    : `${selectedCommodity.name} 4-Week AI Projection Trajectory`}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn
                  ? "বিগত বাজার প্রবণতা এবং কৃত্রিম বুদ্ধিমত্তা পূর্বাভাসের মিশ্রিত ডেটা"
                  : "Amalgamated forecasting index calculated using seasonal trends and supply inputs."}
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg">
              {isBn ? "নির্ভুলতা: ৯৪%" : "Confidence Score: 94.2%"}
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedCommodity.forecastData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tickLine={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={["auto", "auto"]} tickLine={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`৳${value}`, isBn ? "পূর্বাভাসকৃত মূল্য" : "Projected Price"]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#priceColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Action Advisory & Hub Insights */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* AI Decision Card */}
          <div className="bg-[#FFFDFB] dark:bg-[#14221B] p-5 rounded-3xl border border-emerald-100 dark:border-[#22382D] shadow-xs flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400 tracking-wider">
                  {isBn ? "বাজার বিপণন সিদ্ধান্ত এআই" : "AGRO-MARKET INTELLIGENCE ADVISORY"}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-stone-100">
                  {isBn ? "কৃষক ও ব্যবসায়ীদের জন্য অ্যাকশন প্ল্যান" : "Aggregated Action Recommendation"}
                </h4>
                <p className="text-xs text-slate-700 dark:text-stone-300 leading-relaxed font-medium">
                  {isBn ? selectedCommodity.recommendationBn : selectedCommodity.recommendationEn}
                </p>
              </div>
            </div>

            <div className="border-t border-emerald-100 dark:border-emerald-900/30 pt-3 mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400">{isBn ? "সর্বশেষ আপডেট: আজ" : "Feed Status: Real-time"}</span>
              <div className="flex items-center gap-1 text-emerald-700 font-bold font-mono">
                <span>{isBn ? "প্রো-প্যাক" : "FREE INTELLIGENCE"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Local Market Retail Indicator */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold block mb-1">
              {isBn ? "খুচরা বাজার মূল্য নির্দেশক" : "Average Consumer Retail Rate"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">৳{selectedCommodity.retailPrice}</span>
              <span className="text-xs text-slate-500">/ {isBn ? "কেজি" : "kg"}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              {isBn
                ? "* ঢাকার প্রধান খুচরা এবং কাঁচাবাজারের গড় খুচরা হার নির্দেশ করে।"
                : "* Represents current consumer retail rate indexes across urban Dhaka division outlets."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
