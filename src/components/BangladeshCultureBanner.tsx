import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Volume2,
  ChevronRight,
  Sun,
  CloudRain,
  Wind,
  Flower2,
  Flame,
  Snowflake,
  Info,
  X,
  Layers,
  Heart,
  BookOpen,
} from "lucide-react";
import { Language } from "../types";

interface Props {
  language: Language;
}

interface BengaliSeason {
  id: string;
  nameBn: string;
  nameEn: string;
  monthsBn: string;
  monthsEn: string;
  icon: React.ReactNode;
  themeColor: string;
  bgGradient: string;
  culturalNoteBn: string;
  culturalNoteEn: string;
  agriActionBn: string;
  agriActionEn: string;
}

const SEASONS: BengaliSeason[] = [
  {
    id: "grishma",
    nameBn: "গ্রীষ্মকাল",
    nameEn: "Summer (Grishma)",
    monthsBn: "বৈশাখ – জ্যৈষ্ঠ",
    monthsEn: "Mid April – Mid June",
    icon: <Flame className="w-4 h-4 text-amber-500" />,
    themeColor: "from-amber-500/20 to-orange-500/20 text-amber-900 dark:text-amber-300",
    bgGradient: "border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20",
    culturalNoteBn: "পহেলা বৈশাখ, আম-কাঁঠালের মিষ্টি সৌরভ ও বৈশাখী ঝড়।",
    culturalNoteEn: "Bengali New Year (Pahela Baishakh), sweet mangoes, and sudden Nor'wester rains.",
    agriActionBn: "আউশ ধান বপন ও খরা সহনশীল ফসলের নিবিড় সেচ ব্যবস্থাপনা।",
    agriActionEn: "Aus rice sowing and micro-irrigation management against intense evapotranspiration.",
  },
  {
    id: "borsha",
    nameBn: "বর্ষাকাল",
    nameEn: "Monsoon (Borsha)",
    monthsBn: "আষাঢ় – শ্রাবণ",
    monthsEn: "Mid June – Mid August",
    icon: <CloudRain className="w-4 h-4 text-sky-500" />,
    themeColor: "from-sky-500/20 to-blue-500/20 text-sky-900 dark:text-sky-300",
    bgGradient: "border-sky-200 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/20",
    culturalNoteBn: "কদম ফুল, নদীমাতৃক রূপ, বৃষ্টিভেজা সবুজ মাঠ ও ইলিশ মাছ।",
    culturalNoteEn: "Blooming Kadam flowers, brimming deltaic rivers, and lush green monsoon landscapes.",
    agriActionBn: "রোপা আমন ধানের চারা রোপণ ও অতিরিক্ত পানি নিষ্কাশন ব্যবস্থা।",
    agriActionEn: "Transplanting Ropa Aman paddy and flood drainage bund management.",
  },
  {
    id: "sharat",
    nameBn: "শরৎকাল",
    nameEn: "Autumn (Sharat)",
    monthsBn: "ভাদ্র – আশ্বিন",
    monthsEn: "Mid August – Mid October",
    icon: <Wind className="w-4 h-4 text-teal-500" />,
    themeColor: "from-teal-500/20 to-emerald-500/20 text-teal-900 dark:text-teal-300",
    bgGradient: "border-teal-200 dark:border-teal-800/60 bg-teal-50/50 dark:bg-teal-950/20",
    culturalNoteBn: "নদীর তীরে সাদা কাশফুল, নীল আকাশে পেঁজা তুলোর মতো মেঘ ও শিউলি ফুল।",
    culturalNoteEn: "Silvery Kashful swaying along river banks, clear azure skies, and fragrant Shiuli blossoms.",
    agriActionBn: "আমন ধানের কুশি পর্যায় পর্যবেক্ষণ, আগাছা দমন ও মাজরা পোকা প্রতিরোধ।",
    agriActionEn: "Monitoring Aman tillering vigor, light weeding, and stem borer scouting.",
  },
  {
    id: "hemanta",
    nameBn: "হেমন্তকাল",
    nameEn: "Late Autumn (Hemanta)",
    monthsBn: "কার্তিক – অগ্রহায়ণ",
    monthsEn: "Mid October – Mid December",
    icon: <Sparkles className="w-4 h-4 text-amber-600" />,
    themeColor: "from-amber-600/20 to-yellow-500/20 text-amber-950 dark:text-amber-200",
    bgGradient: "border-amber-300 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/30",
    culturalNoteBn: "নতুন ধানের ঘ্রাণ, পিঠাপুলির উৎসব ও গ্রামবাংলার ঐতিহ্যবাহী 'নবান্ন উৎসব'।",
    culturalNoteEn: "Golden paddy harvest, traditional Pitha rice cakes, and the joyous Nabanna harvest festival.",
    agriActionBn: "সোনালী আমন ধান কর্তন, মাড়াই ও বোরো ধানের বীজতলা প্রস্তুতকরণ।",
    agriActionEn: "Harvesting ripe golden Aman rice, threshing, and preparing Boro nurseries.",
  },
  {
    id: "sheet",
    nameBn: "শীতকাল",
    nameEn: "Winter (Sheet)",
    monthsBn: "পৌষ – মাঘ",
    monthsEn: "Mid December – Mid February",
    icon: <Snowflake className="w-4 h-4 text-indigo-500" />,
    themeColor: "from-indigo-500/20 to-blue-500/20 text-indigo-900 dark:text-indigo-300",
    bgGradient: "border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/20",
    culturalNoteBn: "সকালের কুয়াশা, খেজুরের মিষ্টি রস, খাঁটি গুড় ও সরিষা ফুলের হলুদ গালিচা।",
    culturalNoteEn: "Gentle morning mist, fresh date-palm sap (Khejur Rosh), and yellow mustard flower carpets.",
    agriActionBn: "বোরো ধানের চারা রোপণ, রবি শস্য ও সবজির সান্ধ্যকালীন ছত্রাক সুরক্ষা।",
    agriActionEn: "Boro rice seedling transplantation and prophylactic late blight care for winter Rabi crops.",
  },
  {
    id: "basanta",
    nameBn: "বসন্তকাল",
    nameEn: "Spring (Basanta)",
    monthsBn: "ফাল্গুন – চৈত্র",
    monthsEn: "Mid February – Mid April",
    icon: <Flower2 className="w-4 h-4 text-rose-500" />,
    themeColor: "from-rose-500/20 to-emerald-500/20 text-rose-900 dark:text-rose-300",
    bgGradient: "border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20",
    culturalNoteBn: "আমের মুকুল, কোকিলের কুহুতান, পলাশ-শিমুল ফুলের রক্তিম সাজ।",
    culturalNoteEn: "Fragrant mango blossoms, singing cuckoos, and fiery Palash & Shimul blooms.",
    agriActionBn: "বোরো ধানের থোড় পর্যায়, পটাশ প্রয়োগ ও দানা পুষ্টিকরণে সেচ নিশ্চিতকরণ।",
    agriActionEn: "Panicle initiation in Boro paddy, MOP booster, and boot-stage irrigation maintenance.",
  },
];

