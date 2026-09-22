import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Droplets,
  Sprout,
  AlertTriangle,
  Volume2,
  Camera,
  CheckCircle,
  HelpCircle,
  LogOut,
  User,
  Shield,
  Sparkles,
} from "lucide-react";
import { GeoField, Language, WeatherPayload, SoilPayload, IrrigationRecommendation, SmartAlert } from "../types";
import { FarmerAiSummaryModule } from "./FarmerAiSummaryModule";
import { FarmerVoiceAiSupporter } from "./FarmerVoiceAiSupporter";
import { useAuth } from "../context/AuthContext";

interface Props {
  field: GeoField;
  language: Language;
  weather: WeatherPayload | null;
  soil?: SoilPayload | null;
  irrigation: IrrigationRecommendation | null;
  alerts: SmartAlert[];
  onOpenCropDoctor: () => void;
  onOpenExplainability: () => void;
  onSwitchToStandard?: () => void;
}

export const FarmerModeView: React.FC<Props> = ({
  field,
  language,
  weather,
  soil,
  irrigation,
  alerts,
  onOpenCropDoctor,
  onOpenExplainability,
}) => {
  const isBn = language === "bn";
  const { user, logout } = useAuth();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Today's weather numbers
  const temp = weather?.data?.current?.temperature_2m ?? 28;
  const humidity = weather?.data?.current?.relative_humidity_2m ?? 72;

  // Local state for interactive farmer tasks
  const [tasks, setTasks] = useState([
    { id: 1, textEn: "Check morning weather & rain projections", textBn: "আজকের সকালের আবহাওয়া ও বৃষ্টিপাতের পূর্বাভাস দেখে নেওয়া", done: true },
    { id: 2, textEn: "Measure soil moisture to see if pump is needed", textBn: "মাটির রস মেপে সেচ পাম্প চালানো বা বন্ধের সিদ্ধান্ত নেওয়া", done: false },
    { id: 3, textEn: "Inspect leaf health using AI Crop Doctor scan", textBn: "এআই ক্রপ ডক্টরের মাধ্যমে ফসলের পাতার কোনো রোগ আছে কিনা পরীক্ষা করা", done: false },
    { id: 4, textEn: "Apply recommended foliar fertilizers or weed control", textBn: "জমিতে সুষম এমওপি সার ছিটানো অথবা আগাছা দমন করা", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;

  // Irrigation card details
  let irrigationTitle = isBn ? "আজ সেচ প্রয়োজন নেই" : "No Irrigation Required Today";
  let irrigationSub = isBn
    ? `মাটির আর্দ্রতা ${field.currentMoisturePct}% স্বাভাবিক সীমার মধ্যে রয়েছে।`
    : `Soil moisture at ${field.currentMoisturePct}% is adequate for current root depth.`;
  let irrigationBadge = isBn ? "আর্দ্রতা পর্যাপ্ত" : "Adequate Moisture";
  let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";

  if (irrigation?.action === "IMMEDIATE_IRRIGATION") {
    irrigationTitle = isBn ? "জরুরি সেচ প্রয়োগ করুন" : "Apply Immediate Irrigation";
    irrigationSub = isBn
      ? `মাটি শুকিয়ে গেছে। ৫ এইচপি পাম্প দিয়ে প্রায় ${irrigation.estimatedPumpDurationMinutes} মিনিট (প্রতি বিঘায় ${irrigation.volumeNeededM3PerBigha} ঘনমিটার) পানি দিন।`
      : `Soil moisture depleted. Run 5 HP pump for approx ${irrigation.estimatedPumpDurationMinutes} mins (${irrigation.volumeNeededM3PerBigha} m³/bigha).`;
    irrigationBadge = isBn ? "জরুরি সেচ" : "Urgent Irrigation";
    badgeColor = "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
  } else if (irrigation?.action === "SCHEDULE_IRRIGATION") {
    irrigationTitle = isBn ? "আগামীকাল সকালে হালকা সেচ দিন" : "Schedule Light Irrigation Tomorrow";
    irrigationSub = isBn
      ? `মাটির আর্দ্রতা ধীরে ধীরে কমছে। আগামীকাল সকালে ${irrigation.estimatedPumpDurationMinutes} মিনিট পাম্প চালান।`
      : `Moisture depletion approaching critical threshold. Schedule ${irrigation.estimatedPumpDurationMinutes} mins run tomorrow morning.`;
    irrigationBadge = isBn ? "পরিকল্পিত সেচ" : "Scheduled Run";
    badgeColor = "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
  }

  // Fertilizer & crop care
  const fertilizerTitle = isBn ? "পুষ্টি ও সার প্রয়োগ ব্যবস্থাপনা" : "Nutrient Management";
  let fertilizerSub = isBn
    ? "বর্তমান কুশি/থোড় পর্যায়ে বিঘাপ্রতি ৮ কেজি এমওপি সার দিন এবং অতিরিক্ত ইউরিয়া প্রয়োগ থেকে বিরত থাকুন।"
    : "Apply balanced MOP (8 kg/bigha) at panicle initiation; avoid excess urea to prevent fungal blast.";

  if (field.cropId === "potato") {
    fertilizerSub = isBn
      ? "আলুর গুটি বৃদ্ধির এই সময় বোরন ও জিংক সমৃদ্ধ ফলিয়ার স্প্রে করুন। কুয়াশা থাকলে ম্যানকোজেব স্প্রে প্রস্তুত রাখুন।"
      : "Spray zinc/boron micronutrients for tuber bulking; keep Mancozeb fungicide ready if fog persists.";
  } else if (field.cropId === "mango") {
    fertilizerSub = isBn
      ? "গুঁটি মটর দানার মতো হলে হালকা সেচের সাথে বোরন ও ইমিডাক্লোপ্রিড অনুমোদিত মাত্রায় স্প্রে করুন।"
      : "When pea-sized fruitlets form, spray Imidacloprid and soluble Boron with light basin irrigation.";
  }

  // Risk advice
  const criticalAlert = alerts.find((a) => a.level === "critical" || a.level === "warning");
  const riskTitle = criticalAlert
    ? isBn
      ? criticalAlert.titleBn
      : criticalAlert.titleEn
    : isBn
    ? "সাধারণ ঝুঁকি স্তর: অনুকূল পরিবেশ"
    : "Low Field Risk: Favorable Conditions";
  const riskSub = criticalAlert
    ? isBn
      ? criticalAlert.descBn
      : criticalAlert.descEn
    : isBn
    ? `তাপমাত্রা ${temp}°C ও আর্দ্রতা ${humidity}% সহ ফসলের বৃদ্ধি অনুকূলে রয়েছে। নিয়মিত পাতা পর্যবেক্ষণ করুন।`
    : `Ambient temperature ${temp}°C and RH ${humidity}% are within safe range. Routine visual scouting recommended.`;

  // Speech synthesis for farmers
  const handleReadAloud = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = isBn
      ? `আজকের কৃষক পরামর্শ। নির্বাচিত জমি: ${field.nameBn}। সেচ পরামর্শ: ${irrigationTitle}। ${irrigationSub}। সার প্রয়োগ: ${fertilizerTitle}। ${fertilizerSub}। রোগবালাই সতর্কতা: ${riskTitle}। ${riskSub}`
      : `Today's field guidance for ${field.name}. Irrigation advice: ${irrigationTitle}. ${irrigationSub}. Nutrition advice: ${fertilizerTitle}. ${fertilizerSub}. Risk advisory: ${riskTitle}. ${riskSub}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isBn ? "bn-BD" : "en-US";
    utterance.rate = 0.95;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Farmer Account Header Bar with Logout & Role Notice */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            {user?.name ? user.name.charAt(0) : "👨🌾"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-display">
                {user ? user.name : (isBn ? "কৃষক ড্যাশবোর্ড" : "Farmer Dashboard")}
              </h2>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                {isBn ? "কৃষক অ্যাকাউন্ট" : "Farmer Account"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bangla mt-0.5">
              {field.district} • {field.variety} ({isBn ? field.nameBn : field.name})
            </p>
          </div>
        </div>

        {/* Action Controls & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 hover:bg-red-100 transition text-xs font-bold cursor-pointer"
            title={isBn ? "লগ আউট করুন" : "Log Out"}
          >
            <LogOut className="w-4 h-4" />
            <span>{isBn ? "লগ আউট" : "Log Out"}</span>
          </button>
        </div>
      </div>

      {/* Notice regarding Researcher Mode Access */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 font-bangla">
        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {isBn ? "সহজ কৃষক ইন্টারফেস সক্রিয়:" : "Simple Farmer View Active:"}
          </span>{" "}
          {isBn
            ? "গবেষক মোড (Researcher Mode) বা বিস্তারিত সায়েন্টিফিক ড্যাশবোর্ডে যেতে চাইলে দয়া করে ওপরের 'লগ আউট' বাটনে চাপ দিয়ে গবেষক/এডমিন অ্যাকাউন্টে সাইন ইন করুন।"
            : "To access Researcher Mode or scientific GIS maps, please log out and sign in with a Researcher or Agronomist account."}
        </div>
      </div>

      {/* Voice AI Assistant Supporter (গলায় কথা বলে সাহায্যকারী) */}
      <FarmerVoiceAiSupporter
        field={field}
        language={language}
        weather={weather}
        soil={soil}
        irrigation={irrigation}
        alerts={alerts}
      />

      {/* Top Welcome Banner & Audio Playback */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-800 to-emerald-950 dark:from-emerald-900 dark:to-slate-950 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-700/50"
      >
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider font-bold mb-1">
            <span>👨🌾 {isBn ? "সহজ কৃষক সিদ্ধান্ত" : "FARMER DECISION ENGINE"}</span>
            <span>•</span>
            <span>{isBn ? field.nameBn : field.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display">
            {isBn ? "আজ জমিতে কী করবেন?" : "What To Do In Your Field Today?"}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl font-bangla">
            {isBn
              ? "আবহাওয়া, মাটির রস ও ফসলের বয়সের ওপর ভিত্তি করে আজকের সুনির্দিষ্ট পদক্ষেপসমূহ:"
              : "Actionable daily advisories tailored to your field's exact conditions:"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition cursor-pointer ${
              isPlayingAudio
                ? "bg-amber-400 text-slate-950 animate-pulse"
                : "bg-white text-emerald-900 hover:bg-emerald-50 dark:bg-slate-800 dark:text-emerald-300"
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{isPlayingAudio ? (isBn ? "পড়া থামান" : "Stop Audio") : (isBn ? "অডিও শুনুন" : "Listen Advice")}</span>
          </button>

          <button
            onClick={onOpenCropDoctor}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{isBn ? "পাতার ছবি তুলুন" : "Scan Leaf"}</span>
          </button>
        </div>
      </motion.div>

      {/* Field Status Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs">
        <div className="p-2 border-r border-slate-100 dark:border-slate-800 last:border-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase font-medium">
            {isBn ? "বর্তমান ফসল ও জাত" : "Crop & Variety"}
          </span>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {field.variety}
          </span>
        </div>
        <div className="p-2 border-r border-slate-100 dark:border-slate-800 last:border-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase font-medium">
            {isBn ? "ফসলের অবস্থা" : "Growth Stage"}
          </span>
          <span className="font-bold text-sm text-emerald-800 dark:text-emerald-400">
            {isBn ? field.currentStageBn : field.currentStage}
          </span>
        </div>
        <div className="p-2 border-r border-slate-100 dark:border-slate-800 last:border-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase font-medium">
            {isBn ? "মাটির রস" : "Soil Moisture"}
          </span>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {field.currentMoisturePct}% ({isBn ? "পর্যাপ্ত" : "Optimal"})
          </span>
        </div>
        <div className="p-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase font-medium">
            {isBn ? "আজকের আবহাওয়া" : "Live Weather"}
          </span>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {temp}°C | {humidity}% RH
          </span>
        </div>
      </div>

      {/* Daily Field Tasks Checklist Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-display">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? "আজকের নির্ধারিত কাজ" : "Today's Farm Work Checklist"}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-bangla">
              {isBn ? "আপনার ফসলের সুরক্ষায় কাজগুলো সম্পন্ন করুন" : "Complete these activities to protect crop yield"}
            </p>
          </div>
          <div className="text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-xl self-start sm:self-center">
            {isBn ? "সম্পন্ন:" : "Progress:"} {completedCount} / {tasks.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                t.done
                  ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500/30 text-slate-400 line-through"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:bg-white"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                t.done
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-slate-400 dark:border-slate-500"
              }`}>
                {t.done && (
                  <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
                )}
              </div>
              <span className="text-xs font-bold leading-relaxed font-bangla">
                {isBn ? t.textBn : t.textEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Irrigation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                {irrigationBadge}
              </span>
            </div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
              {isBn ? "পদক্ষেপ ১: সেচ" : "Action 1: Irrigation"}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1 mb-2 leading-snug font-display">
              {irrigationTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bangla">
              {irrigationSub}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={onOpenExplainability}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isBn ? "কেন এই সিদ্ধান্ত?" : "Why this decision?"}</span>
            </button>
            <span className="text-[10px] font-semibold text-slate-400">
              FAO-56
            </span>
          </div>
        </div>

        {/* Card 2: Fertilizer & Care */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {isBn ? "সার ও যত্ন" : "Nutrition"}
              </span>
            </div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
              {isBn ? "পদক্ষেপ ২: সার ও স্প্রে" : "Action 2: Fertilizer"}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1 mb-2 leading-snug font-display">
              {fertilizerTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bangla">
              {fertilizerSub}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-bangla">
              {isBn ? "সুষম মাত্রা" : "Balanced Doses"}
            </span>
            <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
              BRRI / BARI
            </span>
          </div>
        </div>

        {/* Card 3: Pest & Risk */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-100 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {isBn ? "সতর্কতা" : "Field Watch"}
              </span>
            </div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
              {isBn ? "পদক্ষেপ ৩: ঝুঁকি নজরদারি" : "Action 3: Risk Watch"}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1 mb-2 leading-snug font-display">
              {riskTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bangla">
              {riskSub}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={onOpenCropDoctor}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isBn ? "ছবি তুলুন" : "AI Crop Doctor"}</span>
            </button>
            <span className="text-[10px] font-semibold text-slate-400">
              24-48h Early
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Farmer AI Summary Module */}
      <FarmerAiSummaryModule
        field={field}
        weather={weather}
        soil={soil}
        irrigation={irrigation}
        language={language}
      />
    </div>
  );
};
