import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sprout,
  ShieldAlert,
  CloudSun,
  TestTube,
  Droplets,
  Stethoscope,
  Activity,
  Mail,
  Bell,
  ArrowRight,
  Globe2,
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Language } from "../types";
import { ArticleModal } from "./ArticleModal";

interface Props {
  language: Language;
  onToggleLanguage: () => void;
  onGetStarted: (isGuest: boolean) => void;
  onOpenLogin: () => void;
}

export const PublicLandingPage: React.FC<Props> = ({
  language,
  onToggleLanguage,
  onGetStarted,
  onOpenLogin,
}) => {
  const isBn = language === "bn";
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const features = [
    {
      id: "ai_crop_doctor",
      icon: Stethoscope,
      titleEn: "AI Crop Doctor",
      titleBn: "এআই শস্য ডাক্তার",
      descEn: "Identify leaf pathogens and blight diseases instantly via real-time automated diagnostic imaging and micro-climate risk profiles.",
      descBn: "রিয়েল-টাইম অটোমেটিক ডায়াগনস্টিক ইমেজিং এবং আবহাওয়ার ঝুঁকির প্রোফাইলের মাধ্যমে পাতার রোগবালাই এবং ব্লাস্ট রোগ সনাক্ত করুন।",
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-300",
    },
    {
      id: "smart_irrigation",
      icon: Droplets,
      titleEn: "Smart Irrigation & Soil AI",
      titleBn: "স্মার্ট সেচ ও মৃত্তিকা এআই",
      descEn: "Optimize diesel/power consumption through calculated volumetric soil moisture forecasts and precision ET (Evapotranspiration) models.",
      descBn: "মাটির আর্দ্রতার পূর্বাভাস এবং প্রিসিসন ইটি (বাষ্পীভবন) মডেলের মাধ্যমে ডিজেল ও বিদ্যুৎ খরচ সাশ্রয় করুন।",
      color: "border-sky-200 bg-sky-50/50 text-sky-800 dark:border-sky-800/30 dark:bg-sky-950/20 dark:text-sky-300",
    },
    {
      id: "broadcast_engine",
      icon: Bell,
      titleEn: "Multi-Zone Broadcast Engine",
      titleBn: "মাল্টি-জোন ব্রডকাস্ট ইঞ্জিন",
      descEn: "Subscribe to specific districts and automatically receive warning updates directly on email or WhatsApp when anomalies cross safety thresholds.",
      descBn: "নির্দিষ্ট জেলা নির্বাচন করে সাবস্ক্রাইব করুন এবং সেন্সর ডেটা নির্ধারিত সীমা অতিক্রম করলেই স্বয়ংক্রিয়ভাবে ইমেইল বা হোয়াটসঅ্যাপে অ্যালার্ট পান।",
      color: "border-amber-200 bg-amber-50/50 text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/20 dark:text-amber-300",
    },
    {
      id: "digital_twin",
      icon: Activity,
      titleEn: "Crop Digital Twin",
      titleBn: "শস্য ডিজিটাল টুইন",
      descEn: "Simulate virtual cultivation cycles and test daily nitrogen, phosphate, potassium, and watering configurations risk-free.",
      descBn: "ভার্চুয়াল চাষাবাদ চক্র অনুকরণ করুন এবং ঝুঁকি ছাড়াই মাটির নাইট্রোজেন, ফসফেট, পটাশিয়াম ও সেচ বিন্যাস পরীক্ষা করুন।",
      color: "border-purple-200 bg-purple-50/50 text-purple-800 dark:border-purple-800/30 dark:bg-purple-950/20 dark:text-purple-300",
    },
    {
      id: "agro_market",
      icon: TrendingUp,
      titleEn: "Agro-Market AI Predictor",
      titleBn: "কৃষি বাজার এআই প্রেডিক্টর",
      descEn: "Examine predictive price timelines for paddy, wheat, potatoes, and major cash crops derived from historical market trends.",
      descBn: "ঐতিহাসিক বাজারের প্রবণতা থেকে প্রাপ্ত ধান, গম, আলু এবং প্রধান অর্থকরী ফসলের বাজারদরের পূর্বাভাস পরীক্ষা করুন।",
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-800 dark:border-indigo-800/30 dark:bg-indigo-950/20 dark:text-indigo-300",
    },
    {
      id: "hyperlocal_microclimate",
      icon: CloudSun,
      titleEn: "Hyper-Local Microclimate",
      titleBn: "হাইপার-লোকাল আবহাওয়া তথ্য",
      descEn: "Access real-time synoptic forecasts tailored specifically to Bangladesh's prominent agricultural divisions and seasonal cycles.",
      descBn: "বাংলাদেশের প্রধান কৃষি অঞ্চল এবং ছয় ঋতুর উপর ভিত্তি করে তৈরি করা রিয়েল-টাইম পূর্বাভাস ও তথ্য অ্যাক্সেস করুন।",
      color: "border-rose-200 bg-rose-50/50 text-rose-800 dark:border-rose-800/30 dark:bg-rose-950/20 dark:text-rose-300",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-200 selection:text-emerald-950 dark:selection:bg-emerald-800 dark:selection:text-emerald-100 transition-colors duration-200">
      
      {/* Dynamic Landing Navbar */}
      <nav className="sticky top-0 z-40 bg-white/85 dark:bg-[#0d1527]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center text-white shrink-0">
              <Sprout className="w-5.5 h-5.5 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#1B4332] dark:text-[#FAF7F2]">
                AgriVision
              </span>
              <p className="text-[9px] text-[#5C5549] dark:text-stone-400 font-mono tracking-widest uppercase font-bold">
                {isBn ? "স্মার্ট কৃষি সিদ্ধান্ত" : "Precision Decision Engine"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-extrabold text-slate-700 dark:text-stone-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isBn ? "EN" : "বাংলা"}</span>
            </button>

            {/* Log In Button */}
            <button
              onClick={onOpenLogin}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 px-3 cursor-pointer"
            >
              {isBn ? "লগইন" : "Log In"}
            </button>

            {/* Get Started CTA */}
            <button
              onClick={() => onGetStarted(false)}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#1B4332] hover:bg-[#255d45] text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md"
            >
              <span>{isBn ? "শুরু করুন" : "Get Started"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <header className="relative py-20 lg:py-28 overflow-hidden bg-radial from-emerald-50/50 via-transparent to-transparent dark:from-emerald-950/10">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold mb-6 animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{isBn ? "ডিজিটাল বাংলাদেশ কৃষি প্রযুক্তি ২০২৬" : "Digital Bangladesh Agronomic Platform 2026"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight max-w-4xl mx-auto">
            {isBn ? (
              <>
                বাংলাদেশের কৃষকদের জন্য <span className="text-[#1B4332] dark:text-emerald-400">স্মার্ট রিয়েল-টাইম</span> সমন্বিত সিদ্ধান্ত ব্যবস্থা
              </>
            ) : (
              <>
                Next-Gen Precision Agronomy for <span className="text-[#1B4332] dark:text-emerald-400">Climate Resilience</span> in Bangladesh
              </>
            )}
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isBn ? (
              "পাতা ব্লাস্ট ছত্রাক সতর্কীকরণ, অপ্টিমাইজড সেচ গণনা, স্যাটেলাইট এনডিভিআই মনিটরিং এবং স্বয়ংক্রিয় ইমেইল ও হোয়াটসঅ্যাপ পুশ অ্যালার্টের মাধ্যমে আপনার চাষাবাদকে করুন নিরাপদ ও লাভজনক।"
            ) : (
              "Guard your crop yields against blast diseases, dry-spells, and climate volatility using microclimate telemetry, real-time sensor updates, and automated WhatsApp/Email alerting."
            )}
          </p>

          {/* Dual Call-to-Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onGetStarted(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[#1B4332] hover:bg-[#255d45] text-white font-extrabold rounded-2xl text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>{isBn ? "ফ্রি ডেমো ড্যাশবোর্ডে প্রবেশ করুন" : "Enter Free Demo Dashboard"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-stone-300 font-extrabold rounded-2xl text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <span>{isBn ? "একাউন্টে লগইন / রেজিস্টার" : "Sign In / Register Account"}</span>
            </button>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-200 dark:border-slate-800/80">
            {[
              { val: "6+", labEn: "Live Districts Covered", labBn: "লাইভ জেলাসমূহ" },
              { val: "24/7", labEn: "Auto SMS/WhatsApp Alerts", labBn: "স্বয়ংক্রিয় অ্যালার্ট" },
              { val: "99.2%", labEn: "Disease Prediction Window", labBn: "রোগ বালাই পূর্বাভাস" },
              { val: "30%+", labEn: "Water & Power Saved", labBn: "সেচ ও বিদ্যুৎ সাশ্রয়" },
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                <div className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400">{m.val}</div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 mt-1">{isBn ? m.labBn : m.labEn}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Feature Overview Section (Showcase) */}
      <section className="py-20 bg-white dark:bg-[#090e18]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest bg-emerald-100/60 dark:bg-emerald-950/50 px-2.5 py-1 rounded">
              {isBn ? "ফিচার সমূহ" : "Platform Capabilities"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-4">
              {isBn ? "স্মার্ট কৃষির জন্য আমাদের সমন্বিত মডিউল" : "Precision Agronomic Features at Your Fingertips"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3">
              {isBn ? (
                "বাংলাদেশের কৃষি খাতের জলবায়ু পরিবর্তন মোকাবেলা করতে অত্যাধুনিক এআই চালিত কৃষি মডিউল।"
              ) : (
                "Empowering individual farmers and researchers with modular tools engineered for high agricultural output and low resource waste."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const IconComp = f.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedArticleId(f.id)}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg hover:border-emerald-400/50 dark:hover:border-emerald-600/50 transition duration-200 group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${f.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-stone-100 mt-5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                      {isBn ? f.titleBn : f.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                      {isBn ? f.descBn : f.descEn}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticleId(f.id);
                    }}
                    className="mt-5 pt-3 border-t border-slate-200/40 dark:border-slate-800/20 text-[11px] sm:text-xs font-bold text-[#1B4332] dark:text-emerald-400 flex items-center justify-between w-full hover:text-emerald-600 transition cursor-pointer"
                  >
                    <span>{isBn ? "বিস্তারিত জানুন (গবেষণা ও ব্যবহারিক গাইড)" : "Read In-Depth Article"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple Step-by-Step UI Showcase (Progressive Disclosure) */}
      <section className="py-20 bg-slate-50 dark:bg-[#070b12] border-t border-slate-200 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] font-mono font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest bg-emerald-100/60 dark:bg-emerald-950/50 px-2.5 py-1 rounded">
                {isBn ? "সহজ ব্যবহার পদ্ধতি" : "How It Works"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-4">
                {isBn ? "৩টি ধাপে স্মার্ট সতর্কবার্তা সাবস্ক্রিপশন" : "Secure Hourly Dispatches in 3 Simple Steps"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                {isBn ? (
                  "কোনো রকম জটিলতা ছাড়াই সহজেই আপনার নিজের চাষাবাদকৃত জমির লোকেশন সাবস্ক্রাইব করুন এবং কাস্টম হোয়াটসঅ্যাপ এলার্ট এক্টিভেট করুন।"
                ) : (
                  "We have streamlined onboarding so you can protect your yields directly with minimum friction."
                )}
              </p>

              {/* Sequential Steps */}
              <div className="mt-8 space-y-6">
                {[
                  {
                    step: "01",
                    titleEn: "Create Free Account or Demo Session",
                    titleBn: "ডেমো সেশন বা নতুন অ্যাকাউন্ট খুলুন",
                    descEn: "Log in or immediately step into the precision agriculture workspace instantly with one click.",
                    descBn: "নিরাপদে ইমেইল দিয়ে একাউন্ট তৈরি করুন অথবা সরাসরি এক ক্লিকে ফ্রি ডেমো ড্যাশবোর্ডে প্রবেশ করুন।"
                  },
                  {
                    step: "02",
                    titleEn: "Configure Districts & Alarm Preferences",
                    titleBn: "জেলা ও সতর্কবার্তার ধরন নির্বাচন করুন",
                    descEn: "Check multiple districts of interest and enable drought, heatwave, or pathogen alerts.",
                    descBn: "আপনার পছন্দের জেলা নির্বাচন করুন এবং পাতা ব্লাস্ট রোগ, তাপদাহ বা খরা সংক্রান্ত পছন্দ সিলেক্ট করে সংরক্ষণ করুন।"
                  },
                  {
                    step: "03",
                    titleEn: "Receive Hourly SMS & WhatsApp Alerts",
                    titleBn: "ঘণ্টাভিত্তিক স্বয়ংক্রিয় অ্যালার্ট পান",
                    descEn: "AgriVision background engine scans the climatic conditions hourly and sends live updates.",
                    descBn: "ব্যাকগ্রাউন্ড ইঞ্জিন সার্বক্ষণিক জলবায়ু পর্যবেক্ষণ করবে এবং আপনার ফোন ও ইমেইলে নোটিফিকেশন পাঠাবে।"
                  }
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 dark:bg-emerald-500 text-white font-mono text-xs font-black flex items-center justify-center shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-stone-100">
                        {isBn ? s.titleBn : s.titleEn}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {isBn ? s.descBn : s.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Screen Mock */}
            <div className="relative p-4 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-slate-400 ml-3">agrivision.bangladesh/dashboard</span>
              </div>
              <div className="pt-8 px-2 pb-2">
                <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-800/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] uppercase font-mono bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                      SMS/WhatsApp Live Sandbox
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">2026-09-19</span>
                  </div>
                  <div className="text-xs text-[#1B4332] dark:text-emerald-400 font-extrabold mb-1">
                    🌾 AgriVision Auto-Alert Active: Dinajpur District
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    "বাতাসের আর্দ্রতা ৮৮% ছাড়িয়ে গেছে। পাতা ব্লাস্ট ছত্রাক আক্রমণ প্রতিরোধের জন্য আগামী ৩৬ ঘণ্টার মধ্যে ট্রুপার/নাティブো স্প্রে করুন।"
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded">Critical Risk</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[9px] font-bold rounded">Auto-Dispatched</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C3026] text-stone-300 py-12 border-t border-[#2B4537]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white">
                AgriVision Bangladesh
              </span>
              <p className="text-[9px] text-emerald-300/80 font-mono">
                Precision Command Console
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-400 text-center md:text-right">
            <p>© 2026 AgriVision precision advisory. All live climate fields synced.</p>
          </div>
        </div>
      </footer>

      {/* Full Article Modal */}
      <ArticleModal
        articleId={selectedArticleId}
        isOpen={!!selectedArticleId}
        onClose={() => setSelectedArticleId(null)}
        isBn={isBn}
        onEnterAppFeature={() => {
          setSelectedArticleId(null);
          onGetStarted(true);
        }}
      />
    </div>
  );
};
