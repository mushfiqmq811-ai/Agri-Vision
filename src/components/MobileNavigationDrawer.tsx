import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sprout,
  LayoutDashboard,
  CloudSun,
  TestTube,
  Droplets,
  Stethoscope,
  Satellite,
  AlertTriangle,
  Sliders,
  Leaf,
  Bell,
  Sparkles,
  Mail,
  Globe2,
  Palette,
  Layers,
  Map,
  TrendingUp,
  Coins,
  QrCode,
  Tractor,
  Activity,
  User,
  LogOut,
  ChevronRight,
  Shield,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { AppMode, Language, GeoField } from "../types";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGoBack?: () => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  fields: GeoField[];
  selectedField: GeoField;
  setSelectedField: (field: GeoField) => void;
  alertsCount: number;
  onOpenAlerts: () => void;
  onOpenAiSummary?: () => void;
  onOpenEmailDesk?: () => void;
  onOpenThemeModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const MobileNavigationDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onGoBack,
  mode,
  setMode,
  language,
  setLanguage,
  fields,
  selectedField,
  setSelectedField,
  alertsCount,
  onOpenAlerts,
  onOpenAiSummary,
  onOpenEmailDesk,
  onOpenThemeModal,
  onOpenAuthModal,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isBn = language === "bn";

  const handleTabSelect = (rawTabId: string) => {
    let targetId = rawTabId;
    if (rawTabId === "ndvi") targetId = "satellite";
    if (rawTabId === "gis_map") targetId = "map";
    if (rawTabId === "soil_intel") targetId = "soil";
    if (rawTabId === "risk_timeline") targetId = "risks";
    if (rawTabId === "yield_predictor") targetId = "scenario";
    setMode("standard");
    setActiveTab(targetId);
    onClose();
  };

  const categories = [
    {
      titleEn: "Core Decisions",
      titleBn: "প্রধান পোর্টাল",
      items: [
        { id: "dashboard", labelEn: "Executive Dashboard", labelBn: "প্রধান ড্যাশবোর্ড", icon: LayoutDashboard },
        { id: "soil", labelEn: "Microclimate & Sensors", labelBn: "মাইক্রোক্লাইমেট ও সেন্সর", icon: CloudSun },
        { id: "crop_doctor", labelEn: "AI Crop Doctor", labelBn: "এআই শস্য ডাক্তার", icon: Stethoscope, badge: "AI" },
        { id: "cropDigitalTwin", labelEn: "Digital Twin Twin", labelBn: "ডিজিটাল টুইন", icon: Activity, badge: "3D" },
      ],
    },
    {
      titleEn: "GIS & Weather",
      titleBn: "জিআইএস ও আবহাওয়া",
      items: [
        { id: "map", labelEn: "GIS Parcel Mapping", labelBn: "জিআইএস ম্যাপ পোর্টাল", icon: Map },
        { id: "weather", labelEn: "Synoptic Weather", labelBn: "সিনপটিক আবহাওয়া পূর্বাভাস", icon: CloudSun },
        { id: "satellite", labelEn: "Satellite NDVI Vegetation", labelBn: "স্যাটেলাইট এনডিভিআই", icon: Satellite },
      ],
    },
    {
      titleEn: "Irrigation & Soil Health",
      titleBn: "সেচ ও মাটির স্বাস্থ্য",
      items: [
        { id: "irrigation", labelEn: "Smart Irrigation Deficit", labelBn: "স্মার্ট সেচ ব্যবস্থাপনা", icon: Droplets },
        { id: "soil", labelEn: "ISRIC Soil Intelligence", labelBn: "মাটির পুষ্টি উপাদান", icon: TestTube },
      ],
    },
    {
      titleEn: "Risk & Yield Intelligence",
      titleBn: "ঝুঁকি ও ফলন পূর্বাভাস",
      items: [
        { id: "risks", labelEn: "Multi-Hazard Timeline", labelBn: "মাল্টি-হ্যাজার্ড রিক্স টাইমলাইন", icon: AlertTriangle },
        { id: "scenario", labelEn: "Crop Yield & What-If", labelBn: "ফলন পূর্বাভাস ও সিমুলেটর", icon: TrendingUp },
      ],
    },
    {
      titleEn: "Market & Finance",
      titleBn: "বাজার ও ঋণসেবা",
      items: [
        { id: "market", labelEn: "DAM Market Intelligence", labelBn: "বাজার দর ও চাহিদা পূর্বাভাস", icon: Coins },
        { id: "seed_credit", labelEn: "Seed & Credit Ledger", labelBn: "বীজ ও ডিজিটাল ক্রেডিট লেজার", icon: Shield },
        { id: "qr_trace", labelEn: "Harvest QR Traceability", labelBn: "কিউআর ট্রেসেবিলিটি পাসপোর্ট", icon: QrCode },
        { id: "equipment_hub", labelEn: "Farm Equipment Hub", labelBn: "যন্ত্রপাতি শেয়ারিং হাব", icon: Tractor },
      ],
    },
    {
      titleEn: "Research & Sustainability",
      titleBn: "গবেষণা ও পরিবেশ",
      items: [
        { id: "scenario", labelEn: "What-If Simulator", labelBn: "শস্য সিমুলেটর", icon: Sliders },
        { id: "sustainability", labelEn: "Sustainability ESG Score", labelBn: "টেকসই পরিবেশ স্কোর", icon: Leaf },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs lg:hidden cursor-pointer"
          />

          {/* Slide-Out Drawer Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl lg:hidden font-sans select-none overflow-hidden"
          >
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center text-white shadow-xs">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-display leading-tight">
                    AgriVision <span className="text-emerald-600 dark:text-emerald-400">DSS</span>
                  </h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bangla">
                    {isBn ? "স্মার্ট এগ্রিকালচার প্ল্যাটফর্ম" : "Precision Agriculture Portal"}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                title={isBn ? "বন্ধ করুন" : "Close Drawer"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Back Navigation Bar if not on main dashboard */}
            {activeTab !== "dashboard" && (
              <div className="px-4 py-2.5 bg-emerald-50/90 dark:bg-emerald-950/60 border-b border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (onGoBack) onGoBack();
                    else handleTabSelect("dashboard");
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer font-bangla"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-300" />
                  <span>{isBn ? "পূর্বের পেজে ফিরে যান (Back)" : "Return to Previous Page"}</span>
                </button>
              </div>
            )}

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
              {/* User Account / Login Bar */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                        {user.name}
                      </div>
                      <span className="text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuthModal?.();
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>{isBn ? "লগইন করুন / সাইন ইন" : "Sign In to Account"}</span>
                  </button>
                )}

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-200 transition cursor-pointer"
                    title={isBn ? "লগ আউট" : "Log Out"}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Active Field Parcel Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 block px-1">
                  {isBn ? "সক্রিয় কৃষি জমি" : "Active Field Parcel"}
                </label>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <select
                    value={selectedField.id}
                    onChange={(e) => {
                      const found = fields.find((f) => f.id === e.target.value);
                      if (found) setSelectedField(found);
                    }}
                    className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer text-xs w-full"
                  >
                    {fields.map((f) => (
                      <option key={f.id} value={f.id} className="dark:bg-[#0F172A] dark:text-slate-100">
                        {isBn ? f.nameBn : f.name} ({f.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode Switcher Pills */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 block px-1">
                  {isBn ? "ব্যবহারকারী ভিউ মোড" : "User View Mode"}
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setMode("standard");
                      onClose();
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                      mode === "standard"
                        ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {isBn ? "প্রধান" : "Standard"}
                  </button>
                  <button
                    onClick={() => {
                      setMode("farmer");
                      onClose();
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                      mode === "farmer"
                        ? "bg-[#1B4332] text-white shadow-xs"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {isBn ? "কৃষক" : "Farmer"}
                  </button>
                  <button
                    onClick={() => {
                      setMode("researcher");
                      onClose();
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition text-center cursor-pointer ${
                      mode === "researcher"
                        ? "bg-[#1C3026] text-white shadow-xs"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {isBn ? "গবেষক" : "Research"}
                  </button>
                </div>
              </div>

              {/* Categorized Module Navigation Links */}
              <div className="space-y-4 pt-1">
                {categories.map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 block px-1 mb-1 font-display">
                      {isBn ? cat.titleBn : cat.titleEn}
                    </span>
                    <div className="space-y-0.5">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = mode === "standard" && activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleTabSelect(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                              isActive
                                ? "bg-[#1B4332] text-white shadow-xs font-bold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                className={`w-4 h-4 shrink-0 ${
                                  isActive ? "text-emerald-300" : "text-slate-400 dark:text-slate-500"
                                }`}
                              />
                              <span className="truncate">{isBn ? item.labelBn : item.labelEn}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight
                                className={`w-3.5 h-3.5 ${
                                  isActive ? "text-white opacity-80" : "text-slate-300 dark:text-slate-600"
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Quick Action Bottom Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 space-y-2">
              <div className="flex items-center justify-between gap-1.5">
                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 transition cursor-pointer shadow-2xs"
                >
                  <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === "en" ? "বাংলা" : "English"}</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenThemeModal?.();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 transition cursor-pointer shadow-2xs"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isBn ? "থিম মোড" : "Theme"}</span>
                </button>
              </div>

              {/* AI Brief & Email Desk */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAiSummary?.();
                  }}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{isBn ? "এআই বুলেটিন" : "AI Briefing"}</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenEmailDesk?.();
                  }}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                >
                  <Mail className="w-3 h-3 text-emerald-600" />
                  <span>{isBn ? "অটো ইমেইল" : "Auto Email"}</span>
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
