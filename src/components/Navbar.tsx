import React from "react";
import {
  Sprout,
  Globe2,
  Bell,
  Layers,
  DownloadCloud,
  Sun,
  Moon,
  User,
  Sparkles,
  Mail,
  Shield,
  GraduationCap,
  Palette,
  LogOut,
  Menu,
  RefreshCw,
  Satellite,
} from "lucide-react";
import { AppMode, Language, GeoField, SmartAlert } from "../types";
import { DICTIONARY } from "../data/translations";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface Props {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  fields: GeoField[];
  selectedField: GeoField;
  setSelectedField: (field: GeoField) => void;
  alerts: SmartAlert[];
  onOpenAlerts: () => void;
  apiConnected: boolean;
  onOpenApiHealth: () => void;
  installPromptAvailable: boolean;
  onInstallPwa: () => void;
  onOpenAuthModal: () => void;
  onOpenAiSummary?: () => void;
  onOpenEmailDesk?: () => void;
  onOpenSatellite?: () => void;
  onOpenThemeModal?: () => void;
  onOpenMobileDrawer?: () => void;
  onRefreshFields?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<Props> = ({
  mode,
  setMode,
  language,
  setLanguage,
  fields,
  selectedField,
  setSelectedField,
  alerts,
  onOpenAlerts,
  apiConnected,
  onOpenApiHealth,
  installPromptAvailable,
  onInstallPwa,
  onOpenAuthModal,
  onOpenAiSummary,
  onOpenEmailDesk,
  onOpenSatellite,
  onOpenThemeModal,
  onOpenMobileDrawer,
  onRefreshFields,
  isRefreshing = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const t = DICTIONARY[language];
  const unreadAlerts = alerts.filter((a) => !a.acknowledged);

  const pipelineStages = [
    { key: "Observe", label: t.pipelineObserve },
    { key: "Analyze", label: t.pipelineAnalyze },
    { key: "Predict", label: t.pipelinePredict },
    { key: "Recommend", label: t.pipelineRecommend },
    { key: "Explain", label: t.pipelineExplain },
    { key: "Act", label: t.pipelineAct },
    { key: "Monitor", label: t.pipelineMonitor },
  ];

  const roleIcons = {
    farmer: <Sprout className="w-3.5 h-3.5 text-emerald-500" />,
    agronomist: <Shield className="w-3.5 h-3.5 text-blue-500" />,
    researcher: <GraduationCap className="w-3.5 h-3.5 text-purple-500" />,
    admin: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Banner: Simplified for Farmer Mode, Detailed for Standard/Research */}
      <div className="bg-[#1C3026] dark:bg-[#090F0D] text-stone-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#2B4537]">
        {mode === "farmer" ? (
          <div className="flex items-center gap-2 text-[11px] font-bangla font-semibold text-emerald-300">
            <span>👨‍🌾</span>
            <span>
              {language === "bn"
                ? "সহজ কৃষক মোড সক্রিয় — কণ্ঠ সহকারী ও দৈনিক কাজসমূহ"
                : "Simple Farmer Mode Active — Voice AI Helper & Essential Tasks"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono scrollbar-none">
            <span className="text-emerald-400 font-semibold tracking-wider uppercase text-[10px]">
              {language === "bn" ? "সিদ্ধান্ত চক্র:" : "DECISION PIPELINE:"}
            </span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {pipelineStages.map((stage, idx) => (
                <React.Fragment key={stage.key}>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                      idx === 3 || idx === 4
                        ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                        : "text-slate-300 dark:text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </span>
                  {idx < pipelineStages.length - 1 && (
                    <span className="text-slate-600">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-[11px]">
          {/* Quick AI Summary Trigger (Only in Standard Mode) */}
          {mode !== "farmer" && onOpenAiSummary && (
            <button
              onClick={onOpenAiSummary}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition font-semibold cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{language === "bn" ? "এআই বুলেটিন" : "AI Briefing"}</span>
            </button>
          )}

          {/* Quick Satellite NDVI Trigger */}
          {onOpenSatellite && (
            <button
              onClick={onOpenSatellite}
              className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition font-semibold cursor-pointer"
              title={language === "bn" ? "স্যাটেলাইট এনডিভিআই এক্সপ্লোরার খুলুন" : "Open Satellite NDVI Explorer"}
            >
              <Satellite className="w-3 h-3" />
              <span>{language === "bn" ? "স্যাটেলাইট" : "Satellite"}</span>
            </button>
          )}

          {/* Quick Email Desk Trigger (Only in Standard Mode) */}
          {mode !== "farmer" && onOpenEmailDesk && (
            <button
              onClick={onOpenEmailDesk}
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition font-semibold cursor-pointer"
            >
              <Mail className="w-3 h-3" />
              <span>{language === "bn" ? "অটো ইমেইল" : "Auto-Email"}</span>
            </button>
          )}

          {mode !== "farmer" && <span className="text-slate-600 hidden sm:inline">|</span>}

          <button
            onClick={onOpenApiHealth}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
            title="Check API Gateway Health"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-slate-300 font-mono">
              {apiConnected ? "APIs Operational" : "Local Sync Mode"}
            </span>
          </button>

          {onRefreshFields && (
            <>
              <span className="text-slate-600">|</span>
              <button
                onClick={onRefreshFields}
                disabled={isRefreshing}
                title={language === "bn" ? "ম্যানুয়াল রিফ্রেশ" : "Manual Refresh"}
                className="flex items-center gap-1.5 text-emerald-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer font-semibold"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>
                  {language === "bn" ? "রিফ্রেশ" : "Refresh"}
                </span>
              </button>
            </>
          )}

          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400 font-mono text-[10px]">
            FAO-56 & Copernicus Verified
          </span>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5">
          {onOpenMobileDrawer && (
            <button
              onClick={onOpenMobileDrawer}
              className="lg:hidden p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition cursor-pointer shrink-0"
              title={language === "bn" ? "মেনু ড্রয়ার খুলুন" : "Open Menu Drawer"}
              aria-label="Open Mobile Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-[#1B4332] flex items-center justify-center text-white shadow-xs shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-display">
                {t.appName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                v2.5 Pro
              </span>
            </div>
            <p className="text-xs text-[#5C5549] dark:text-stone-400 hidden sm:block font-bangla">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center: Field Selector */}
        <div className="hidden md:flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#1D3227] border border-[#E8E0D5] dark:border-[#2B4537] rounded-xl px-3 py-1.5">
          <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <div className="text-xs text-left">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
              {t.fieldSelectLabel}
            </div>
            <select
              value={selectedField.id}
              onChange={(e) => {
                const found = fields.find((f) => f.id === e.target.value);
                if (found) setSelectedField(found);
              }}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id} className="dark:bg-[#14221B] dark:text-slate-100">
                  {language === "bn" ? f.nameBn : f.name} ({f.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <div className="flex items-center bg-[#FAF7F2] dark:bg-[#1D3227] p-1 rounded-xl border border-[#E8E0D5] dark:border-[#2B4537] text-xs">
            <button
              onClick={() => setMode("standard")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                mode === "standard"
                  ? "bg-[#FFFDFB] dark:bg-[#14221B] text-emerald-950 dark:text-emerald-300 shadow-xs font-semibold border border-[#E8E0D5]/50 dark:border-[#2B4537]/50"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {t.modeStandard}
            </button>
            <button
              onClick={() => setMode("farmer")}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                mode === "farmer"
                  ? "bg-[#1B4332] text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <span>👨‍🌾</span>
              <span>{t.modeFarmer}</span>
            </button>
            <button
              onClick={() => setMode("researcher")}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                mode === "researcher"
                  ? "bg-[#1C3026] dark:bg-[#090F0D] text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <span>🔬</span>
              <span>{t.modeResearcher}</span>
            </button>
          </div>

          {/* Theme Toggle & Appearance Customizer */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FAF6F0] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] text-stone-700 dark:text-stone-200 transition cursor-pointer shadow-2xs"
              title={theme === "dark" ? "Switch to Relaxing Off-White Light Mode" : "Switch to Forest Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-amber-800 rotate-0 transition-transform duration-300" />
              )}
            </button>
            {onOpenThemeModal && (
              <button
                onClick={onOpenThemeModal}
                className="hidden sm:flex p-2 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FAF6F0] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] text-amber-800 dark:text-amber-400 transition cursor-pointer shadow-2xs"
                title="Open Theme & Display Settings"
              >
                <Palette className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FAF6F0] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] text-xs font-semibold text-[#4A4031] dark:text-stone-200 transition cursor-pointer shadow-2xs"
            title="Toggle Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{language === "en" ? "বাংলা" : "English"}</span>
          </button>

          {/* User Auth / Profile Badge */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FAF6F0] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] text-xs font-semibold text-[#4A4031] dark:text-stone-200 transition cursor-pointer shadow-2xs"
            title="User Account & Role Profile"
          >
            {isAuthenticated && user ? (
              <>
                <div className="w-5 h-5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-medium max-w-[90px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <span className="hidden md:inline text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#FAF7F2] dark:bg-[#1A2C22] text-slate-600 dark:text-slate-300">
                  {user.role}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{language === "bn" ? "লগইন" : "Sign In"}</span>
              </>
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl border border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/50 text-red-600 dark:text-red-400 transition cursor-pointer shadow-2xs"
              title={language === "bn" ? "লগ আউট" : "Log Out"}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Alert Center Trigger */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FAF6F0] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] text-[#4A4031] dark:text-stone-200 transition cursor-pointer shadow-2xs"
            title="Smart Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* PWA Install */}
          {installPromptAvailable && (
            <button
              onClick={onInstallPwa}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Field Selector Bar */}
      <div className="md:hidden px-4 py-1.5 bg-[#FAF7F2] dark:bg-[#16251E] border-t border-[#E8E0D5] dark:border-[#22382D] flex items-center justify-between text-xs">
        <span className="text-[#5C5549] dark:text-stone-400 font-medium font-bangla">
          {t.fieldSelectLabel}:
        </span>
        <select
          value={selectedField.id}
          onChange={(e) => {
            const found = fields.find((f) => f.id === e.target.value);
            if (found) setSelectedField(found);
          }}
          className="bg-white dark:bg-[#14221B] border border-[#E8E0D5] dark:border-[#22382D] rounded-lg px-2 py-1 font-semibold text-[#4A4031] dark:text-stone-100 max-w-[220px] truncate"
        >
          {fields.map((f) => (
            <option key={f.id} value={f.id}>
              {language === "bn" ? f.nameBn : f.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};
