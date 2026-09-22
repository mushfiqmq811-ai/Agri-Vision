import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BANGLADESH_FIELDS } from "./data/bangladeshFields";
import { GeoField, Language, AppMode, WeatherPayload, SoilPayload, IrrigationRecommendation, SmartAlert } from "./types";
import { Navbar } from "./components/Navbar";
import { MainDashboard } from "./components/MainDashboard";
import { FieldMap } from "./components/FieldMap";
import { WeatherModule } from "./components/WeatherModule";
import { SoilIntelligenceModule } from "./components/SoilIntelligenceModule";
import { SmartIrrigationEngine } from "./components/SmartIrrigationEngine";
import { CropDoctorModule } from "./components/CropDoctorModule";
import { SatelliteNDVIModule } from "./components/SatelliteNDVIModule";
import { RiskTimelineModule } from "./components/RiskTimelineModule";
import { ScenarioSimulatorModule } from "./components/ScenarioSimulatorModule";
import { SustainabilityDashboard } from "./components/SustainabilityDashboard";
import { AlertCenterModule } from "./components/AlertCenterModule";
import { MarketIntelligenceModule } from "./components/MarketIntelligenceModule";
import { FarmerModeView } from "./components/FarmerModeView";
import { ResearcherModeView } from "./components/ResearcherModeView";
import { ExplainabilityModal } from "./components/ExplainabilityModal";
import { FarmerAiSummaryModule } from "./components/FarmerAiSummaryModule";
import { EmailAutomationModule } from "./components/EmailAutomationModule";
import { CropDigitalTwinModule } from "./components/CropDigitalTwinModule";
import { AuthModal } from "./components/AuthModal";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { PublicLandingPage } from "./components/PublicLandingPage";
import { BangladeshCultureBanner } from "./components/BangladeshCultureBanner";
import { ThemeSelectorModal } from "./components/ThemeSelectorModal";
import { MobileNavigationDrawer } from "./components/MobileNavigationDrawer";
import { AgriVisionTransitionOverlay } from "./components/AgriVisionTransitionOverlay";
import { PullToRefreshContainer } from "./components/PullToRefreshContainer";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  LayoutDashboard,
  Map,
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
  User,
  Globe2,
  Palette,
  Layers,
  HelpCircle,
  Sprout,
  TrendingUp,
  MessageSquare,
  Activity,
  Menu,
  Compass,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