interface KhonarBochon {
  rhymeBn: string;
  meaningBn: string;
  rhymeEn: string;
  scienceEn: string;
}

const KHONAR_BOCHON_LIST: KhonarBochon[] = [
  {
    rhymeBn: "যদি বর্ষে মাঘের শেষ, ধন্যি রাজার পুণ্যি দেশ।",
    meaningBn: "মাঘের শেষে বৃষ্টিপাত হলে বোরো ধানের শিকড় মজবুত হয় ও রবি ফসলের বাম্পার ফলন হয়।",
    rhymeEn: "If it rains at the end of Magh, blessed is the land with bumper grain.",
    scienceEn: "Late winter showers recharge soil profile moisture right before early tillering, saving critical pump energy.",
  },
  {
    rhymeBn: "খনা বলে শোনরে চাষী, আউশ ধানে শনির বাও — বাড়ে ধান দিনে ছাও।",
    meaningBn: "আউশ ধানের বৃদ্ধির সময় অনুকূল দখিনা বাতাসের আর্দ্রতা ধানের কুশির সংখ্যা বাড়ায়।",
    rhymeEn: "Listen farmer, gentle wind on Aus paddy accelerates healthy tillering day by day.",
    scienceEn: "Optimum canopy wind speed prevents stagnant boundary humidity while stimulating carbon assimilation.",
  },
  {
    rhymeBn: "কলা রুয়ে না কেটো পাত, তাতেই কাপড় তাতেই ভাত।",
    meaningBn: "কলা গাছ রোপণের পর পাতা অক্ষত রাখলে পর্যাপ্ত সালোকসংশ্লেষণ ঘটে এবং বাম্পার লাভ নিশ্চিত হয়।",
    rhymeEn: "Plant the plantain and spare its leaves; bounty and fortune follow in its shade.",
    scienceEn: "Maintaining full banana Leaf Area Index (LAI) maximises radiation interception efficiency and reduces weed canopy.",
  },
  {
    rhymeBn: "ষোল চাষে মূলা, তার অর্ধেক তুলা — তার অর্ধেক ধান, বিনা চাষে পান।",
    meaningBn: "মূলার জন্য গভীর কর্ষণ, তুলার জন্য মাঝারি, ধানের জন্য কাদাময় চাষ ও পানের জন্য নো-টিলেজ উত্তম।",
    rhymeEn: "Sixteen tillages for radish, half for cotton, half for rice, none for betel vine.",
    scienceEn: "Reflects scientific root penetrative depth requirements: taproots require loose soil, while rice prefers puddled hardpan.",
  },
];

