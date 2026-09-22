import React, { useState, useEffect, useRef } from "react";
import {
  Satellite,
  Layers,
  Calendar,
  CloudSun,
  Eye,
  TrendingUp,
  Info,
  CheckCircle2,
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  History,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GeoField, Language } from "../types";

interface Props {
  selectedField: GeoField;
  language: Language;
}

export const SatelliteNDVIModule: React.FC<Props> = ({ selectedField, language }) => {
  const isBn = language === "bn";
  const [activeBandView, setActiveBandView] = useState<"ndvi" | "ndwi" | "falseColor">("ndvi");

  // Sentinel-2 Time-lapse Playback Engine
  const [currentFrame, setCurrentFrame] = useState(3); // Start with today's frame
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per frame

  const timeLapseFrames = [
    {
      date: "Dec 01, 2025",
      stage: isBn ? "বীজ রোপণ ও অঙ্কুরোদগম" : "Early Sowing / Seedling",
      ndvi: 0.22,
      ndwi: 0.12,
      fcc: "Faint pink hue spectrum",
      grid: [
        [0.18, 0.20, 0.21, 0.19],
        [0.22, 0.24, 0.20, 0.23],
        [0.19, 0.21, 0.25, 0.22],
        [0.20, 0.22, 0.23, 0.24]
      ]
    },
    {
      date: "Jan 01, 2026",
      stage: isBn ? "কুঁড়ি ও প্রাথমিক বৃদ্ধি" : "Active Tillering Phase",
      ndvi: 0.52,
      ndwi: 0.38,
      fcc: "Moderate scarlet red",
      grid: [
        [0.45, 0.50, 0.48, 0.52],
        [0.55, 0.58, 0.51, 0.49],
        [0.48, 0.53, 0.56, 0.54],
        [0.50, 0.52, 0.51, 0.53]
      ]
    },
    {
      date: "Feb 01, 2026",
      stage: isBn ? "পুষ্পায়ন ও সতেজ সবুজ কাল" : "Heading & Flowering Stage",
      ndvi: 0.72,
      ndwi: 0.58,
      fcc: "Deep intense crimson infrared",
      grid: [
        [0.68, 0.72, 0.70, 0.74],
        [0.75, 0.78, 0.71, 0.73],
        [0.69, 0.74, 0.76, 0.75],
        [0.71, 0.73, 0.72, 0.74]
      ]
    },
    {
      date: "Feb 15, 2026",
      stage: isBn ? "সর্বোচ্চ পরিপক্কতা (আজ)" : "Peak Maturity (Today)",
      ndvi: selectedField.ndviAverage,
      ndwi: 0.64,
      fcc: "Ultra-saturated red canopy",
      grid: [
        [0.74, 0.77, 0.75, 0.79],
        [0.82, 0.85, 0.79, 0.78],
        [0.76, 0.81, 0.83, 0.80],
        [0.78, 0.80, 0.79, 0.81]
      ]
    }
  ];

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % timeLapseFrames.length);
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed]);

  // Historical NDVI seasonal curve (2025/2026 current season vs 5-year baseline)
  const ndviTrajectoryData = [
    { date: "Dec 01", current: 0.22, baseline: 0.24 },
    { date: "Dec 15", current: 0.35, baseline: 0.36 },
    { date: "Jan 01", current: 0.52, baseline: 0.50 },
    { date: "Jan 15", current: 0.65, baseline: 0.62 },
    { date: "Feb 01", current: 0.72, baseline: 0.70 },
    { date: "Feb 15", current: selectedField.ndviAverage, baseline: 0.75 },
    { date: "Mar 01 (Proj)", current: 0.82, baseline: 0.79 },
    { date: "Mar 15 (Proj)", current: 0.74, baseline: 0.72 },
    { date: "Apr 01 (Proj)", current: 0.48, baseline: 0.45 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {isBn ? "ইউরোপীয় স্পেস এজেন্সি কোপার্নিকাস সেন্টিনেল-২" : "COPERNICUS SENTINEL-2 MSI PLATFORM"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
              10m Multispectral GSD
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {isBn
              ? `${selectedField.nameBn} স্পেকট্রাল ক্যানোপি ও বায়োমাস মনিটরিং`
              : `${selectedField.name} Spectral Biomass & Canopy Dynamics`}
          </h2>
        </div>

        {/* Index Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveBandView("ndvi")}
            className={`px-3 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
              activeBandView === "ndvi"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            NDVI (Vegetation)
          </button>
          <button
            onClick={() => setActiveBandView("ndwi")}
            className={`px-3 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
              activeBandView === "ndwi"
                ? "bg-sky-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            NDWI (Canopy Water)
          </button>
          <button
            onClick={() => setActiveBandView("falseColor")}
            className={`px-3 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
              activeBandView === "falseColor"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            FCC (B8-B4-B3)
          </button>
        </div>
      </div>

      {/* Orbit & Pass Metadata Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">
            {isBn ? "সর্বশেষ স্যাটেলাইট অতিক্রম" : "Latest Overpass"}
          </span>
          <span className="text-lg font-extrabold text-slate-900 font-mono">
            Sentinel-2B
          </span>
          <span className="text-[11px] text-slate-500 block">
            Acquired: 3 days ago &bull; 10:42 AM
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">
            {isBn ? "মেঘের উপস্থিতি" : "Cloud Cover Filter"}
          </span>
          <span className="text-lg font-extrabold text-emerald-700 font-mono">
            4.2% (Clear)
          </span>
          <span className="text-[11px] text-slate-500 block">
            Quality Flag: Passed QA60
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">
            {isBn ? "গড় ক্যানোপি এনডিভিআই" : "Parcel Avg NDVI"}
          </span>
          <span className="text-2xl font-black text-emerald-800 font-mono">
            {selectedField.ndviAverage}
          </span>
          <span className="text-[11px] text-emerald-700 block font-medium">
            Vigorous Green Leaf Area
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block uppercase font-medium">
            {isBn ? "পরবর্তী উপগ্রহ অতিক্রম" : "Next Pass Schedule"}
          </span>
          <span className="text-lg font-extrabold text-slate-900 font-mono">
            In 2 Days
          </span>
          <span className="text-[11px] text-slate-500 block">
            Sentinel-2A &bull; Relative Orbit 119
          </span>
        </div>
      </div>

      {/* Sentinel-2 Time-lapse Playback UI */}
      <div className="bg-[#FFFDFB] dark:bg-[#14221B] p-6 rounded-3xl border border-emerald-100 dark:border-[#22382D] shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-emerald-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-[#FAF7F2]">
                {isBn ? "কোপার্নিকাস সেন্টিনেল-২ টাইম-ল্যাপস প্লেয়ার" : "Sentinel-2 Multitemporal Time-Lapse Player"}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? "৪ মাসের বৃদ্ধির চক্রের ঐতিহাসিক এবং রিয়েল-টাইম উপগ্রহ চিত্রাবলি" : "Interactive bi-weekly multispectral vegetation canopy development timeline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed selection */}
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">{isBn ? "গতি" : "SPEED"}:</span>
            <div className="flex bg-slate-100 dark:bg-emerald-950/40 p-0.5 rounded-lg border border-slate-200 dark:border-[#22382D] text-[10px] font-bold font-mono">
              {[500, 1000, 2000].map((speed, i) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    playbackSpeed === speed
                      ? "bg-emerald-700 text-white"
                      : "text-slate-600 dark:text-stone-400 hover:text-slate-900"
                  }`}
                >
                  {i === 0 ? "2x" : i === 1 ? "1x" : "0.5x"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left half: High-fidelity Simulated Satellite Grid */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950 p-5 rounded-2xl relative overflow-hidden group border border-slate-800">
            {/* Moving Laser Scan Bar */}
            {isPlaying && (
              <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-10 animate-pulse pointer-events-none" style={{
                animation: "scanLine 2s linear infinite",
                top: "0%"
              }} />
            )}

            {/* Satellite Grid Map (4x4 pixels representing a 10m spatial resolution plot) */}
            <div className="grid grid-cols-4 gap-1 w-full max-w-[200px] aspect-square relative z-10">
              {timeLapseFrames[currentFrame].grid.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  // Generate custom background color based on active index band
                  let bgStyle = "";
                  if (activeBandView === "ndvi") {
                    // NVDI Green gradient
                    const opacity = Math.round(val * 100);
                    bgStyle = `rgba(16, 185, 129, ${opacity / 100})`;
                  } else if (activeBandView === "ndwi") {
                    // NDWI Blue gradient
                    const opacity = Math.round((val + 0.2) * 100);
                    bgStyle = `rgba(14, 165, 233, ${opacity / 100})`;
                  } else {
                    // False Color Infrared (Intense red represent healthy vegetation)
                    const opacity = Math.round(val * 100);
                    bgStyle = `rgba(239, 68, 68, ${opacity / 100})`;
                  }

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      style={{ backgroundColor: bgStyle }}
                      className="aspect-square rounded-sm flex items-center justify-center text-[9px] font-mono font-bold text-white transition-all duration-300 border border-black/15 shadow-2xs select-none hover:scale-105 hover:z-20 cursor-crosshair"
                      title={`${activeBandView.toUpperCase()}: ${val}`}
                    >
                      {val.toFixed(2)}
                    </div>
                  );
                })
              )}
            </div>

            {/* Scale Legends */}
            <div className="w-full flex justify-between items-center text-[10px] font-mono text-slate-400 mt-4 pt-3 border-t border-slate-800/80 z-10">
              <span>{activeBandView === "ndvi" ? "Low NDVI (0.1)" : activeBandView === "ndwi" ? "Dry (0.0)" : "Non-Veg"}</span>
              <div className="w-20 h-2 rounded bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500" />
              <span>{activeBandView === "ndvi" ? "High NDVI (0.9)" : activeBandView === "ndwi" ? "Wet (0.8)" : "Dense Canopy"}</span>
            </div>

            {/* CSS Animation Keyframes Inject */}
            <style>{`
              @keyframes scanLine {
                0% { top: 0%; opacity: 0.1; }
                50% { top: 50%; opacity: 1; }
                100% { top: 100%; opacity: 0.1; }
              }
            `}</style>
          </div>

          {/* Right half: Temporal Stats and Controls */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                  {timeLapseFrames[currentFrame].date}
                </span>
                <span className="text-[11px] font-bold text-stone-500">
                  {isBn ? "ক্রমপর্যায়" : "Step"} {currentFrame + 1} / {timeLapseFrames.length}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-[#FAF7F2]">
                  {timeLapseFrames[currentFrame].stage}
                </h4>
                <p className="text-xs text-slate-600 dark:text-stone-400 leading-relaxed">
                  {isBn
                    ? `সেন্টিনেল-২ স্পেকট্রাল ব্যান্ডের রিফ্লেক্ট্যান্স থেকে গণনা করা হয়েছে। ফসলের গড় সুস্থতা সূচক এবং সজীবতা লক্ষ্য করা যাচ্ছে।`
                    : `Spectral feedback retrieved from ESA Copernicus Hub. Green Leaf Area Index (LAI) and chlorophyll activity are actively registered.`}
                </p>
              </div>

              {/* Index Value Indicator Display */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-[#1A2D22]/50 border border-slate-200 dark:border-[#22382D] rounded-xl">
                  <span className="text-[10px] text-stone-500 block font-mono uppercase tracking-wider">
                    {activeBandView === "ndvi" ? "NDVI (Vegetation)" : activeBandView === "ndwi" ? "NDWI (Canopy Water)" : "FALSE COLOR SATELLITE"}
                  </span>
                  <span className="text-xl font-black text-emerald-800 dark:text-emerald-400 font-mono">
                    {activeBandView === "ndvi" ? timeLapseFrames[currentFrame].ndvi : activeBandView === "ndwi" ? timeLapseFrames[currentFrame].ndwi : "RGB B8-B4-B3"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#1A2D22]/50 border border-slate-200 dark:border-[#22382D] rounded-xl">
                  <span className="text-[10px] text-stone-500 block font-mono uppercase tracking-wider">
                    {isBn ? "বর্ণালী স্বাক্ষর" : "SPECTRAL EVOLUTION"}
                  </span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-300 block mt-1">
                    {timeLapseFrames[currentFrame].fcc}
                  </span>
                </div>
              </div>
            </div>

            {/* Playback Controls Footer */}
            <div className="bg-slate-50 dark:bg-[#14221B] p-3 rounded-2xl border border-slate-200 dark:border-[#22382D] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentFrame((prev) => (prev - 1 + timeLapseFrames.length) % timeLapseFrames.length)}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#1C2F25] text-slate-700 dark:text-stone-300 hover:bg-slate-100 border border-slate-200 dark:border-[#22382D] cursor-pointer"
                  title="Previous Frame"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 cursor-pointer shadow-xs ${
                    isPlaying ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-700 hover:bg-emerald-800"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>{isBn ? "স্থগিত" : "Pause"}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isBn ? "চালান" : "Play Timeline"}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentFrame((prev) => (prev + 1) % timeLapseFrames.length)}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#1C2F25] text-slate-700 dark:text-stone-300 hover:bg-slate-100 border border-slate-200 dark:border-[#22382D] cursor-pointer"
                  title="Next Frame"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Slider dot timeline */}
              <div className="flex items-center gap-2">
                {timeLapseFrames.map((frame, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentFrame(i)}
                    className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                      currentFrame === i
                        ? "bg-emerald-700 dark:bg-emerald-400 scale-125 border border-white shadow-2xs"
                        : "bg-slate-300 dark:bg-stone-700 hover:bg-slate-400"
                    }`}
                    title={frame.date}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main NDVI Trend Chart vs Historical Baseline */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              {isBn
                ? "চলতি মৌসুমের এনডিভিআই গতিপথ বনাম ৫ বছরের আঞ্চলিক গড়"
                : "Seasonal Canopy NDVI Trajectory vs 5-Year Regional Benchmark"}
            </h3>
            <p className="text-xs text-slate-500">
              {isBn
                ? "সবুজ লাইন বর্তমান ফসলের স্বাস্থ্য নির্দেশ করে। লক্ষ্য করুন ফসল প্রত্যাশার চেয়ে ভালো অবস্থায় রয়েছে।"
                : "Bi-weekly Sentinel-2 progression tracking vegetative growth and chlorophyll buildup."}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Current: +3.2% vs 5Y Norm
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ndviTrajectoryData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={[0.1, 0.9]} tickLine={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Line
                type="monotone"
                dataKey="current"
                name="2025/2026 Observed NDVI"
                stroke="#15803d"
                strokeWidth={3}
                dot={{ r: 4, fill: "#15803d" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="baseline"
                name="5-Year Historical Average"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multispectral Radiometric Band Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900">
              {isBn ? "স্পেকট্রাল ব্যান্ড সূত্র ও বিশ্লেষণ" : "Multispectral Formulation"}
            </h4>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">10m GSD</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
            <div className="font-bold text-emerald-900">
              NDVI = (Band 8 - Band 4) / (Band 8 + Band 4)
            </div>
            <div className="text-[11px] text-slate-500">
              B8: NIR 842nm &bull; B4: Red 665nm
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
            <div className="font-bold text-sky-900">
              NDWI = (Band 3 - Band 8) / (Band 3 + Band 8)
            </div>
            <div className="text-[11px] text-slate-500">
              B3: Green 560nm &bull; Leaf canopy water content
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900">
            {isBn ? "কোপার্নিকাস হাব এপিআই আর্কিটেকচার" : "Copernicus Integration Pipeline"}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBn
              ? "সিস্টেমটি ইউরোপীয় মহাকাশ সংস্থার সেন্টিনেল হাব ওএসটিএস এপিআই আর্কিটেকচারের সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ। কনফিগারেশন কী যোগ করা মাত্র লাইভ টাইলিং শুরু হবে।"
              : "Ready-to-plug pipeline with Copernicus Data Space Ecosystem (CDSE) and Sentinel Hub Processing API with automated atmospheric correction (Sen2Cor / L2A BOA reflectance)."}
          </p>
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>L2A Bottom-Of-Atmosphere (BOA) Reflectance Ready</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900">
            {isBn ? "বায়োমাস ও ফলন প্রক্ষেপণ" : "Biomass & Yield Indicator"}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Leaf Area Index (LAI):</span>
              <span className="font-mono font-bold text-slate-900">3.8 m²/m²</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Chlorophyll Absorption:</span>
              <span className="font-mono font-bold text-emerald-800">High Active</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Projected Yield Trend:</span>
              <span className="font-mono font-bold text-emerald-700">+8.5% of Base</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
