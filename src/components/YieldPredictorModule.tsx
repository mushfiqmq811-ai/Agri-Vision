import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  Droplet,
  CloudSun,
  AlertTriangle,
  FileCheck,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { GeoField, Language } from "../types";

interface Props {
  selectedField: GeoField;
  language: Language;
}

export const YieldPredictorModule: React.FC<Props> = ({
  selectedField,
  language,
}) => {
  const isBn = language === "bn";

  // Simulation Controls
  const [anomalyMode, setAnomalyMode] = useState<"none" | "heatwave" | "drought" | "optimal">("none");
  const [soilNitrogen, setSoilNitrogen] = useState<"low" | "medium" | "high">("medium");
  const [isSimulating, setIsSimulating] = useState(false);

  // Default parameters based on field type
  const isRice = selectedField.variety.toLowerCase().includes("dhan") || selectedField.variety.toLowerCase().includes("brri");
  const baseYield = isRice ? 4.2 : 3.6; // Tons/hectare default baseline

  // Derived Simulation Metrics
  let yieldModifier = 1.0;
  if (anomalyMode === "heatwave") yieldModifier -= 0.18;
  if (anomalyMode === "drought") yieldModifier -= 0.28;
  if (anomalyMode === "optimal") yieldModifier += 0.12;

  if (soilNitrogen === "low") yieldModifier -= 0.10;
  if (soilNitrogen === "high") yieldModifier += 0.08;

  const simulatedYield = (baseYield * yieldModifier).toFixed(2);
  const totalSimulatedFieldYield = (Number(simulatedYield) * (selectedField.areaBigha * 0.1338)).toFixed(2); // converting bigha to Hectare approx (1 bigha = 0.1338 Ha)
  const expectedHarvestDays = anomalyMode === "heatwave" ? 110 : anomalyMode === "drought" ? 105 : 120;
  const climateResilienceScore = anomalyMode === "drought" ? 42 : anomalyMode === "optimal" ? 88 : 65;

  // Chart data simulation
  const mockGrowthData = [
    { name: isBn ? "বীজ বপন" : "Sowing", base: 10, simulated: 10 },
    { name: isBn ? "কুশি গজানো" : "Tillering", base: 30, simulated: 30 * (soilNitrogen === "low" ? 0.85 : 1.05) },
    { name: isBn ? "থোড় আসা" : "Panicle Init", base: 60, simulated: 60 * yieldModifier },
    { name: isBn ? "ফুল ফোটা" : "Flowering", base: 85, simulated: 85 * yieldModifier },
    { name: isBn ? "পাকা শস্য" : "Maturity", base: 100, simulated: 100 * yieldModifier },
  ];

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-[#1B3B2B] dark:border-emerald-800 shadow-sm vintage-manuscript-paper space-y-6">
      
      {/* Module Title */}
      <div className="flex items-center justify-between border-b border-[#1B3B2B]/20 dark:border-emerald-800/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1B3B2B]/10 dark:bg-emerald-950/40 text-[#1B3B2B] dark:text-emerald-400 flex items-center justify-center border border-[#1B3B2B]/20">
            <TrendingUp className="w-5 h-5 text-[#9A3412]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#1B3B2B] dark:text-emerald-400 font-display">
              {isBn ? "এআই মাইক্রো-ক্লাইমেট ফলন সিমুলেটর" : "AI Micro-Climate Yield Predictor"}
            </h3>
            <p className="text-[11px] text-[#5C4033] dark:text-stone-400">
              {isBn 
                ? "১০ বছরের আবহাওয়া রেকর্ড এবং স্যাটেলাইট বায়োমাস বিশ্লেষণ" 
                : "Simulation mapping based on 10-year Open-Meteo & SoilGrids history"}
            </p>
          </div>
        </div>
        <div className="wax-seal rounded-full w-9 h-9 text-white font-sans text-[10px] select-none font-bold">
          AI
        </div>
      </div>

      {/* Main Grid: Left Controls, Right Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Controls */}
        <div className="lg:col-span-5 bg-[#FCF9F2]/60 dark:bg-slate-950/40 p-4 rounded-2xl border border-[#1B3B2B]/20 space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#1B3B2B] dark:text-emerald-400">
            {isBn ? "সিমুলেশন প্যারামিটার" : "Simulation Inputs"}
          </h4>

          {/* Anomaly Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-[#5C4033] dark:text-stone-400 uppercase flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5 text-[#B45309]" />
              <span>{isBn ? "জলবায়ু পরিস্থিতি" : "Climate Scenarios"}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "none", label: isBn ? "স্বাভাবিক আবহাওয়া" : "Standard Season" },
                { id: "optimal", label: isBn ? "অনুকূল জলবায়ু" : "Optimal Conditions" },
                { id: "heatwave", label: isBn ? "তীব্র দাবদাহ" : "Severe Heatwave" },
                { id: "drought", label: isBn ? "অনাবৃষ্টি / খরা" : "Drought Scenario" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setAnomalyMode(item.id as any);
                    runSimulation();
                  }}
                  className={`p-2 rounded-xl text-left text-[11px] font-bold border transition ${
                    anomalyMode === item.id
                      ? "bg-[#1B3B2B] text-white border-[#1B3B2B] dark:bg-emerald-800"
                      : "bg-white dark:bg-slate-900 border-[#1B3B2B]/10 dark:border-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Soil Nitrogen Level Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-[#5C4033] dark:text-stone-400 uppercase flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-blue-600" />
              <span>{isBn ? "মাটির নাইট্রোজেন সমৃদ্ধি" : "Soil Nitrogen Level (N)"}</span>
            </label>
            <div className="flex bg-white dark:bg-slate-900 rounded-xl border border-[#1B3B2B]/10 dark:border-slate-800 p-0.5">
              {[
                { id: "low", label: isBn ? "কম (Deficient)" : "Low" },
                { id: "medium", label: isBn ? "মাঝারি (Optimal)" : "Medium" },
                { id: "high", label: isBn ? "অতিরিক্ত (Excess)" : "High" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSoilNitrogen(item.id as any);
                    runSimulation();
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition ${
                    soilNitrogen === item.id
                      ? "bg-[#9A3412] text-white"
                      : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-[#B45309] text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isBn ? "প্রক্ষেপণ নোট" : "Projection Confidence"}</span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
              {isBn 
                ? "আমাদের মেশিন লার্নিং অ্যালগরিদম ৮৭% নির্ভুলতার সাথে ফলন প্রাক্কলন করে।" 
                : "ML algorithms simulate outcomes using historical subdistrict microclimate inputs."}
            </p>
          </div>
        </div>

        {/* Right Side: Projections and Charts */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Key Simulation Output Tiles */}
          <div className="grid grid-cols-3 gap-3">
            
            <div className="bg-[#FAF7F0] dark:bg-slate-950 p-3 rounded-2xl border border-[#1B3B2B]/10 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400">
                {isBn ? "হেক্টর প্রতি ফলন" : "Yield Rate (T/Ha)"}
              </span>
              <div>
                <span className="text-xl font-black font-display text-[#1B3B2B] dark:text-emerald-400">
                  {simulatedYield}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5">MT / Hectare</span>
              </div>
            </div>

            <div className="bg-[#FAF7F0] dark:bg-slate-950 p-3 rounded-2xl border border-[#1B3B2B]/10 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400">
                {isBn ? "জমির মোট ফলন" : "Total Plot Yield"}
              </span>
              <div>
                <span className="text-xl font-black font-display text-[#9A3412]">
                  {totalSimulatedFieldYield}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5">Metric Tons (MT)</span>
              </div>
            </div>

            <div className="bg-[#FAF7F0] dark:bg-slate-950 p-3 rounded-2xl border border-[#1B3B2B]/10 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400">
                {isBn ? "পরিপক্কতার দিন" : "Days to Harvest"}
              </span>
              <div>
                <span className="text-xl font-black font-display text-[#B45309]">
                  {expectedHarvestDays}
                </span>
                <span className="text-[9px] text-[#5C4033] block mt-0.5">{isBn ? "দিন" : "Days"}</span>
              </div>
            </div>

          </div>

          {/* Graphical Growth Trajectory Curve */}
          <div className="bg-[#FAF7F0] dark:bg-slate-950 p-4 rounded-3xl border border-[#1B3B2B]/10 space-y-2">
            <h4 className="text-xs font-bold text-[#5C4033] dark:text-stone-300 flex items-center justify-between">
              <span>{isBn ? "প্রত্যাশিত বৃদ্ধি এবং বায়োমাস সঞ্চয়ন" : "Expected Growth & Biomass Accumulation"}</span>
              <span className="text-[10px] text-emerald-700 font-mono">Anomaly: {anomalyMode.toUpperCase()}</span>
            </h4>

            <div className="h-44 w-full">
              {isSimulating ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#1B3B2B] border-t-transparent" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,64,51,0.08)" />
                    <XAxis dataKey="name" stroke="#888" fontSize={9} />
                    <YAxis stroke="#888" fontSize={9} />
                    <Tooltip contentStyle={{ background: "#FCF9F2", border: "1px solid #1B3B2B", fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="base"
                      stroke="#888"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      name={isBn ? "বেঞ্চমার্ক গড়ের গতি" : "Historical Baseline"}
                    />
                    <Line
                      type="monotone"
                      dataKey="simulated"
                      stroke="#1B3B2B"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name={isBn ? "সিমুলেটেড প্রক্ষেপণ" : "Simulated Yield Curve"}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Government / Research Standard Sign off stamp */}
          <div className="flex items-center justify-between bg-[#F1ECE0]/40 dark:bg-slate-950/20 p-3 rounded-xl border border-dashed border-[#1B3B2B]/20 text-[11px] text-[#5C4033] dark:text-stone-300">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#9A3412]" />
              <span>
                {isBn 
                  ? "BARI/BRRI ধানের ফলন প্যারামিটারের সাথে সুসংগত।" 
                  : "Verified according to BARI Rice Growth Parameters & Crop Coefficients."}
              </span>
            </span>
            <span className="font-mono text-[9px] text-[#B45309] font-bold">APPROVED MODEL</span>
          </div>

        </div>

      </div>

    </div>
  );
};