export const BangladeshCultureBanner: React.FC<Props> = ({ language }) => {
  const isBn = language === "bn";
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number>(3); // Hemanta / Nabanna default
  const [activeKhonaIdx, setActiveKhonaIdx] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showHeritageModal, setShowHeritageModal] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem("agri_culture_banner_dismissed") === "true";
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("agri_culture_banner_dismissed", "true");
  };

  if (isDismissed) {
    return null;
  }

  // Determine season according to Gregorian date (Bangladesh approximate alignment)
  useEffect(() => {
    const month = new Date().getMonth(); // 0 = Jan
    // Jan-Feb = Sheet (4), Mar-Apr = Basanta (5), May-Jun = Grishma (0), Jul-Aug = Borsha (1), Sep-Oct = Sharat (2), Nov-Dec = Hemanta (3)
    if (month === 0 || month === 1) setSelectedSeasonIdx(4);
    else if (month === 2 || month === 3) setSelectedSeasonIdx(5);
    else if (month === 4 || month === 5) setSelectedSeasonIdx(0);
    else if (month === 6 || month === 7) setSelectedSeasonIdx(1);
    else if (month === 8 || month === 9) setSelectedSeasonIdx(2);
    else setSelectedSeasonIdx(3);
  }, []);

  // Cycle through Khonar Bochon
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveKhonaIdx((prev) => (prev + 1) % KHONAR_BOCHON_LIST.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const season = SEASONS[selectedSeasonIdx];
  const bochon = KHONAR_BOCHON_LIST[activeKhonaIdx];

  const handlePlayBochonAudio = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const textToSpeak = isBn
      ? `${bochon.rhymeBn}. এর ভাবার্থ: ${bochon.meaningBn}`
      : `${bochon.rhymeEn}. Agronomic science: ${bochon.scienceEn}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isBn ? "bn-BD" : "en-US";
    utterance.rate = 0.92;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E8E0D5] dark:border-[#22382D] bg-[#FFFDFB] dark:bg-[#14221B] shadow-sm transition-all">
      {/* Decorative Traditional Border Trim */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-800 via-amber-500 to-rose-700" />

      <div className="p-5 sm:p-7">
        {/* Top Header: Cultural Salutation & Resilient Farmers Tribute */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFE8DF] dark:border-[#1E3328] pb-5">
          <div className="flex items-center gap-3.5">
            {/* Animated Golden Rice Sheaf / ধানের শীষ */}
            <div className="w-13 h-13 rounded-2xl bg-[#F4EFE6] dark:bg-[#1B2D24] border border-[#E2D8C9] dark:border-[#284235] flex items-center justify-center text-3xl shadow-inner shrink-0 relative group">
              <span className="animate-paddy-sway inline-block select-none" title="সোনার ধানের শীষ / Golden Rice Sheaf">
                🌾
              </span>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-[#1B4332] dark:text-[#A7F3D0]">
                  {isBn ? "শস্য-শ্যামলা সোনার বাংলা — কৃষকের প্রতি শ্রদ্ধা" : "Heartbeat of Bengal: Honoring Our Resilient Farmers"}
                </h2>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {isBn ? "ঐতিহ্য ও বিজ্ঞান" : "Tradition & Science"}
                </span>
              </div>
              <p className="text-xs text-[#5C5549] dark:text-stone-300 font-bangla mt-0.5">
                {isBn
                  ? "পলি মাটির উর্বরতা, নদীমাতৃক প্রকৃতি এবং শতাব্দীর গ্রামীণ প্রজ্ঞার সাথে আধুনিক এআই ও উপগ্রহ প্রযুক্তির মেলবন্ধন।"
                  : "Bridging deltaic fertile silt, centuries of folk agricultural wisdom, and cutting-edge satellite AI sensors."}
              </p>
            </div>
          </div>

          {/* Quick Cultural Heritage Modal Button & Close Banner Button */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setShowHeritageModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] border border-[#DDD3C4] dark:border-[#2B4537] text-xs font-semibold text-[#4A4031] dark:text-stone-200 transition shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{isBn ? "কৃষি ঐতিহ্য দর্শন" : "Explore Heritage"}</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-2 rounded-xl bg-slate-200/60 hover:bg-red-100 hover:text-red-700 dark:bg-slate-800 dark:hover:bg-red-950 dark:hover:text-red-300 text-slate-600 dark:text-slate-400 transition cursor-pointer"
              title={isBn ? "ব্যানারটি বন্ধ করুন" : "Dismiss Banner"}
              aria-label="Dismiss Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle Dual Grid: Six Seasons (ষড়ঋতু) & Khonar Bochon (খনার বচন) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5">
          {/* Left 7 Columns: Six Seasons (ষড়ঋতু) of Bangladesh */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D352A] dark:text-stone-300 font-bangla">
                  {isBn ? "বাংলার ষড়ঋতু চক্র ও ফসলি বর্ষপঞ্জি" : "The 6 Agro-Ecological Seasons of Bengal (Shoro Ritu)"}
                </h3>
              </div>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                {isBn ? `সক্রিয়: ${season.nameBn}` : `Active: ${season.nameEn}`}
              </span>
            </div>

            {/* Season Pill Selectors */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {SEASONS.map((s, idx) => {
                const isSelected = selectedSeasonIdx === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeasonIdx(idx)}
                    className={`p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[58px] ${
                      isSelected
                        ? "bg-[#FAF7F2] dark:bg-[#1E3328] border-amber-600 dark:border-amber-400 ring-1 ring-amber-500 shadow-xs"
                        : "bg-[#FDFBF7] dark:bg-[#16251E] border-[#E8E0D5] dark:border-[#22382D] hover:border-amber-400 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{s.icon}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? "text-[#1B4332] dark:text-[#A7F3D0]" : "text-[#4A4031] dark:text-stone-300"}`}>
                        {isBn ? s.nameBn : s.nameEn.split(" ")[0]}
                      </div>
                      <div className="text-[9px] text-[#786E5E] dark:text-stone-400 leading-none mt-0.5">
                        {isBn ? s.monthsBn.split(" ")[0] : s.monthsEn.split(" ")[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Season Highlight Card */}
            <motion.div
              key={season.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border ${season.bgGradient} space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/80 dark:bg-black/30 shadow-2xs">
                    {season.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">
                      {isBn ? `${season.nameBn} (${season.monthsBn})` : `${season.nameEn} — ${season.monthsEn}`}
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {isBn ? "কৃষি পরামর্শ" : "Agronomic Focus"}
                </span>
              </div>

              <p className="text-xs text-[#4A4235] dark:text-stone-300 leading-relaxed font-bangla">
                <strong>{isBn ? "সাংস্কৃতিক রূপ:" : "Cultural Life:"}</strong> {isBn ? season.culturalNoteBn : season.culturalNoteEn}
              </p>
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-black/40 border border-emerald-600/20 text-xs text-[#1B4332] dark:text-[#A7F3D0] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{isBn ? "ফসলি দিকনির্দেশনা:" : "Advisory:"}</strong> {isBn ? season.agriActionBn : season.agriActionEn}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right 5 Columns: Khonar Bochon (খনার বচন) Folk Agronomic Wisdom */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3 bg-[#FAF7F2] dark:bg-[#16251E] p-4 sm:p-5 rounded-2xl border border-[#E8E0D5] dark:border-[#22382D]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base select-none">📜</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D352A] dark:text-stone-300 font-bangla">
                  {isBn ? "খনার বচন ও চিরায়ত কৃষি প্রজ্ঞা" : "Khonar Bochon (Folk Agronomic Wisdom)"}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePlayBochonAudio}
                  disabled={isPlayingAudio}
                  title="Listen to this proverb with Bengali voice"
                  className={`p-1.5 rounded-lg border border-[#DDD3C4] dark:border-[#2B4537] bg-white dark:bg-[#1C3026] text-[#4A4031] dark:text-stone-200 hover:text-emerald-700 transition cursor-pointer ${
                    isPlayingAudio ? "animate-pulse text-emerald-600" : ""
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveKhonaIdx((prev) => (prev + 1) % KHONAR_BOCHON_LIST.length)}
                  className="px-2 py-1 rounded-lg border border-[#DDD3C4] dark:border-[#2B4537] bg-white dark:bg-[#1C3026] text-[11px] font-semibold text-[#4A4031] dark:text-stone-200 hover:text-amber-700 transition cursor-pointer flex items-center gap-1"
                >
                  <span>{isBn ? "পরবর্তী" : "Next"}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeKhonaIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-2.5 my-auto"
              >
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#132019] border-l-4 border-l-amber-600 border border-[#EAE2D7] dark:border-[#20362B] shadow-2xs">
                  <div className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200 font-display tracking-wide">
                    &ldquo;{isBn ? bochon.rhymeBn : bochon.rhymeEn}&rdquo;
                  </div>
                  <p className="text-xs text-[#5C5346] dark:text-stone-300 font-bangla mt-1.5 leading-relaxed">
                    {isBn ? bochon.meaningBn : bochon.scienceEn}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F3ECE0] dark:bg-[#1A2C22] text-[11px] text-[#4A4031] dark:text-stone-300 flex items-start gap-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">🔬 {isBn ? "বিজ্ঞান ব্যাখ্যা:" : "Science Note:"}</span>
                  <span className="leading-snug">{isBn ? bochon.scienceEn : bochon.meaningBn}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Cultural Footnote & Krishi Call Centre */}
            <div className="flex items-center justify-between text-[11px] text-[#786E5E] dark:text-stone-400 border-t border-[#EAE2D7] dark:border-[#20362B] pt-2">
              <span className="flex items-center gap-1 font-mono">
                📞 {isBn ? "কৃষি কল সেন্টার:" : "Krishi Hotline:"} <strong className="text-emerald-700 dark:text-emerald-400">16123</strong>
              </span>
              <span className="italic font-bangla">
                {isBn ? "মাটি ও মানুষের বাংলাদেশ" : "Soil, Rivers & Resilient People"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cultural Heritage & Traditional Agrarian Modal */}
      <AnimatePresence>
        {showHeritageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-[#FFFDFB] dark:bg-[#14221B] rounded-3xl shadow-2xl border border-[#E8E0D5] dark:border-[#22382D] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Banner */}
              <div className="px-6 py-5 bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#C86D51] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌾</span>
                  <div>
                    <h3 className="text-lg font-bold font-display">
                      {isBn ? "বাংলার হাজার বছরের কৃষি সংস্কৃতি ও ঐতিহ্য" : "Millennia of Bengal's Agrarian Culture & Heritage"}
                    </h3>
                    <p className="text-xs text-emerald-100 font-bangla">
                      {isBn ? "আমাদের খাদ্যনিরাপত্তার পেছনের মূল শক্তি আমাদের কৃষক" : "Honoring the hands that nourish 170 million lives"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHeritageModal(false)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#4A4235] dark:text-stone-300 leading-relaxed font-bangla">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1B2D24] border border-[#E8E0D5] dark:border-[#253E31] space-y-2">
                  <h4 className="text-sm font-bold text-[#1B4332] dark:text-[#A7F3D0] flex items-center gap-2">
                    <span>🌱</span>
                    <span>{isBn ? "১. নদীমাতৃক পলি মাটি ও ফসলের উর্বরতা" : "1. Deltaic River Silt & Natural Soil Fertility"}</span>
                  </h4>
                  <p>
                    {isBn
                      ? "পদ্মা, মেঘনা, যমুনা ও ব্রহ্মপুত্র নদীবাহিত পলল মাটির অসাধারণ উর্বরতার কারণে বাংলাদেশ চিরকালই বিশ্বের অন্যতম শস্যসমৃদ্ধ অঞ্চল হিসেবে খ্যাত। এই মাটির জলধারণ ক্ষমতা ও জৈব পদার্থের ভারসাম্য রক্ষা করাই আধুনিক এগ্রিভিশন প্রিসিশন এগ্রিকালচারের অন্যতম ভিত্তি।"
                      : "The floodplains of the Padma, Meghna, Jamuna, and Brahmaputra rivers deposit nutrient-dense organic silt every monsoon, making Bengal's soil uniquely fertile. Preserving this rhizosphere health is a cornerstone of AGRI-VISION."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1B2D24] border border-[#E8E0D5] dark:border-[#253E31] space-y-2">
                  <h4 className="text-sm font-bold text-[#1B4332] dark:text-[#A7F3D0] flex items-center gap-2">
                    <span>🌾</span>
                    <span>{isBn ? "২. সোনালী ধান ও নবান্নের লোকোৎসব" : "2. Golden Paddy & The Joy of Nabanna"}</span>
                  </h4>
                  <p>
                    {isBn
                      ? "হেমন্তকালে মাঠভরা সোনালী আমন ধান কেটে ঘরে তোলার আনন্দকে ঘিরে পালিত হয় আবহমান বাংলার 'নবান্ন উৎসব'। ঢেঁকিতে নতুন চালের গুঁড়া আর খেজুরের গুড় দিয়ে তৈরি পিঠাপুলি বাংলার গ্রামীণ সংস্কৃতির সবচেয়ে মধুর ঐতিহ্য।"
                      : "The harvest of Aman rice marks Nabanna, a celebratory festival where new rice is ground into flour for sweet traditional Pitha and Khejur Rosh. It embodies the deep gratitude for the harvest and the bond between neighbors."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1B2D24] border border-[#E8E0D5] dark:border-[#253E31] space-y-2">
                  <h4 className="text-sm font-bold text-[#1B4332] dark:text-[#A7F3D0] flex items-center gap-2">
                    <span>📜</span>
                    <span>{isBn ? "৩. খনার বচন: আবহাওয়া বিজ্ঞানের প্রাচীন দিশারী" : "3. Khonar Bochon: Timeless Meteorological Foresight"}</span>
                  </h4>
                  <p>
                    {isBn
                      ? "প্রাচীন জ্যোতিষী ও কৃষিবিদ খনার ছন্দবদ্ধ বচনগুলো মূলত শতাব্দীর পর শতাব্দী ধরে কৃষকদের অভিজ্ঞতা ও পর্যবেক্ষণলব্ধ আবহাওয়া ও ফসল বিজ্ঞানের নির্যাস। আধুনিক স্যাটেলাইট ডাটা ও স্যাঁতসেঁতে সূচক পর্যালোচনা করলে দেখা যায় খনার প্রতিটি বচনের পেছনে রয়েছে নিখুঁত বৈজ্ঞানিক সত্য।"
                      : "The rhythmic couplets of legendary astrologer Khona encapsulated centuries of empirical weather observation. Modern agronomic sensors consistently validate the ecological insight embedded in these folk verses."}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-[#78350F] dark:text-amber-200 text-xs">
                  <strong>{isBn ? "আমাদের অঙ্গীকার:" : "Our Commitment:"}</strong>{" "}
                  {isBn
                    ? "এগ্রিভিশন কোনো জটিল বিদেশী সফটওয়্যার নয়; এটি বাংলাদেশের মাটি, আবহাওয়া ও কৃষকের ঘামের মূল্যকে সম্মান জানিয়ে গড়ে তোলা একটি নিখুঁত ডিজিটাল সমাধান।"
                    : "AGRI-VISION is dedicated to Bangladesh's climate resilience — marrying grassroots farmer pride with satellite, AI, and FAO-56 accuracy."}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#FAF7F2] dark:bg-[#1B2D24] border-t border-[#E8E0D5] dark:border-[#22382D] flex items-center justify-end">
                <button
                  onClick={() => setShowHeritageModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {isBn ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