function AgriVisionCore() {
  const [fields, setFields] = useState<GeoField[]>(BANGLADESH_FIELDS);
  const [selectedField, setSelectedField] = useState<GeoField>(BANGLADESH_FIELDS[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchServerFields = async (syncSelected = true) => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/fields");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.fields) {
          setFields(data.fields);
          if (syncSelected) {
            setSelectedField(prev => {
              const updated = data.fields.find((f: GeoField) => f.id === prev.id);
              return updated || prev;
            });
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch server fields:", err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 650);
    }
  };

  // Poll for live field data updates every 8 seconds
  useEffect(() => {
    fetchServerFields(true);
    const interval = setInterval(() => {
      fetchServerFields(true);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const [mode, setMode] = useState<AppMode>("standard");
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [explainabilityOpen, setExplainabilityOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Search & Collapsible Navigation states
  const [bypassLanding, setBypassLanding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>([
    "overview",
    "ai_services",
    "agro_intel",
    "communications",
    "market_finance",
  ]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const searchableModules = [
    { id: "dashboard", labelEn: "Overview Dashboard", labelBn: "সারসংক্ষেপ ড্যাশবোর্ড", category: "Overview" },
    { id: "aiSummary", labelEn: "AI Farmer Briefing", labelBn: "এআই শস্য ব্রিফিং", category: "Overview" },
    { id: "map", labelEn: "GIS Field Map", labelBn: "জিআইএস ফিল্ড ম্যাপ", category: "Overview" },
    { id: "sustainability", labelEn: "Sustainability ESG Score", labelBn: "টেকসই পরিবেশ স্কোর", category: "Overview" },
    { id: "crop_doctor", labelEn: "AI Crop Doctor Desk", labelBn: "এআই শস্য ডাক্তার", category: "AI Services" },
    { id: "cropDigitalTwin", labelEn: "Crop Digital Twin AI", labelBn: "শস্য ডিজিটাল টুইন এআই", category: "AI Services" },
    { id: "satellite", labelEn: "Satellite NDVI", labelBn: "স্যাটেলাইট এনডিভিআই", category: "AI Services" },
    { id: "soil", labelEn: "Soil Nutrition Intelligence", labelBn: "মাটির পুষ্টি ও আদ্রতা", category: "Agro-Intelligence" },
    { id: "weather", labelEn: "Weather Intelligence & Microclimate", labelBn: "আবহাওয়া পূর্বাভাস", category: "Agro-Intelligence" },
    { id: "irrigation", labelEn: "Smart Irrigation & Water Pumps", labelBn: "সেচ ক্যালকুলেটর", category: "Agro-Intelligence" },
    { id: "alerts", labelEn: "Cell Alert Dispatcher & SMS/WhatsApp", labelBn: "মোবাইল ব্রডকাস্ট", category: "Communications" },
    { id: "emailDesk", labelEn: "Automated Weekly Email Desk", labelBn: "অটো ইমেইল ডেস্ক", category: "Communications" },
    { id: "risks", labelEn: "15-Day Risk Analytics Timeline", labelBn: "১৫ দিনের ঝুঁকি তালিকা", category: "Communications" },
    { id: "scenario", labelEn: "What-If Eco Simulator", labelBn: "শস্য সিমুলেটর", category: "Communications" },
    { id: "market", labelEn: "Agro-Market AI Price Predictor", labelBn: "কৃষি বাজার এআই", category: "Market & Finance" },
  ];

  const categories = [
    {
      id: "overview",
      labelEn: "Overview & Map",
      labelBn: "সারসংক্ষেপ ও ম্যাপ",
      items: ["dashboard", "aiSummary", "map", "sustainability"],
    },
    {
      id: "ai_services",
      labelEn: "AI Crop Health",
      labelBn: "এআই শস্য স্বাস্থ্য",
      items: ["crop_doctor", "cropDigitalTwin", "satellite"],
    },
    {
      id: "agro_intel",
      labelEn: "Agro-Intelligence",
      labelBn: "কৃষি সেন্সর ও রিডিং",
      items: ["soil", "weather", "irrigation"],
    },
    {
      id: "communications",
      labelEn: "Alerts & Simulators",
      labelBn: "এলার্ট ও সিমুলেটর",
      items: ["alerts", "emailDesk", "risks", "scenario"],
    },
    {
      id: "market_finance",
      labelEn: "Agro-Market",
      labelBn: "কৃষি বাজার",
      items: ["market"],
    },
  ];

  const getBreadcrumbs = () => {
    const activeModule = searchableModules.find(m => m.id === activeTab);
    if (!activeModule) return [language === "bn" ? "হোম" : "Home"];
    
    const catName = language === "bn"
      ? (activeModule.category === "Overview" ? "সারসংক্ষেপ" : activeModule.category === "AI Services" ? "এআই সার্ভিস" : activeModule.category === "Agro-Intelligence" ? "কৃষি বুদ্ধিমত্তা" : activeModule.category === "Communications" ? "যোগাযোগ" : "বাজার ও অর্থ")
      : activeModule.category;
      
    const modName = language === "bn" ? activeModule.labelBn : activeModule.labelEn;
    return [language === "bn" ? "হোম" : "Home", catName, modName];
  };

  const filteredModules = searchQuery.trim() === ""
    ? []
    : searchableModules.filter(m => 
        m.labelEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.labelBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Tab history stack for Back Navigation (Issue 4)
  const [tabHistory, setTabHistory] = useState<string[]>([]);

  // Transition Animation state with AgriVision Logo (Issue 6)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetModuleName, setTargetModuleName] = useState<{ en: string; bn: string }>({
    en: "Overview Dashboard",
    bn: "সারসংক্ষেপ ড্যাশবোর্ড",
  });

  const navigateWithTransition = (targetTabId: string) => {
    if (targetTabId === activeTab) return;

    const targetMod = searchableModules.find((m) => m.id === targetTabId);
    setTargetModuleName({
      en: targetMod ? targetMod.labelEn : "Overview Dashboard",
      bn: targetMod ? targetMod.labelBn : "সারসংক্ষেপ ড্যাশবোর্ড",
    });

    setIsTransitioning(true);
    setTabHistory((prev) => [...prev, activeTab]);

    setTimeout(() => {
      setActiveTab(targetTabId);
    }, 180);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 380);
  };

  const handleGoBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, -1));

      const targetMod = searchableModules.find((m) => m.id === prevTab);
      setTargetModuleName({
        en: targetMod ? targetMod.labelEn : "Overview Dashboard",
        bn: targetMod ? targetMod.labelBn : "সারসংক্ষেপ ড্যাশবোর্ড",
      });

      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(prevTab);
      }, 180);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 380);
    } else {
      navigateWithTransition("dashboard");
    }
  };

  const handleGlobalPullRefresh = async () => {
    const [lat, lon] = selectedField.coordinates;
    await Promise.allSettled([
      fetchServerFields(true),
      fetchWeather(lat, lon),
      fetchSoil(lat, lon),
      fetch("/api/alerts/trigger-hourly-now").catch(() => {}),
    ]);
  };

  // Elegant Sub-tabs tracking states to prevent visual clutter
  const [activeDashboardSub, setActiveDashboardSub] = useState<"overview" | "ai_briefing" | "gis_map">("overview");
  const [activeSoilWeatherSub, setActiveSoilWeatherSub] = useState<"soil" | "weather" | "irrigation" | "satellite">("soil");
  const [activeAlertsSub, setActiveAlertsSub] = useState<"alerts" | "email" | "risks" | "scenario" | "sustainability">("alerts");

  const { user, isAuthenticated } = useAuth();

  // Sync mode and language when user role changes
  useEffect(() => {
    if (user?.role === "farmer") {
      setMode("farmer");
      setLanguage("bn");
    } else if (user?.role === "researcher") {
      setMode("researcher");
      setLanguage("en");
    }
  }, [user?.role]);

  // Default active alerts
  const [alerts] = useState<SmartAlert[]>([
    {
      id: "alt-1",
      titleEn: "Foliar Blast Early-Warning Window",
      titleBn: "পাতা ব্লাস্ট ছত্রাক সংক্রমণের আগাম সতর্কতা",
      descEn: "Canopy relative humidity exceeded 88% for 7 consecutive hours. Suspend urea top-dressing and spray preventive Tricyclazole 75 WP within 36 hours.",
      descBn: "বাতাসের আর্দ্রতা ৮৮% ছাড়িয়ে গেছে। ইউরিয়া উপরিপ্রয়োগ বন্ধ রাখুন এবং আগামী ৩৬ ঘণ্টার মধ্যে ট্রুপার/নাটিভো স্প্রে করুন।",
      level: "critical",
      category: "disease",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      actionEn: "Spray systemic fungicide before flowering stage.",
      actionBn: "ফুল আসার পূর্বে সিস্টেমিক ছত্রাকনাশক স্প্রে করুন।",
      acknowledged: false,
    },
    {
      id: "alt-2",
      titleEn: "Rain Forecast: Irrigation Suspension",
      titleBn: "বৃষ্টিপাতের পূর্বাভাস: সেচ প্রয়োগ স্থগিত রাখুন",
      descEn: "Open-Meteo synoptic model projects 18.5mm precipitation in next 48 hours. Save diesel/power by withholding scheduled irrigation.",
      descBn: "পরবর্তী ৪৮ ঘণ্টায় ১৮.৫ মিমি বৃষ্টির সম্ভাবনা রয়েছে। পাম্প বন্ধ রেখে জ্বালানি ও ভূগর্ভস্থ পানি সাশ্রয় করুন।",
      level: "warning",
      category: "irrigation",
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      actionEn: "Hold motor pump activation until storm passes.",
      actionBn: "বৃষ্টি সমাপ্ত না হওয়া পর্যন্ত পাম্প চালানো স্থগিত রাখুন।",
      acknowledged: false,
    },
  ]);

  // Weather & Soil & Irrigation states
  const [weather, setWeather] = useState<WeatherPayload | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [soil, setSoil] = useState<SoilPayload | null>(null);
  const [soilLoading, setSoilLoading] = useState<boolean>(true);

  const [irrigation, setIrrigation] = useState<IrrigationRecommendation | null>(null);

  const isBn = language === "bn";

  // Fetch live weather data
  const fetchWeather = async (lat: number, lon: number) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) {
        throw new Error(`Weather feed returned HTTP ${res.status}`);
      }
      const data: WeatherPayload = await res.json();
      setWeather(data);
    } catch (err: any) {
      setWeatherError(err.message || "Failed to load Open-Meteo weather intelligence");
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch live soil data
  const fetchSoil = async (lat: number, lon: number) => {
    setSoilLoading(true);
    try {
      const res = await fetch(`/api/soil?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error("Soil query failed");
      const data: SoilPayload = await res.json();
      setSoil(data);
    } catch (err) {
      // Handled cleanly
    } finally {
      setSoilLoading(false);
    }
  };

  // Calculate irrigation when field or weather changes
  const calculateIrrigation = async (field: GeoField, weatherData?: WeatherPayload | null) => {
    try {
      const et0 = weatherData?.data?.daily?.et0_fao_evapotranspiration?.[0] ?? 4.1;
      const rain = weatherData?.data?.daily?.precipitation_sum?.[0] ?? 0;
      const res = await fetch("/api/irrigation/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropId: field.cropId,
          stageName: field.currentStage,
          currentMoisturePct: field.currentMoisturePct,
          et0,
          forecastRain48hMm: rain,
          irrigationMethod: field.irrigationMethod,
          areaBigha: field.areaBigha,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIrrigation(data.recommendation);
      }
    } catch (err) {
      // fallback
    }
  };

  useEffect(() => {
    const [lat, lon] = selectedField.coordinates;
    fetchWeather(lat, lon);
    fetchSoil(lat, lon);
  }, [selectedField.id]);

  useEffect(() => {
    calculateIrrigation(selectedField, weather);
  }, [selectedField.id, selectedField.currentMoisturePct, weather]);

  // Redirect to Public Landing Page if unauthenticated and not bypassed
  if (!isAuthenticated && !bypassLanding) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] relative">
        <PublicLandingPage
          language={language}
          onToggleLanguage={() => setLanguage(language === "en" ? "bn" : "en")}
          onGetStarted={(isGuest) => {
            if (isGuest) {
              setBypassLanding(true);
            } else {
              setAuthModalOpen(true);
            }
          }}
          onOpenLogin={() => setAuthModalOpen(true)}
        />

        {/* Multi-Role Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          language={language}
          onRoleChanged={(role) => {
            if (role === "farmer") setMode("farmer");
            else if (role === "researcher") setMode("researcher");
            else setMode("standard");
          }}
        />
      </div>
    );
  }

  // Navigation tab definitions
  const tabs = [
    { id: "dashboard", labelEn: "Overview Dashboard", labelBn: "সারসংক্ষেপ ড্যাশবোর্ড", icon: LayoutDashboard },
    { id: "aiSummary", labelEn: "AI Farmer Briefing", labelBn: "এআই শস্য ব্রিফিং", icon: Sparkles },
    { id: "crop_doctor", labelEn: "AI Crop Doctor", labelBn: "এআই শস্য ডাক্তার", icon: Stethoscope },
    { id: "irrigation", labelEn: "Smart Irrigation", labelBn: "সেচ ক্যালকুলেটর", icon: Droplets },
    { id: "cropDigitalTwin", labelEn: "Crop Digital Twin AI", labelBn: "শস্য ডিজিটাল টুইন এআই", icon: Activity },
    { id: "emailDesk", labelEn: "Automated Email Desk", labelBn: "অটো ইমেইল ডেস্ক", icon: Mail },
    { id: "alerts", labelEn: "Cell Alert Dispatcher", labelBn: "মোবাইল ব্রডকাস্ট", icon: Bell },
    { id: "map", labelEn: "GIS Field Map", labelBn: "জিআইএস ফিল্ড ম্যাপ", icon: Map },
    { id: "soil", labelEn: "Soil Intelligence", labelBn: "মাটির পুষ্টি ও আদ্রতা", icon: TestTube },
    { id: "weather", labelEn: "Weather Intelligence", labelBn: "আবহাওয়া পূর্বাভাস", icon: CloudSun },
    { id: "market", labelEn: "Agro-Market AI", labelBn: "কৃষি বাজার এআই", icon: TrendingUp },
    { id: "satellite", labelEn: "Satellite NDVI", labelBn: "স্যাটেলাইট এনডিভিআই", icon: Satellite },
    { id: "risks", labelEn: "15-Day Risk Timeline", labelBn: "১৫ দিনের ঝুঁকি তালিকা", icon: AlertTriangle },
    { id: "scenario", labelEn: "What-If Simulator", labelBn: "শস্য সিমুলেটর", icon: Sliders },
    { id: "sustainability", labelEn: "Sustainability ESG", labelBn: "টেকসই পরিবেশ স্কোর", icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950 dark:selection:bg-emerald-800 dark:selection:text-emerald-100 transition-colors duration-200">
      
      {/* =========================================================================
          1. DESKTOP INTERFACE LAYOUT (lg and up)
          ========================================================================= */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Workspace Sidebar */}
        <aside className="w-80 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col sticky top-0 h-screen overflow-y-auto shadow-sm select-none">
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-[#E8E0D5] dark:border-[#22382D] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332] flex items-center justify-center text-white shrink-0">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#1B4332] dark:text-[#FAF7F2] font-display">
                AgriVision
              </span>
              <p className="text-[10px] text-[#5C5549] dark:text-stone-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                {isBn ? "স্মার্ট কৃষি সিদ্ধান্ত" : "Precision Decision Engine"}
              </p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-4 my-3 bg-[#FAF7F2] dark:bg-[#1D3227] rounded-2xl border border-[#E8E0D5]/60 dark:border-[#2B4537]/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {isAuthenticated && user ? user.name[0] : <User className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">
                {isAuthenticated && user ? user.name : (isBn ? "Guest User" : "Guest Operator")}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-500 dark:text-emerald-400">
                  {isAuthenticated && user ? user.role : (isBn ? "Visitor" : "Operator")}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="p-1.5 text-stone-400 hover:text-[#1B4332] dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Field Selection Dropdown */}
          <div className="px-6 py-2">
            <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block mb-1">
              {isBn ? "সক্রিয় কৃষি জমি" : "Active Field Parcel"}
            </label>
            <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#1D3227] border border-[#E8E0D5] dark:border-[#2B4537] rounded-xl px-3 py-2">
              <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <select
                value={selectedField.id}
                onChange={(e) => {
                  const found = fields.find((f) => f.id === e.target.value);
                  if (found) setSelectedField(found);
                }}
                className="bg-transparent font-bold text-stone-800 dark:text-slate-100 focus:outline-none cursor-pointer pr-1 text-xs w-full"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id} className="dark:bg-[#14221B] dark:text-slate-100">
                    {language === "bn" ? f.nameBn : f.name} ({f.district})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="px-6 py-2 mt-2">
            <div className="flex p-1 bg-[#FAF7F2] dark:bg-[#1D3227] rounded-xl border border-[#E8E0D5] dark:border-[#2B4537] text-xs">
              <button
                onClick={() => setMode("standard")}
                className={`flex-1 py-1 rounded-lg font-medium transition text-center cursor-pointer ${
                  mode === "standard"
                    ? "bg-[#FFFDFB] dark:bg-[#14221B] text-emerald-950 dark:text-emerald-300 shadow-2xs font-bold border border-[#E8E0D5]/50 dark:border-[#2B4537]/50"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 text-[11px]"
                }`}
              >
                {isBn ? "ড্যাশবোর্ড" : "Standard"}
              </button>
              <button
                onClick={() => setMode("farmer")}
                className={`flex-1 py-1 rounded-lg font-medium transition text-center cursor-pointer ${
                  mode === "farmer"
                    ? "bg-[#1B4332] text-white shadow-2xs font-bold"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 text-[11px]"
                }`}
              >
                {isBn ? "কৃষক" : "Farmer"}
              </button>
              <button
                onClick={() => setMode("researcher")}
                className={`flex-1 py-1 rounded-lg font-medium transition text-center cursor-pointer ${
                  mode === "researcher"
                    ? "bg-[#1C3026] dark:bg-[#090F0D] text-white shadow-2xs font-bold"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 text-[11px]"
                }`}
              >
                {isBn ? "গবেষক" : "Research"}
              </button>
            </div>
          </div>

          {/* Standard Mode Navigation Links */}
          <div className="flex-1 px-4 py-3 overflow-y-auto">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block px-2 mb-3">
              {isBn ? "মডিউল ক্যাটাগরি" : "Agronomic Portals"}
            </span>
            <div className="space-y-3">
              {mode === "standard" ? (
                categories.map((cat) => {
                  const isOpen = openCategories.includes(cat.id);
                  return (
                    <div key={cat.id} className="space-y-1">
                      {/* Collapsible Category Header */}
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-stone-500 hover:text-slate-600 dark:hover:text-stone-300 transition cursor-pointer select-none"
                      >
                        <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                        {isOpen ? (
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        )}
                      </button>

                      {/* Category Items */}
                      {isOpen && (
                        <div className="space-y-0.5 pl-1">
                          {cat.items.map((tabId) => {
                            const tab = tabs.find((t) => t.id === tabId);
                            if (!tab) return null;
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => navigateWithTransition(tab.id)}
                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                  isActive
                                    ? "bg-[#1B4332] text-white shadow-2xs font-bold font-bangla"
                                    : "text-[#5C5549] dark:text-stone-400 hover:bg-[#F2ECE0]/60 dark:hover:bg-[#1D3227] hover:text-[#1B4332] dark:hover:text-stone-100 font-bangla"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-stone-400 dark:text-stone-500"}`} />
                                  <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                                </div>
                                {tab.id === "alerts" && alerts.length > 0 && (
                                  <span className="bg-amber-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                                    {alerts.length}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-2 py-3 bg-[#FAF7F2] dark:bg-[#1D3227]/40 rounded-xl border border-dashed border-[#E8E0D5] dark:border-[#22382D] text-center text-[11px] text-stone-500">
                  {isBn ? "কাস্টম ভিউ মোড সক্রিয়" : "Custom view mode active"}
                </div>
              )}
            </div>
          </div>

          {/* Left Sidebar Footer - Desktop Quick Shortcuts */}
          <div className="p-4 border-t border-[#E8E0D5] dark:border-[#22382D] bg-[#FAF7F2]/50 dark:bg-[#111C16]">
            <div className="flex items-center justify-between gap-1.5">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FFFDFB] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] text-[11px] font-bold text-[#4A4031] dark:text-stone-200 transition cursor-pointer shadow-2xs"
                title="Toggle Language"
              >
                <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === "en" ? "বাংলা" : "EN"}</span>
              </button>

              {/* Theme Selector Toggle */}
              <button
                onClick={() => setThemeModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FFFDFB] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] text-[11px] font-bold text-[#4A4031] dark:text-stone-200 transition cursor-pointer shadow-2xs"
                title="Toggle Atmosphere Theme"
              >
                <Palette className="w-3.5 h-3.5 text-amber-600" />
                <span>{isBn ? "থিম" : "Theme"}</span>
              </button>
            </div>

            {/* Quick Action Mini Bar */}
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <button
                onClick={() => {
                  setMode("standard");
                  navigateWithTransition("aiSummary");
                }}
                className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold bg-[#1B4332]/10 dark:bg-emerald-950/40 text-[#1B4332] dark:text-emerald-400 hover:bg-[#1B4332]/20 transition cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Brief</span>
              </button>
              <button
                onClick={() => {
                  setMode("standard");
                  navigateWithTransition("emailDesk");
                }}
                className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
              >
                <Mail className="w-3 h-3" />
                <span>Email Desk</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Desktop Workspace Content Container */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          {/* Top minimal status bar */}
          <header className="h-16 border-b border-[#E8E0D5] dark:border-[#22382D] bg-[#FFFDFB] dark:bg-[#14221B] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              {activeTab !== "dashboard" && (
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 text-xs font-bold transition shadow-2xs active:scale-95 cursor-pointer font-bangla mr-1"
                  title={isBn ? "পূর্ববর্তী পেজে ফিরে যান" : "Back to previous page"}
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{isBn ? "পূর্বের পেজে যান" : "Go Back"}</span>
                </button>
              )}
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest hidden sm:inline">
                {isBn ? "সিদ্ধান্ত গ্রহণ প্রক্রিয়া" : "DECISION WORKSPACE"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-mono font-bold bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800 px-2 py-0.5 rounded">
                {isBn ? "সংযুক্ত" : "API ACTIVE"}
              </span>

              {/* Manual Refresh Button */}
              <button
                onClick={() => handleGlobalPullRefresh()}
                disabled={isRefreshing}
                title={isBn ? "ম্যানুয়াল রিফ্রেশ" : "Manual Refresh"}
                className={`p-1.5 ml-1 rounded-lg border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FAF6F0] dark:bg-[#1A2C22] text-[#4A4031] dark:text-stone-300 hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] active:scale-95 disabled:opacity-60 transition cursor-pointer shadow-2xs flex items-center justify-center`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Dynamic Notification Hub */}
              <button
                onClick={() => {
                  setMode("standard");
                  navigateWithTransition("alerts");
                }}
                className="relative p-2 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-[#FAF6F0] dark:bg-[#1A2C22] hover:bg-[#F2ECE0] dark:hover:bg-[#22392D] transition cursor-pointer shadow-2xs"
              >
                <Bell className="w-4 h-4 text-[#4A4031] dark:text-stone-200" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>

              <div className="text-right text-xs">
                <span className="text-[10px] text-stone-400 block font-mono">SYNOPTIC UPDATE</span>
                <span className="font-bold text-stone-700 dark:text-stone-200">
                  {weather?.data?.current?.temperature_2m ?? "28.4"}°C • Real-time
                </span>
              </div>
            </div>
          </header>

          <PullToRefreshContainer onRefresh={handleGlobalPullRefresh} isBn={isBn}>
            <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* Universal Search & Live Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              {/* Breadcrumbs + Back Button */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {activeTab !== "dashboard" && (
                  <button
                    onClick={handleGoBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 transition text-xs font-bold font-bangla cursor-pointer shadow-2xs"
                    title={isBn ? "পূর্বের পেজে ফিরে যান" : "Return to previous page"}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>{isBn ? "ফিরে যান" : "Back"}</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-stone-400 font-medium font-bangla">
                  {getBreadcrumbs().map((crumb, idx, arr) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
                      <button
                        onClick={() => {
                          if (idx === 0) {
                            navigateWithTransition("dashboard");
                          }
                        }}
                        className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer ${
                          idx === arr.length - 1 ? "font-bold text-slate-800 dark:text-stone-200" : ""
                        }`}
                      >
                        {crumb}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Universal Search Input */}
              <div className="relative w-full sm:w-80">
                <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#1D3227] border border-[#E8E0D5] dark:border-[#2B4537] rounded-xl px-3 py-1.5">
                  <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 animate-pulse" />
                  <input
                    type="text"
                    placeholder={isBn ? "সার্ভিস বা মডিউল খুঁজুন..." : "Search modules & services..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent focus:outline-none text-xs text-slate-800 dark:text-slate-100 w-full placeholder-slate-400 dark:placeholder-slate-500 font-bangla"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-600 text-[10px] font-bold font-mono px-1"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Floating Search Results */}
                {filteredModules.length > 0 && (
                  <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-30 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-fadeIn">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      {isBn ? "অনুসন্ধানের ফলাফল" : "Search Results"}
                    </div>
                    {filteredModules.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMode("standard");
                          navigateWithTransition(item.id);
                          setSearchQuery("");
                        }}
                        className="w-full text-left px-3 py-2.5 text-xs hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition flex flex-col gap-0.5 cursor-pointer font-bangla"
                      >
                        <span className="font-extrabold text-slate-700 dark:text-stone-200">
                          {isBn ? item.labelBn : item.labelEn}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                          {item.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cultural Tribute: Shoro Ritu (6 Seasons) & Khonar Bochon Folk Agronomy */}
            <BangladeshCultureBanner language={language} />

            <AnimatePresence mode="wait">
              <motion.div
                key={`desktop-${mode}-${activeTab}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {/* Content Routers */}
                {mode === "farmer" && (
                  <FarmerModeView
                    field={selectedField}
                    language={language}
                    weather={weather}
                    soil={soil}
                    irrigation={irrigation}
                    alerts={alerts}
                    onOpenExplainability={() => setExplainabilityOpen(true)}
                    onOpenCropDoctor={() => {
                      setMode("standard");
                      setActiveTab("crop_doctor");
                    }}
                    onSwitchToStandard={() => setMode("standard")}
                  />
                )}

                {mode === "researcher" && (
                  <ResearcherModeView
                    selectedField={selectedField}
                    weather={weather}
                    soil={soil}
                    language={language}
                  />
                )}

                {mode === "standard" && (
                  <>
                    {/* ==========================================
                        TAB 1: COMMAND DASHBOARD (Overview, Briefing & GIS)
                       ========================================== */}
                    {activeTab === "dashboard" && (
                      <div className="space-y-6">
                        {/* Compact Visual Category Selector */}
                        <div className="flex border-b border-[#E8E0D5] dark:border-[#22382D] pb-1 gap-4 overflow-x-auto scrollbar-none">
                          {[
                            { id: "overview", labelEn: "Analytics Overview", labelBn: "বিশ্লেষণ সারসংক্ষেপ" },
                            { id: "ai_briefing", labelEn: "Gemini AI Briefing", labelBn: "এআই দৈনিক ব্রিফিং" },
                            { id: "gis_map", labelEn: "GIS Satellite Overlay", labelBn: "স্যাটেলাইট জিআইএস ম্যাপ" }
                          ].map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setActiveDashboardSub(sub.id as any)}
                              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
                                activeDashboardSub === sub.id
                                  ? "text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-800 dark:border-emerald-400"
                                  : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                              }`}
                            >
                              {isBn ? sub.labelBn : sub.labelEn}
                            </button>
                          ))}
                        </div>

                        {activeDashboardSub === "overview" && (
                          <MainDashboard
                            selectedField={selectedField}
                            weather={weather}
                            soil={soil}
                            irrigation={irrigation}
                            language={language}
                            onNavigateTab={setActiveTab}
                            onOpenExplainability={() => setExplainabilityOpen(true)}
                          />
                        )}

                        {activeDashboardSub === "ai_briefing" && (
                          <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 uppercase tracking-widest font-mono">
                                {isBn ? "কৃষক দৈনিক এআই সংক্ষিপ্তকরণ" : "AI Agronomic Advisory & Action Checklist"}
                              </h2>
                              <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-extrabold uppercase">
                                Powered by Gemini 3.5 Flash
                              </span>
                            </div>
                            <FarmerAiSummaryModule
                              field={selectedField}
                              weather={weather}
                              soil={soil}
                              irrigation={irrigation}
                              language={language}
                            />
                          </div>
                        )}

                        {activeDashboardSub === "gis_map" && (
                          <div className="animate-fadeIn">
                            <FieldMap
                              fields={fields}
                              selectedField={selectedField}
                              onSelectField={setSelectedField}
                              language={language}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* ==========================================
                        TAB 2: SENSORS & WEATHER (Soil, Weather, Smart Irrigation, Satellite NDVI)
                       ========================================== */}
                    {activeTab === "soil_weather" && (
                      <div className="space-y-6">
                        <div className="flex border-b border-[#E8E0D5] dark:border-[#22382D] pb-1 gap-4 overflow-x-auto scrollbar-none">
                          {[
                            { id: "soil", labelEn: "Soil Nutrition Intelligence", labelBn: "মৃত্তিকা পুষ্টি ও আর্দ্রতা" },
                            { id: "weather", labelEn: "Microclimate & Weather", labelBn: "আবহাওয়া পূর্বাভাস" },
                            { id: "irrigation", labelEn: "Smart Irrigation Advisory", labelBn: "স্মার্ট সেচ নির্দেশিকা" },
                            { id: "satellite", labelEn: "Sentinel-2 NDVI Explorer", labelBn: "এনডিভিআই স্যাটেলাইট" }
                          ].map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setActiveSoilWeatherSub(sub.id as any)}
                              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
                                activeSoilWeatherSub === sub.id
                                  ? "text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-800 dark:border-emerald-400"
                                  : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                              }`}
                            >
                              {isBn ? sub.labelBn : sub.labelEn}
                            </button>
                          ))}
                        </div>

                        {activeSoilWeatherSub === "soil" && (
                          <div className="animate-fadeIn">
                            <SoilIntelligenceModule
                              soilData={soil}
                              loading={soilLoading}
                              language={language}
                              selectedField={selectedField}
                              onRefresh={() => {
                                const [lat, lon] = selectedField.coordinates;
                                fetchSoil(lat, lon);
                              }}
                            />
                          </div>
                        )}

                        {activeSoilWeatherSub === "weather" && (
                          <div className="animate-fadeIn">
                            <WeatherModule
                              weather={weather}
                              loading={weatherLoading}
                              error={weatherError}
                              onRetry={() => {
                                const [lat, lon] = selectedField.coordinates;
                                fetchWeather(lat, lon);
                              }}
                              language={language}
                              selectedField={selectedField}
                            />
                          </div>
                        )}

                        {activeSoilWeatherSub === "irrigation" && (
                          <div className="animate-fadeIn">
                            <SmartIrrigationEngine
                              field={selectedField}
                              irrigation={irrigation}
                              onOpenExplainability={() => setExplainabilityOpen(true)}
                              language={language}
                            />
                          </div>
                        )}

                        {activeSoilWeatherSub === "satellite" && (
                          <div className="animate-fadeIn">
                            <SatelliteNDVIModule
                              selectedField={selectedField}
                              language={language}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* ==========================================
                        TAB 3: AI CROP DOCTOR (Voice-Interactive)
                       ========================================== */}
                    {activeTab === "crop_doctor" && (
                      <CropDoctorModule
                        language={language}
                        selectedField={selectedField}
                      />
                    )}

                    {/* ==========================================
                        TAB 4: AGRO-MARKET AI FORECASTING
                       ========================================== */}
                    {activeTab === "market" && (
                      <MarketIntelligenceModule
                        language={language}
                        selectedField={selectedField}
                      />
                    )}

                    {/* ==========================================
                        TAB 5: COMMUNICATIONS & DISPATCH HUB (Smart Alerts, Email Automation, Risk Timelines, What-If Simulators)
                       ========================================== */}
                    {activeTab === "alerts" && (
                      <div className="space-y-6">
                        <div className="flex border-b border-[#E8E0D5] dark:border-[#22382D] pb-1 gap-4 overflow-x-auto scrollbar-none">
                          {[
                            { id: "alerts", labelEn: "Cellular Emergency Dispatcher", labelBn: "জরুরি প্রচার কেন্দ্র" },
                            { id: "email", labelEn: "Automated Weekly Email Desk", labelBn: "অটো সাপ্তাহিক ইমেইল" },
                            { id: "risks", labelEn: "15-Day Risk Analytics", labelBn: "ঝুঁকি টাইমলাইন" },
                            { id: "scenario", labelEn: "Eco What-If & ESG Simulator", labelBn: "পরিবেশ ও টেকসই সিমুলেটর" }
                          ].map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setActiveAlertsSub(sub.id as any)}
                              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer shrink-0 ${
                                activeAlertsSub === sub.id
                                  ? "text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-800 dark:border-emerald-400"
                                  : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                              }`}
                            >
                              {isBn ? sub.labelBn : sub.labelEn}
                            </button>
                          ))}
                        </div>

                        {activeAlertsSub === "alerts" && (
                          <div className="animate-fadeIn">
                            <AlertCenterModule
                              selectedField={selectedField}
                              language={language}
                              onRefreshFields={() => fetchServerFields(true)}
                            />
                          </div>
                        )}

                        {activeAlertsSub === "email" && (
                          <div className="animate-fadeIn">
                            <EmailAutomationModule
                              selectedField={selectedField}
                              weather={weather}
                              irrigation={irrigation}
                              language={language}
                            />
                          </div>
                        )}

                        {activeAlertsSub === "risks" && (
                          <div className="animate-fadeIn">
                            <RiskTimelineModule
                              selectedField={selectedField}
                              weather={weather}
                              language={language}
                            />
                          </div>
                        )}

                        {activeAlertsSub === "scenario" && (
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fadeIn">
                            <ScenarioSimulatorModule
                              selectedField={selectedField}
                              language={language}
                            />
                            <SustainabilityDashboard
                              selectedField={selectedField}
                              language={language}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* ==========================================
                        TAB 6: SATELLITE NDVI (Sentinel-2 Multi-spectral Explorer)
                       ========================================== */}
                    {activeTab === "satellite" && (
                      <div className="animate-fadeIn">
                        <SatelliteNDVIModule
                          selectedField={selectedField}
                          language={language}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 7: GIS FIELD PARCEL MAP
                       ========================================== */}
                    {activeTab === "map" && (
                      <div className="animate-fadeIn">
                        <FieldMap
                          fields={fields}
                          selectedField={selectedField}
                          onSelectField={setSelectedField}
                          language={language}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 8: AI FARMER BRIEFING & ACTION CHECKLIST
                       ========================================== */}
                    {activeTab === "aiSummary" && (
                      <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
                        <FarmerAiSummaryModule
                          field={selectedField}
                          weather={weather}
                          soil={soil}
                          irrigation={irrigation}
                          language={language}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 9: SOIL INTELLIGENCE & NUTRIENTS
                       ========================================== */}
                    {activeTab === "soil" && (
                      <div className="animate-fadeIn">
                        <SoilIntelligenceModule
                          soilData={soil}
                          loading={soilLoading}
                          language={language}
                          selectedField={selectedField}
                          onRefresh={() => {
                            const [lat, lon] = selectedField.coordinates;
                            fetchSoil(lat, lon);
                          }}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 10: SYNOPTIC WEATHER INTELLIGENCE
                       ========================================== */}
                    {activeTab === "weather" && (
                      <div className="animate-fadeIn">
                        <WeatherModule
                          weather={weather}
                          loading={weatherLoading}
                          error={weatherError}
                          onRetry={() => {
                            const [lat, lon] = selectedField.coordinates;
                            fetchWeather(lat, lon);
                          }}
                          language={language}
                          selectedField={selectedField}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 11: SMART IRRIGATION ENGINE
                       ========================================== */}
                    {activeTab === "irrigation" && (
                      <div className="animate-fadeIn">
                        <SmartIrrigationEngine
                          field={selectedField}
                          irrigation={irrigation}
                          onOpenExplainability={() => setExplainabilityOpen(true)}
                          language={language}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 12: CROP DIGITAL TWIN SIMULATOR
                       ========================================== */}
                    {activeTab === "cropDigitalTwin" && (
                      <div className="animate-fadeIn">
                        <CropDigitalTwinModule
                          selectedField={selectedField}
                          language={language}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 13: AUTOMATED WEEKLY EMAIL DESK
                       ========================================== */}
                    {activeTab === "emailDesk" && (
                      <div className="animate-fadeIn">
                        <EmailAutomationModule
                          selectedField={selectedField}
                          weather={weather}
                          irrigation={irrigation}
                          language={language}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 14: 15-DAY RISK TIMELINE ANALYTICS
                       ========================================== */}
                    {activeTab === "risks" && (
                      <div className="animate-fadeIn">
                        <RiskTimelineModule
                          selectedField={selectedField}
                          weather={weather}
                          language={language}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 15: WHAT-IF SCENARIO SIMULATOR
                       ========================================== */}
                    {activeTab === "scenario" && (
                      <div className="animate-fadeIn">
                        <ScenarioSimulatorModule
                          selectedField={selectedField}
                          language={language}
                        />
                      </div>
                    )}

                    {/* ==========================================
                        TAB 16: SUSTAINABILITY ESG SCORE
                       ========================================== */}
                    {activeTab === "sustainability" && (
                      <div className="animate-fadeIn">
                        <SustainabilityDashboard
                          selectedField={selectedField}
                          language={language}
                        />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </PullToRefreshContainer>
      </div>
    </div>


      {/* =========================================================================
          2. MOBILE INTERFACE LAYOUT (lg-hidden)
          ========================================================================= */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Top Header Navbar */}
        <Navbar
          mode={mode}
          setMode={setMode}
          language={language}
          setLanguage={setLanguage}
          fields={fields}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          alerts={alerts}
          onOpenAlerts={() => {
            setMode("standard");
            setActiveTab("alerts");
          }}
          apiConnected={!weatherError}
          onOpenApiHealth={() => {
            setMode("researcher");
          }}
          installPromptAvailable={false}
          onInstallPwa={() => {}}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onOpenAiSummary={() => {
            setMode("standard");
            setActiveTab("aiSummary");
          }}
          onOpenEmailDesk={() => {
            setMode("standard");
            setActiveTab("emailDesk");
          }}
          onOpenSatellite={() => {
            setMode("standard");
            navigateWithTransition("satellite");
          }}
          onOpenThemeModal={() => setThemeModalOpen(true)}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
          onRefreshFields={() => fetchServerFields(true)}
          isRefreshing={isRefreshing}
        />

        {/* Mobile Active Module Title Bar (Hidden in Farmer Mode for clutter-free simplicity) */}
        {mode !== "farmer" && (
          <div className="lg:hidden px-4 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sticky top-16 z-30 backdrop-blur-xs">
            <div className="flex items-center gap-2 min-w-0">
              {activeTab !== "dashboard" && (
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-600/25 active:scale-95 transition cursor-pointer shrink-0 font-bangla"
                  title={isBn ? "পূর্বের পেজে ফিরে যান" : "Go Back"}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>{isBn ? "পেছনে" : "Back"}</span>
                </button>
              )}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-extrabold text-slate-900 dark:text-slate-100 font-display truncate">
                {tabs.find((t) => t.id === activeTab)?.[isBn ? "labelBn" : "labelEn"] || (isBn ? "ড্যাশবোর্ড" : "Dashboard")}
              </span>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white font-bold text-[11px] shadow-2xs hover:bg-emerald-800 transition cursor-pointer shrink-0"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{isBn ? "সকল মডিউল" : "All Modules"}</span>
            </button>
          </div>
        )}

        {/* Main Content Viewport */}
        <PullToRefreshContainer onRefresh={handleGlobalPullRefresh} isBn={isBn}>
          <main className="flex-1 p-4 space-y-6">
          <BangladeshCultureBanner language={language} />

          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-${mode}-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {mode === "farmer" && (
                <FarmerModeView
                  field={selectedField}
                  language={language}
                  weather={weather}
                  soil={soil}
                  irrigation={irrigation}
                  alerts={alerts}
                  onOpenExplainability={() => setExplainabilityOpen(true)}
                  onOpenCropDoctor={() => {
                    setMode("standard");
                    setActiveTab("crop_doctor");
                  }}
                  onSwitchToStandard={() => setMode("standard")}
                />
              )}

              {mode === "researcher" && (
                <ResearcherModeView
                  selectedField={selectedField}
                  weather={weather}
                  soil={soil}
                  language={language}
                />
              )}

              {mode === "standard" && (
                <>
                  {/* TAB 1: OVERVIEW DASHBOARD */}
                  {activeTab === "dashboard" && (
                    <MainDashboard
                      selectedField={selectedField}
                      weather={weather}
                      soil={soil}
                      irrigation={irrigation}
                      language={language}
                      onNavigateTab={setActiveTab}
                      onOpenExplainability={() => setExplainabilityOpen(true)}
                    />
                  )}

                  {/* TAB 2: AI FARMER BRIEFING */}
                  {activeTab === "aiSummary" && (
                    <div className="space-y-4 animate-fadeIn">
                      <FarmerAiSummaryModule
                        field={selectedField}
                        weather={weather}
                        soil={soil}
                        irrigation={irrigation}
                        language={language}
                      />
                    </div>
                  )}

                  {/* TAB 3: AI CROP DOCTOR */}
                  {activeTab === "crop_doctor" && (
                    <CropDoctorModule
                      language={language}
                      selectedField={selectedField}
                    />
                  )}

                  {/* TAB 4: SMART IRRIGATION */}
                  {activeTab === "irrigation" && (
                    <div className="animate-fadeIn">
                      <SmartIrrigationEngine
                        field={selectedField}
                        irrigation={irrigation}
                        onOpenExplainability={() => setExplainabilityOpen(true)}
                        language={language}
                      />
                    </div>
                  )}

                  {/* TAB 5: CROP DIGITAL TWIN SIMULATOR */}
                  {activeTab === "cropDigitalTwin" && (
                    <div className="animate-fadeIn">
                      <CropDigitalTwinModule
                        selectedField={selectedField}
                        language={language}
                      />
                    </div>
                  )}

                  {/* TAB 6: AUTOMATED EMAIL DESK */}
                  {activeTab === "emailDesk" && (
                    <div className="animate-fadeIn">
                      <EmailAutomationModule
                        selectedField={selectedField}
                        weather={weather}
                        irrigation={irrigation}
                        language={language}
                      />
                    </div>
                  )}

                  {/* TAB 7: CELL ALERTS DISPATCH */}
                  {activeTab === "alerts" && (
                    <div className="animate-fadeIn">
                      <AlertCenterModule
                        selectedField={selectedField}
                        language={language}
                        onRefreshFields={() => fetchServerFields(true)}
                      />
                    </div>
                  )}

                  {/* TAB 8: GIS FIELD MAP */}
                  {activeTab === "map" && (
                    <div className="animate-fadeIn">
                      <FieldMap
                        fields={fields}
                        selectedField={selectedField}
                        onSelectField={setSelectedField}
                        language={language}
                      />
                    </div>
                  )}

                  {/* TAB 9: SOIL INTELLIGENCE */}
                  {activeTab === "soil" && (
                    <div className="animate-fadeIn">
                      <SoilIntelligenceModule
                        soilData={soil}
                        loading={soilLoading}
                        language={language}
                        selectedField={selectedField}
                        onRefresh={() => {
                          const [lat, lon] = selectedField.coordinates;
                          fetchSoil(lat, lon);
                        }}
                      />
                    </div>
                  )}

                  {/* TAB 10: WEATHER INTELLIGENCE */}
                  {activeTab === "weather" && (
                    <div className="animate-fadeIn">
                      <WeatherModule
                        weather={weather}
                        loading={weatherLoading}
                        error={weatherError}
                        onRetry={() => {
                          const [lat, lon] = selectedField.coordinates;
                          fetchWeather(lat, lon);
                        }}
                        language={language}
                        selectedField={selectedField}
                      />
                    </div>
                  )}

                  {/* TAB 11: AGRO-MARKET AI */}
                  {activeTab === "market" && (
                    <MarketIntelligenceModule
                      language={language}
                      selectedField={selectedField}
                    />
                  )}

                  {/* TAB 12: SATELLITE NDVI */}
                  {activeTab === "satellite" && (
                    <div className="animate-fadeIn">
                      <SatelliteNDVIModule
                        selectedField={selectedField}
                        language={language}
                      />
                    </div>
                  )}

                  {/* TAB 13: 15-DAY RISKS */}
                  {activeTab === "risks" && (
                    <div className="animate-fadeIn">
                      <RiskTimelineModule
                        selectedField={selectedField}
                        weather={weather}
                        language={language}
                      />
                    </div>
                  )}

                  {/* TAB 14: WHAT-IF SIMULATOR */}
                  {activeTab === "scenario" && (
                    <div className="animate-fadeIn">
                      <ScenarioSimulatorModule
                        selectedField={selectedField}
                        language={language}
                      />
                    </div>
                  )}

                  {/* TAB 15: SUSTAINABILITY ESG */}
                  {activeTab === "sustainability" && (
                    <div className="animate-fadeIn">
                      <SustainabilityDashboard
                        selectedField={selectedField}
                        language={language}
                      />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </PullToRefreshContainer>

        {/* Floating Menu FAB for Mobile Screens (Hidden in Farmer mode) */}
        {mode !== "farmer" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#1B4332] dark:bg-emerald-600 text-white rounded-full p-3.5 shadow-xl border border-emerald-400/30 flex items-center gap-2 cursor-pointer font-bold text-xs tracking-wide group"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5 text-amber-300" />
            <span className="pr-1">{isBn ? "মেনু" : "Menu"}</span>
          </motion.button>
        )}
      </div>

      {/* Slide-Out Navigation Drawer for Mobile Devices */}
      <MobileNavigationDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={navigateWithTransition}
        onGoBack={handleGoBack}
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
        fields={fields}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        alertsCount={alerts.length}
        onOpenAlerts={() => {
          setMode("standard");
          navigateWithTransition("alerts");
        }}
        onOpenAiSummary={() => {
          setMode("standard");
          navigateWithTransition("aiSummary");
        }}
        onOpenEmailDesk={() => {
          setMode("standard");
          navigateWithTransition("emailDesk");
        }}
        onOpenThemeModal={() => setThemeModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* AgriVision Transition Animation Overlay */}
      <AgriVisionTransitionOverlay
        isTransitioning={isTransitioning}
        moduleNameEn={targetModuleName.en}
        moduleNameBn={targetModuleName.bn}
        isBn={isBn}
      />

      {/* Transparent Reasoning Modal */}
      <ExplainabilityModal
        isOpen={explainabilityOpen}
        onClose={() => setExplainabilityOpen(false)}
        language={language}
        title={isBn ? "এফএও-৫৬ সেচ চাহিদা নিরূপণ মডেল" : "FAO-56 Crop Evapotranspiration & Irrigation Deficit Model"}
        formula={"NIR = (Kc × ET₀) - Peff"}
        inputs={[
          { label: "Reference Evapotranspiration (ET₀)", value: `${weather?.data?.daily?.et0_fao_evapotranspiration?.[0]?.toFixed(1) ?? "4.1"} mm/day`, source: "Open-Meteo Penman-Monteith" },
          { label: "Crop Coefficient (Kc)", value: `${selectedField.variety.includes("BRRI") ? "1.15" : "1.10"}`, source: "FAO-56 Table 12 (Mid-Season)" },
          { label: "Observed Soil Moisture", value: `${selectedField.currentMoisturePct}%`, source: "Calibrated Rhizosphere Sensor" },
          { label: "Effective Rainfall (Peff)", value: "0.0 mm", source: "USDA-SCS Empirical Deficit Method" },
        ]}
        logicSteps={[
          isBn
            ? "১. ওপেন-মেটিও থেকে সৌর বিকিরণ, তাপমাত্রা, আর্দ্রতা ও বায়ুর গতি দিয়ে দৈনিক ET₀ গণনা করা হয়েছে।"
            : "1. Computed daily reference evapotranspiration ET0 from solar radiation, air temp, humidity, and 10m wind speed.",
          isBn
            ? "২. ফসলের বর্তমান বৃদ্ধি পর্যায়ের Kc গুণাঙ্ক প্রয়োগ করে প্রকৃত পানির চাহিদা (ETc = Kc × ET₀) হিসাব করা হয়েছে।"
            : "2. Multiplied ET0 by crop growth stage coefficient (Kc) to derive potential crop transpiration flux (ETc).",
          isBn
            ? "৩. মাটির প্রাপ্য পানি ধারণক্ষমতা (TAW) ও সংকটহীন নিঃশেষণ সীমা (RAW) এর সাথে বর্তমান আর্দ্রতা তুলনা করা হয়েছে।"
            : "3. Compared current soil water storage against Readily Available Water (RAW) depletion threshold to schedule irrigation without yield stress.",
        ]}
        citation="Allen, R. G., Pereira, L. S., Raes, D., & Smith, M. (1998). Crop evapotranspiration: Guidelines for computing crop water requirements. FAO Irrigation and Drainage Paper 56."
        confidenceScore={94}
      />

      {/* Multi-Role Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        language={language}
        onRoleChanged={(role) => {
          if (role === "farmer") setMode("farmer");
          else if (role === "researcher") setMode("researcher");
          else setMode("standard");
        }}
      />

      {/* Theme & Visual Atmosphere Selector Modal */}
      <ThemeSelectorModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        language={language}
      />

      {/* Global Footer */}
      <footer className="bg-[#FCFAF7] dark:bg-[#122019] border-t border-[#E8E0D5] dark:border-[#22382D] py-6 px-4 text-xs text-[#6B6355] dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-bangla">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1B4332] dark:text-[#A7F3D0] font-display">AGRI-VISION DSS</span>
            <span>&bull;</span>
            <span>{isBn ? "স্মার্ট প্রিসিশন এগ্রিকালচার ডিসিশন সাপোর্ট সিস্টেম — বাংলাদেশ" : "Precision Agriculture Decision Support System"}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Open-Meteo Synoptic</span>
            <span>&bull;</span>
            <span>ISRIC SoilGrids 250m</span>
            <span>&bull;</span>
            <span>Copernicus Sentinel-2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AgriVisionCore />
      </AuthProvider>
    </ThemeProvider>
  );
}
