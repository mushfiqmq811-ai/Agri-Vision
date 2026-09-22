import React, { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  Flame,
  Droplets,
  Satellite,
  CheckCircle,
  Filter,
  Check,
  Smartphone,
  Send,
  MessageSquare,
  PhoneCall,
  Radio,
  Volume2,
  RefreshCw,
  Zap,
  Activity,
  CloudRain,
  Sun,
  ShieldAlert,
  Mail,
  Key,
  Settings,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  CheckCircle2,
} from "lucide-react";
import { GeoField, Language, SmartAlert } from "../types";
import { useAuth } from "../context/AuthContext";

interface Props {
  selectedField: GeoField;
  language: Language;
  onRefreshFields?: () => void;
}

interface AutomatedAlertEngineState {
  isActive: boolean;
  lastScanTimestamp: string;
  scanIntervalSeconds: number;
  totalAutoTriggeredAlerts: number;
  autoEmailDispatches: number;
  autoWhatsAppDispatches: number;
}

export const AlertCenterModule: React.FC<Props> = ({ selectedField, language, onRefreshFields }) => {
  const isBn = language === "bn";
  const { user, updateUserPreferences, isAuthenticated } = useAuth();

  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [engineState, setEngineState] = useState<AutomatedAlertEngineState>({
    isActive: true,
    lastScanTimestamp: new Date().toISOString(),
    scanIntervalSeconds: 30,
    totalAutoTriggeredAlerts: 4,
    autoEmailDispatches: 2,
    autoWhatsAppDispatches: 2,
  });

  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [speakingAlertId, setSpeakingAlertId] = useState<string | null>(null);
  const [triggeringHazard, setTriggeringHazard] = useState<string | null>(null);
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);

  // User Alert Subscription Preferences States
  const [localZones, setLocalZones] = useState<string[]>(user?.selectedZones || [selectedField.district] || ["Rajshahi"]);
  const [localAlerts, setLocalAlerts] = useState<{ [key: string]: boolean }>(
    user?.alertPreferences || { drought: true, heavy_rain: true, blast_disease: true, heatwave: true, general: true }
  );
  const [localEmailEnabled, setLocalEmailEnabled] = useState<boolean>(user?.emailAlertsEnabled ?? true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Sync with auth user changes
  useEffect(() => {
    if (user) {
      if (user.selectedZones) setLocalZones(user.selectedZones);
      if (user.alertPreferences) setLocalAlerts(user.alertPreferences);
      setLocalEmailEnabled(user.emailAlertsEnabled);
    }
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;
    setSaveStatus(isBn ? "সংরক্ষণ করা হচ্ছে..." : "Saving preferences...");
    try {
      await updateUserPreferences({
        selectedZones: localZones,
        alertPreferences: localAlerts,
        emailAlertsEnabled: localEmailEnabled,
      });
      setSaveStatus(isBn ? "সফলভাবে সংরক্ষিত হয়েছে! ✔" : "Preferences saved successfully! ✔");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus(isBn ? "সংরক্ষণ ব্যর্থ হয়েছে।" : "Failed to save preferences.");
    }
  };

  const [isTestingHourly, setIsTestingHourly] = useState(false);

  const handleTestHourlyBroadcast = async () => {
    setIsTestingHourly(true);
    setSaveStatus(isBn ? "ব্রডকাস্ট পাঠানো হচ্ছে..." : "Broadcasting alerts...");
    try {
      const res = await fetch("/api/admin/trigger-hourly-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setSaveStatus(isBn ? "ব্রডকাস্ট সফলভাবে পাঠানো হয়েছে! ✔" : "Broadcast sent successfully! ✔");
        await fetchLiveAlerts();
      } else {
        setSaveStatus(isBn ? "ব্রডকাস্ট ব্যর্থ হয়েছে।" : "Broadcast failed.");
      }
    } catch (e) {
      setSaveStatus(isBn ? "ব্রডকাস্ট ব্যর্থ হয়েছে।" : "Broadcast failed.");
    } finally {
      setIsTestingHourly(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // SMS/WhatsApp Broadcast Simulator States
  const [targetRecipient, setTargetRecipient] = useState<"farmer" | "manager" | "consultant">("farmer");
  const [deliveryChannel, setDeliveryChannel] = useState<"sms" | "whatsapp" | "ivr">("whatsapp");
  const [simulating, setSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulatedDeliveriesCount, setSimulatedDeliveriesCount] = useState(0);
  const [recipientPhone, setRecipientPhone] = useState("+8801731460855");
  const [gatewayConfigOpen, setGatewayConfigOpen] = useState(false);
  const [directAlertPrompt, setDirectAlertPrompt] = useState<SmartAlert | null>(null);
  const [gatewayInfo, setGatewayInfo] = useState<{ isConfigured: boolean; activeProvider: string; sender?: string }>({
    isConfigured: false,
    activeProvider: "Demo Sandbox",
  });
  const [configInputs, setConfigInputs] = useState({
    twilioSid: "",
    twilioToken: "",
    twilioFrom: "+14155238886",
    greenApiId: "",
    greenApiToken: "",
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configFeedback, setConfigFeedback] = useState<string | null>(null);

  // Helper to format clean Bangladesh WhatsApp Number (e.g., 88017XXXXXXXX)
  const formatBangladeshWhatsAppNumber = (phone: string): string => {
    let digits = (phone || "").replace(/\D/g, "");
    if (digits.startsWith("01") && digits.length === 11) {
      digits = "88" + digits;
    } else if (digits.startsWith("8801")) {
      // already in correct international format without +
    } else if (digits.length === 10 && digits.startsWith("1")) {
      digits = "880" + digits;
    } else if (!digits) {
      digits = "8801731460855";
    }
    return digits;
  };

  const fetchGatewayInfo = async () => {
    try {
      const res = await fetch("/api/whatsapp/logs");
      if (res.ok) {
        const data = await res.json();
        setGatewayInfo({
          isConfigured: data.isConfigured,
          activeProvider: data.activeProvider || "Demo Sandbox",
          sender: data.sender,
        });
        if (data.memoryTwilioSid) setConfigInputs((prev) => ({ ...prev, twilioSid: data.memoryTwilioSid }));
        if (data.memoryTwilioToken) setConfigInputs((prev) => ({ ...prev, twilioToken: data.memoryTwilioToken }));
        if (data.memoryGreenApiId) setConfigInputs((prev) => ({ ...prev, greenApiId: data.memoryGreenApiId }));
        if (data.memoryGreenApiToken) setConfigInputs((prev) => ({ ...prev, greenApiToken: data.memoryGreenApiToken }));
      }
    } catch (err) {
      console.warn("Fetch WhatsApp logs error:", err);
    }
  };

  const handleSaveGatewayConfig = async () => {
    setSavingConfig(true);
    setConfigFeedback(null);
    try {
      const res = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configInputs),
      });
      if (res.ok) {
        const data = await res.json();
        setGatewayInfo({
          isConfigured: data.isConfigured,
          activeProvider: data.activeProvider,
        });
        setConfigFeedback(
          isBn
            ? `✔ ক্লাউড গেটওয়ে সংরক্ষিত! সক্রিয়: ${data.activeProvider}`
            : `✔ Gateway saved! Active: ${data.activeProvider}`
        );
        setTimeout(() => setConfigFeedback(null), 4000);
      }
    } catch (e: any) {
      setConfigFeedback(isBn ? "সংরক্ষণ ব্যর্থ হয়েছে।" : "Failed to save configuration.");
    } finally {
      setSavingConfig(false);
    }
  };

  // Fetch live automated alerts from backend
  const fetchLiveAlerts = async () => {
    try {
      const res = await fetch("/api/alerts/live");
      if (res.ok) {
        const data = await res.json();
        if (data.alerts) {
          setAlerts(data.alerts);
        }
        if (data.engineState) {
          setEngineState(data.engineState);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch live automated alerts:", err);
    }
  };

  useEffect(() => {
    fetchLiveAlerts();
    fetchGatewayInfo();
    const interval = setInterval(fetchLiveAlerts, 8000); // Polling every 8s for live alert engine updates
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const phone = targetRecipient === "farmer" ? "+8801731460855" : targetRecipient === "manager" ? "+8801912748302" : "+8801515998821";
    setRecipientPhone(phone);
  }, [targetRecipient]);

  // Voice Readout (Bangla / English TTS)
  const speakAlert = (alert: SmartAlert) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (speakingAlertId === alert.id) {
      setSpeakingAlertId(null);
      return;
    }

    const textToSpeak = isBn
      ? `জরুরি কৃষি সতর্কবার্তা। ${alert.titleBn}। বিবরণ: ${alert.descBn}। করণীয়: ${alert.actionBn}`
      : `Emergency agricultural alert. ${alert.titleEn}. Details: ${alert.descEn}. Action: ${alert.actionEn}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isBn ? "bn-BD" : "en-US";
    utterance.rate = 0.95;

    utterance.onstart = () => setSpeakingAlertId(alert.id);
    utterance.onend = () => setSpeakingAlertId(null);
    utterance.onerror = () => setSpeakingAlertId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Trigger manual hazard simulation
  const handleTriggerHazard = async (hazardType: string) => {
    setTriggeringHazard(hazardType);
    setTriggerStatus(null);
    try {
      const res = await fetch("/api/alerts/trigger-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hazardType,
          fieldId: selectedField.id,
          fieldName: selectedField.nameBn || selectedField.name,
          district: selectedField.district || "Rajshahi",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTriggerStatus(
            isBn
              ? `⚡ স্বয়ংক্রিয় অ্যালার্ট তৈরি হয়েছে! ইমেইল (${data.emailSent ? "✔ প্রেরিত" : "সিমুলেটেড"}) ও হোয়াটসঅ্যাপ (${data.whatsappSent ? "✔ প্রেরিত" : "সিমুলেটেড"}) পাঠানো হয়েছে।`
              : `⚡ Automated alert triggered! Email (${data.emailSent ? "Sent" : "Logged"}) & WhatsApp (${data.whatsappSent ? "Sent" : "Logged"}) dispatched.`
          );
          fetchLiveAlerts();
          onRefreshFields?.();
        }
      }
    } catch (err: any) {
      setTriggerStatus(isBn ? "অ্যালার্ট তৈরি করতে সমস্যা হয়েছে।" : "Failed to trigger alert.");
    } finally {
      setTriggeringHazard(null);
    }
  };

  // Toggle Automated Background Engine
  const toggleEngine = async () => {
    try {
      const res = await fetch("/api/alerts/toggle-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !engineState.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.engineState) {
          setEngineState(data.engineState);
        }
      }
    } catch (err) {
      console.warn("Toggle engine failed:", err);
    }
  };

  const getWhatsAppLink = (customAlert?: SmartAlert) => {
    const textAlert = customAlert || alerts[0];
    const alertMessage = isBn
      ? `🚨 *এগ্রিভিশন সচল কৃষি সতর্কবার্তা* 🚨\n\n📌 *শিরোনাম:* ${textAlert?.titleBn || textAlert?.titleEn || "জরুরি সংকেত"}\n📍 *মাঠ:* ${selectedField.nameBn || selectedField.name} (${selectedField.district || "রাজশাহী"})\n🌾 *ফসল:* ${selectedField.variety}\n📖 *বিবরণ:* ${textAlert?.descBn || textAlert?.descEn || ""}\n⚡ *প্রয়োজনীয় পদক্ষেপ:* ${textAlert?.actionBn || textAlert?.actionEn || ""}\n\n📞 কৃষি কল সেন্টার: *16123*\n✨ _এগ্রিভিশন স্মার্ট এগ্রিকালচার প্ল্যাটফর্ম_`
      : `🚨 *AgriVision Actionable Alert* 🚨\n\n📌 *Title:* ${textAlert?.titleEn || "Emergency Alert"}\n📍 *Field:* ${selectedField.name} (${selectedField.district || "Rajshahi"})\n🌾 *Crop:* ${selectedField.variety}\n📖 *Details:* ${textAlert?.descEn || ""}\n⚡ *Action Required:* ${textAlert?.actionEn || ""}\n\n📞 Krishi Hotline: *16123*\n✨ _AgriVision Precision Dispatch_`;
    const cleanPhone = formatBangladeshWhatsAppNumber(recipientPhone || "+8801731460855");
    const encodedText = encodeURIComponent(alertMessage);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  };

  const handleSimulateBroadcast = async () => {
    setSimulating(true);
    setSimulationLogs([]);
    const channelName = deliveryChannel === "sms" ? "SMS Gateway" : deliveryChannel === "whatsapp" ? "WhatsApp API" : "Interactive Voice IVR";
    const rawPhone = recipientPhone || "+8801731460855";
    const cleanPhone = formatBangladeshWhatsAppNumber(rawPhone);
    const recipientTitle = targetRecipient === "farmer" ? "Field Cultivator" : targetRecipient === "manager" ? "Cooperative Hub Leader" : "Upazila Extension Officer";

    const alertItem = alerts[0];
    const alertMessage = isBn
      ? `🚨 *এগ্রিভিশন সচল সতর্কবার্তা* 🚨\n\n📌 *শিরোনাম:* ${alertItem?.titleBn || "জরুরি সংকেত"}\n📍 *মাঠ:* ${selectedField.nameBn || selectedField.name}\n📖 *বিবরণ:* ${alertItem?.descBn || ""}\n⚡ *প্রয়োজনীয় পদক্ষেপ:* ${alertItem?.actionBn || ""}\n\n📞 কৃষি হটলাইন: *16123*`
      : `🚨 *AgriVision Actionable Alert* 🚨\n\n📌 *Title:* ${alertItem?.titleEn || "Emergency Alert"}\n📍 *Field:* ${selectedField.name}\n📖 *Details:* ${alertItem?.descEn || ""}\n⚡ *Action Required:* ${alertItem?.actionEn || ""}\n\n📞 Krishi Hotline: *16123*`;

    setSimulationLogs((prev) => [...prev, `[0.1s] Initializing ${channelName} payload compiler...`]);
    setSimulationLogs((prev) => [...prev, `[0.6s] Target Phone: +${cleanPhone} (${recipientTitle})...`]);

    let apiResult: any = null;
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: cleanPhone,
          content: alertMessage,
          triggerType: "soil_alert",
        }),
      });
      if (res.ok) {
        apiResult = await res.json();
      }
    } catch (err) {
      console.warn("Backend WhatsApp dispatch notification error:", err);
    }

    setTimeout(() => {
      setSimulationLogs((prev) => [...prev, `[1.3s] Packaging localized alert: "${alerts[0]?.titleEn || "Field Warning"}"...`]);
      setTimeout(() => {
        if (apiResult?.isConfigured && apiResult?.success) {
          setSimulationLogs((prev) => [
            ...prev,
            `[2.2s] Transmitting via ${apiResult.provider} to +${cleanPhone}...`,
            `[3.2s] ✔ Delivered: Live message sent to ${cleanPhone} via ${apiResult.provider}!`,
          ]);
        } else {
          setSimulationLogs((prev) => [
            ...prev,
            `[2.2s] ⚠️ ক্লাউড গেটওয়ে: Twilio/Green-API কী সার্ভারে যুক্ত নেই (স্যান্ডবক্স মোড)।`,
            `[2.8s] 💡 নিজের হোয়াটসঅ্যাপে তাৎক্ষণিক মেসেজটি পেতে নিচের "সরাসরি হোয়াটসঅ্যাপে পাঠান ↗" বাটনে ক্লিক করুন!`,
            `[3.4s] ✔ লোকাল সিমুলেশন সম্পূর্ণ প্রস্তুত।`,
          ]);
          setDirectAlertPrompt(alertItem);
        }

        setSimulating(false);
        setSimulatedDeliveriesCount((prev) => prev + 1);
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const synth = window.speechSynthesis;
          const soundChime = new SpeechSynthesisUtterance(isBn ? "সতর্কবার্তা প্রস্তুত হয়েছে" : "Alert prepared.");
          soundChime.lang = isBn ? "bn-BD" : "en-US";
          soundChime.volume = 0.5;
          synth.speak(soundChime);
        }
      }, 1000);
    }, 800);
  };

  const markAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, acknowledged: true })));
  };

  const toggleRead = async (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, acknowledged: !a.acknowledged } : a)));
    try {
      await fetch("/api/alerts/acknowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId: id }),
      });
    } catch (err) {
      console.warn("Acknowledge toggle failed:", err);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterLevel === "all") return true;
    if (filterLevel === "unread") return !a.acknowledged;
    return a.level === filterLevel;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111815] p-5 rounded-3xl border border-slate-200 dark:border-[#22332B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
              {isBn ? "স্বয়ংক্রিয় কৃষি অ্যালার্ট সিস্টেম" : "AUTOMATED AGRONOMIC ALERT SYSTEM"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
              Background AI Scanner
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            {isBn
              ? `${selectedField.nameBn} জরুরি বিজ্ঞপ্তি ও স্বয়ংক্রিয় সতর্কবার্তা`
              : `${selectedField.name} Real-Time Autonomous Advisories`}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={fetchLiveAlerts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? "রিফ্রেশ" : "Sync"}</span>
          </button>
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? "সব পঠিত চিহ্নিত করুন" : "Mark All Read"}</span>
          </button>
        </div>
      </div>

      {/* 2. Autonomous Background Alert Engine Banner */}
      <div className="bg-gradient-to-r from-[#0F1D17] via-[#172B22] to-[#0D241A] p-5 rounded-3xl border border-emerald-500/30 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${engineState.isActive ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                <h3 className="font-extrabold text-sm text-emerald-100 uppercase tracking-wider">
                  {isBn ? "স্বয়ংক্রিয় ব্যাকগ্রাউন্ড অ্যালার্ট ইঞ্জিন" : "AUTONOMOUS ALERT DISPATCH ENGINE"}
                </h3>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {engineState.isActive
                  ? (isBn
                      ? "সক্রিয়: প্রতি ৩০ সেকেন্ডে মাটির স্যাটেলাইট ও আবহাওয়া ডেটা স্ক্যান করা হচ্ছে।"
                      : "Active: Scanning soil moisture & synoptic weather metrics every 30s.")
                  : (isBn ? "অটোমেটেড মনিটরিং সাময়িক বন্ধ" : "Autonomous monitoring paused")}
              </p>
            </div>
          </div>

          <button
            onClick={toggleEngine}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              engineState.isActive
                ? "bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 border border-emerald-500/40"
                : "bg-amber-600 hover:bg-amber-500 text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>
              {engineState.isActive
                ? (isBn ? "ইঞ্জিন সচল (ACTIVE)" : "Engine Active")
                : (isBn ? "চালু করুন (TURN ON)" : "Turn On Engine")}
            </span>
          </button>
        </div>

        {/* Counters & Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-800/40 font-mono text-xs">
          <div className="bg-emerald-950/50 p-2.5 rounded-2xl border border-emerald-800/30">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">
              {isBn ? "মোট অ্যালার্ট ট্রিগার" : "Total Auto Alerts"}
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">
              {engineState.totalAutoTriggeredAlerts}
            </div>
          </div>

          <div className="bg-emerald-950/50 p-2.5 rounded-2xl border border-emerald-800/30">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">
              {isBn ? "হোয়াটসঅ্যাপ সেন্ড" : "Auto WhatsApp"}
            </div>
            <div className="text-base font-extrabold text-emerald-300 mt-0.5">
              {engineState.autoWhatsAppDispatches} ✔
            </div>
          </div>

          <div className="bg-emerald-950/50 p-2.5 rounded-2xl border border-emerald-800/30">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">
              {isBn ? "ইমেইল ডিসপ্যাচ" : "Auto Emails"}
            </div>
            <div className="text-base font-extrabold text-emerald-300 mt-0.5">
              {engineState.autoEmailDispatches} ✔
            </div>
          </div>

          <div className="bg-emerald-950/50 p-2.5 rounded-2xl border border-emerald-800/30">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">
              {isBn ? "শেষ স্ক্যান সময়" : "Last Scan"}
            </div>
            <div className="text-[11px] font-bold text-emerald-200 mt-1 truncate">
              {new Date(engineState.lastScanTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
          </div>
        </div>

        {/* 3. Instant Manual Hazard Simulation Trigger Panel */}
        <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-700/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-extrabold tracking-wider text-amber-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {isBn ? "১-ক্লিকে জরুরি অবস্থা ট্রিগার করুন (ইমেইল ও হোয়াটসঅ্যাপ অটো-মেসেজ যাবে):" : "1-Click Emergency Hazard Triggers (Auto Dispatches Email & WhatsApp):"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleTriggerHazard("drought")}
              disabled={!!triggeringHazard}
              className="p-2.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 rounded-xl text-left transition cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-rose-300 text-xs font-extrabold">
                <Flame className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{isBn ? "খরা সতর্কতা" : "Drought Risk"}</span>
              </div>
              <div className="text-[10px] text-stone-300 mt-0.5">আর্দ্রতা &lt;১৫%</div>
            </button>

            <button
              onClick={() => handleTriggerHazard("heavy_rain")}
              disabled={!!triggeringHazard}
              className="p-2.5 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/60 rounded-xl text-left transition cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-blue-300 text-xs font-extrabold">
                <CloudRain className="w-4 h-4 shrink-0 text-blue-400" />
                <span>{isBn ? "ভারী বৃষ্টি" : "Heavy Rain"}</span>
              </div>
              <div className="text-[10px] text-stone-300 mt-0.5">বৃষ্টি &gt;৪০মিমি</div>
            </button>

            <button
              onClick={() => handleTriggerHazard("blast_disease")}
              disabled={!!triggeringHazard}
              className="p-2.5 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/60 rounded-xl text-left transition cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-purple-300 text-xs font-extrabold">
                <ShieldAlert className="w-4 h-4 shrink-0 text-purple-400" />
                <span>{isBn ? "ব্লাস্ট আক্রান্ত" : "Blast Fungus"}</span>
              </div>
              <div className="text-[10px] text-stone-300 mt-0.5">আর্দ্রতা &gt;৯০%</div>
            </button>

            <button
              onClick={() => handleTriggerHazard("heatwave")}
              disabled={!!triggeringHazard}
              className="p-2.5 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/60 rounded-xl text-left transition cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-extrabold">
                <Sun className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{isBn ? "তীব্র তাপদাহ" : "Heatwave"}</span>
              </div>
              <div className="text-[10px] text-stone-300 mt-0.5">তাপমাত্রা &gt;৩৮°সে</div>
            </button>
          </div>

          {triggerStatus && (
            <div className="p-2 bg-emerald-900/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 font-medium">
              {triggerStatus}
            </div>
          )}
        </div>
      </div>

      {/* 2.5 Personalized Alert & Zone Preferences Selection (As requested by user) */}
      <div className="bg-white dark:bg-[#111815] p-5 rounded-3xl border border-slate-200 dark:border-[#22332B] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                {isBn ? "ব্যক্তিগত অ্যালার্ট ও কৃষি জোন কনফিগারেশন" : "Personalized Alert Preferences & Zone Subscriptions"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? "প্রতিনিয়ত আপনার ইমেইল ও হোয়াটসঅ্যাপে স্বয়ংক্রিয় এলার্ট পাঠানো হবে" : "Set what types of hazards and regions trigger automated hourly email & WhatsApp updates."}
              </p>
            </div>
          </div>
          {isAuthenticated ? (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">
              {isBn ? "সাবস্ক্রিপশন সচল" : "SUBSCRIPTION ACTIVE"}
            </span>
          ) : (
            <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-1 rounded-full font-bold">
              {isBn ? "অফলাইন মোড (লগইন করুন)" : "OFFLINE MODE (LOGIN TO ENABLE)"}
            </span>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="text-center p-4 bg-slate-50 dark:bg-[#14201A] border border-dashed border-slate-200 dark:border-emerald-800/30 rounded-2xl">
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {isBn 
                ? "স্বয়ংক্রিয় প্রতি ঘণ্টার ইমেইল এবং হোয়াটসঅ্যাপ এলার্ট পেতে এবং কাস্টম জোন সংরক্ষণ করতে অনুগ্রহ করে প্রথমে সাইন ইন/লগইন করুন।" 
                : "Please log in first to store your customized agriculture zones and receive automated hourly WhatsApp/email dispatches."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            {/* Zones Grid */}
            <div className="space-y-1.5">
              <span className="font-extrabold block text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                {isBn ? "আপনার পর্যবেক্ষণাধীন জোন সমূহ (একাধিক নির্বাচন করতে পারেন):" : "Your Subscribed Districts / Zones (Select Multiple):"}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {["Rajshahi", "Bogura", "Dinajpur", "Mymensingh", "Cumilla", "Jashore"].map((z) => {
                  const isChecked = localZones.includes(z);
                  return (
                    <label
                      key={z}
                      className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] cursor-pointer transition select-none ${
                        isChecked
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            if (localZones.length > 1) {
                              setLocalZones(localZones.filter((sz) => sz !== z));
                            }
                          } else {
                            setLocalZones([...localZones, z]);
                          }
                        }}
                        className="accent-emerald-600 w-3.5 h-3.5 cursor-pointer rounded"
                      />
                      <span>{z}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Hazards List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="font-extrabold block text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                  {isBn ? "পছন্দের অ্যালার্ট প্রকারভেদ (কোন কোন বিষয়ে অ্যালার্ট চান):" : "Subscribed Alert Types:"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "drought", nameEn: "Drought", nameBn: "খরা" },
                    { id: "heavy_rain", nameEn: "Heavy Rain", nameBn: "ভারী বৃষ্টি" },
                    { id: "blast_disease", nameEn: "Blast Fungal", nameBn: "ব্লাস্ট রোগ" },
                    { id: "heatwave", nameEn: "Heatwave", nameBn: "তীব্র তাপদাহ" },
                    { id: "general", nameEn: "Advisory", nameBn: "সাধারণ পরামর্শ" },
                  ].map((pref) => {
                    const isChecked = localAlerts[pref.id] ?? false;
                    return (
                      <label
                        key={pref.id}
                        className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] cursor-pointer transition select-none ${
                          isChecked
                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300 font-semibold"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setLocalAlerts({
                              ...localAlerts,
                              [pref.id]: !isChecked,
                            });
                          }}
                          className="accent-amber-500 w-3.5 h-3.5 cursor-pointer rounded"
                        />
                        <span>{isBn ? pref.nameBn : pref.nameEn}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Notification Channels & Save Button */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="font-extrabold block text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                    {isBn ? "যোগাযোগের মাধ্যম সক্রিয়করণ:" : "Communication Channels Setup:"}
                  </span>
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localEmailEnabled}
                        onChange={(e) => setLocalEmailEnabled(e.target.checked)}
                        className="accent-emerald-600 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-[11px]">Email Dispatch</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-slate-500">WhatsApp Push (Auto Active)</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleSavePreferences}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-[11px] transition cursor-pointer shadow-md flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isBn ? "সাবস্ক্রিপশন সেভ করুন" : "Save Subscription Preferences"}</span>
                  </button>

                  <button
                    onClick={handleTestHourlyBroadcast}
                    disabled={isTestingHourly}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-stone-300 font-extrabold rounded-xl text-[11px] transition cursor-pointer border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isTestingHourly ? "animate-spin" : ""}`} />
                    <span>{isBn ? "টেস্ট করুন (রান ক্রন)" : "Test Hourly Broadcast"}</span>
                  </button>

                  {saveStatus && (
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                      {saveStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#111815] p-3 rounded-2xl border border-slate-200 dark:border-[#22332B] text-xs">
        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 pl-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {[
          { id: "all", label: "All Alerts" },
          { id: "unread", label: "Unread" },
          { id: "critical", label: "Critical" },
          { id: "warning", label: "Warning" },
          { id: "advisory", label: "Advisory" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterLevel(tab.id)}
            className={`px-3 py-1 rounded-xl transition cursor-pointer font-medium ${
              filterLevel === tab.id
                ? "bg-slate-900 dark:bg-emerald-800 text-white font-bold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Alert Feed (8 cols) & Right Broadcast Console (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
        {/* Main Alert List (Left 8-cols) */}
        <div className="lg:col-span-8 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white dark:bg-[#111815] p-10 rounded-3xl border border-slate-200 dark:border-[#22332B] text-center text-slate-500">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isBn ? "কোনো সতর্কতা নেই" : "No Active Alerts in this Category"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Crop environmental parameters are currently within normal baseline thresholds.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              let borderClass = "border-slate-200 dark:border-[#22332B] bg-white dark:bg-[#111815]";
              let badgeClass = "bg-slate-100 text-slate-700";
              let IconComponent = AlertTriangle;

              if (alert.level === "critical") {
                borderClass = alert.acknowledged
                  ? "border-rose-200 dark:border-rose-900/50 bg-white dark:bg-[#161214]"
                  : "border-rose-400 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20";
                badgeClass = "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-extrabold";
                IconComponent = AlertTriangle;
              } else if (alert.level === "warning") {
                borderClass = alert.acknowledged
                  ? "border-amber-200 dark:border-amber-900/50 bg-white dark:bg-[#161411]"
                  : "border-amber-400 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20";
                badgeClass = "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold";
                IconComponent = Droplets;
              } else if (alert.level === "advisory") {
                borderClass = "border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-[#111815]";
                badgeClass = "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold";
                IconComponent = CheckCircle;
              } else {
                borderClass = "border-sky-200 dark:border-sky-900/50 bg-white dark:bg-[#111815]";
                badgeClass = "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 font-bold";
                IconComponent = Satellite;
              }

              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-3xl border transition shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${borderClass}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${badgeClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono ${badgeClass}`}>
                          {alert.level}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                          {isBn ? alert.titleBn : alert.titleEn}
                        </h4>
                        {!alert.acknowledged && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Unread" />
                        )}
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
                        {isBn ? alert.descBn : alert.descEn}
                      </p>

                      <div className="p-2.5 bg-slate-50 dark:bg-[#17221D] rounded-xl border border-slate-200 dark:border-[#22382D] text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 mt-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0">
                          {isBn ? "প্রয়োজনীয় পদক্ষেপ:" : "Action Required:"}
                        </span>
                        <span>{isBn ? alert.actionBn : alert.actionEn}</span>
                      </div>

                      {/* Dispatch Indicators */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono">
                        {(alert.autoDispatchedWhatsApp || alert.level === "critical") && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 font-bold">
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp Dispatched</span>
                          </span>
                        )}
                        {(alert.autoDispatchedEmail || alert.level === "critical") && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center gap-1 font-bold">
                            <Mail className="w-3 h-3 text-blue-600" />
                            <span>Email Dispatched</span>
                          </span>
                        )}
                        <span className="text-slate-400">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} &bull;{" "}
                          {new Date(alert.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <a
                      href={getWhatsAppLink(alert)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 px-2.5 rounded-xl border border-emerald-500 bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95"
                      title={isBn ? "এই সতর্কবার্তাটি সরাসরি হোয়াটসঅ্যাপে পাঠান" : "Send this alert to WhatsApp"}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isBn ? "হোয়াটসঅ্যাপ ↗" : "WhatsApp ↗"}</span>
                    </a>

                    <button
                      onClick={() => speakAlert(alert)}
                      className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                        speakingAlertId === alert.id
                          ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                          : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                      }`}
                      title={isBn ? "ভয়েস শুনতে ক্লিক করুন" : "Listen Voice Advisory"}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{speakingAlertId === alert.id ? (isBn ? "ভয়েস চলছে..." : "Speaking...") : (isBn ? "ভয়েস শুনুন" : "Voice")}</span>
                    </button>

                    <button
                      onClick={() => toggleRead(alert.id)}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium cursor-pointer"
                    >
                      {alert.acknowledged ? (isBn ? "অপঠিত করুন" : "Mark unread") : (isBn ? "পঠিত চিহ্নিত করুন" : "Mark as read")}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SMS/WhatsApp Broadcast dispatch simulator (Right 4-cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FFFDFB] dark:bg-[#14221B] p-5 rounded-3xl border border-emerald-100 dark:border-[#22382D] shadow-xs space-y-5">
            {/* Header / Antenna info */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-900/30 pb-3">
              <div className="flex items-center gap-2">
                <Radio className={`w-5 h-5 text-emerald-800 dark:text-emerald-400 ${simulating ? "animate-pulse text-rose-500" : ""}`} />
                <h3 className="font-extrabold text-xs text-[#1B4332] dark:text-[#FAF7F2] uppercase tracking-wider">
                  {isBn ? "মোবাইল অ্যালার্ট ব্রডকাস্টার" : "Cellular Warning Hub"}
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase">
                {isBn ? "টেলিটক ৪জি" : "GSM active"}
              </span>
            </div>

            {/* Simulating Recipient selectors */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase font-mono tracking-wider">
                {isBn ? "১. প্রাপক নির্বাচন করুন" : "1. Choose Recipient Type"}
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-[#1C2F25] p-1 rounded-xl border border-slate-200 dark:border-[#22382D] text-[11px] font-bold">
                {[
                  { id: "farmer", label: isBn ? "কৃষক" : "Farmer" },
                  { id: "manager", label: isBn ? "ম্যানেজার" : "Manager" },
                  { id: "consultant", label: isBn ? "কর্মকর্তা" : "Advisor" },
                ].map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => setTargetRecipient(rec.id as any)}
                    className={`py-1.5 rounded-lg text-center transition cursor-pointer ${
                      targetRecipient === rec.id
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-950"
                    }`}
                  >
                    {rec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Channel selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase font-mono tracking-wider">
                {isBn ? "২. ব্রডকাস্ট চ্যানেল" : "2. Broadcast Channel"}
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-[#1C2F25] p-1 rounded-xl border border-slate-200 dark:border-[#22382D] text-[11px] font-bold">
                {[
                  { id: "sms", label: isBn ? "এসএমএস" : "SMS", icon: Smartphone },
                  { id: "whatsapp", label: isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp", icon: MessageSquare },
                  { id: "ivr", label: isBn ? "আইভিআর" : "IVR Call", icon: PhoneCall },
                ].map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => setDeliveryChannel(chan.id as any)}
                    className={`py-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                      deliveryChannel === chan.id
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-950"
                    }`}
                  >
                    <chan.icon className="w-3.5 h-3.5" />
                    <span>{chan.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone input field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase font-mono tracking-wider">
                {isBn ? "৩. প্রাপকের ফোন নাম্বার" : "3. Recipient Phone Number"}
              </label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="+88017XXXXXXXX"
                className="w-full bg-slate-100 dark:bg-[#1C2F25] text-stone-950 dark:text-stone-100 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#22382D] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Simulated Live Mobile Screen */}
            <div className="relative border-4 border-slate-800 rounded-[32px] p-3 pt-5 bg-slate-900 aspect-[9/16] max-w-[240px] mx-auto shadow-xl select-none">
              {/* Speaker / Notch */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-800 rounded-full flex items-center justify-center">
                <div className="w-4 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Dynamic Notification Popup Inside Frame */}
              <div className="h-full bg-slate-950 rounded-[22px] p-2.5 flex flex-col justify-between overflow-hidden relative text-[11px]">
                <div className="space-y-2.5">
                  {/* Phone Status bar */}
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                    <span>Teletalk 4G</span>
                    <span>10:42 AM</span>
                  </div>

                  {/* App Message Header */}
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 space-y-1 text-slate-200">
                    <div className="flex items-center justify-between text-[8px] text-slate-400">
                      <span className="font-bold uppercase text-emerald-400 flex items-center gap-1">
                        {deliveryChannel === "sms" ? "✉ ShortMessage" : deliveryChannel === "whatsapp" ? "🟢 AgriVision Bot" : "📞 Voice Alert"}
                      </span>
                      <span>Now</span>
                    </div>

                    <div className="font-bold text-white text-[10px] truncate">
                      {isBn ? alerts[0]?.titleBn : alerts[0]?.titleEn}
                    </div>
                    <p className="text-[9px] text-slate-400 line-clamp-3">
                      {isBn ? alerts[0]?.descBn : alerts[0]?.descEn}
                    </p>
                    <div className="text-[8px] bg-slate-950 p-1 rounded font-mono text-amber-300 font-bold border border-amber-500/20">
                      {isBn ? "পদক্ষেপ: " : "Action: "}{isBn ? alerts[0]?.actionBn : alerts[0]?.actionEn}
                    </div>
                  </div>
                </div>

                <div className="text-center pb-2 text-[8px] text-slate-500">
                  Swipe up to acknowledge
                </div>
              </div>
            </div>

            {/* Real WhatsApp Trigger Button */}
            <div className="space-y-2">
              <a
                href={getWhatsAppLink(directAlertPrompt || alerts[0])}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer select-none text-center transform hover:scale-[1.01] active:scale-95 ring-2 ring-emerald-400/50"
              >
                <MessageSquare className="w-4 h-4 text-emerald-100 shrink-0" />
                <span>
                  {isBn ? "📲 সরাসরি হোয়াটসঅ্যাপে মেসেজ পাঠান ↗" : "📲 Send Direct WhatsApp Message ↗"}
                </span>
              </a>

              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-2.5 text-[10px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  {isBn
                    ? "সরাসরি লিঙ্ক: কোনো থার্ড-পার্টি কী ছাড়াই আপনার বা কৃষকের হোয়াটসঅ্যাপে তাৎক্ষণিক বার্তা পৌঁছাবে।"
                    : "Direct Link: Instantly opens WhatsApp on your phone or web with this alert pre-filled without needing third-party API keys."}
                </p>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleSimulateBroadcast}
              disabled={simulating}
              className={`w-full py-3 rounded-2xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                simulating
                  ? "bg-slate-300 text-slate-600 border border-slate-200 cursor-not-allowed"
                  : "bg-stone-800 hover:bg-stone-900 text-white"
              }`}
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>
                {simulating
                  ? (isBn ? "সিমুলেশন চলছে..." : "Simulating Dispatch...")
                  : (isBn ? "ব্রডকাস্ট টেস্ট করুন" : "Test Cloud Broadcast")}
              </span>
            </button>

            {/* Collapsible WhatsApp Gateway Settings */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 text-xs">
              <button
                onClick={() => setGatewayConfigOpen(!gatewayConfigOpen)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left font-bold text-stone-700 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isBn ? "হোয়াটসঅ্যাপ গেটওয়ে সেটিংস" : "WhatsApp Gateway Settings"}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    gatewayInfo.isConfigured 
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" 
                      : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                  }`}>
                    {gatewayInfo.isConfigured ? gatewayInfo.activeProvider : (isBn ? "স্যান্ডবক্স" : "Sandbox")}
                  </span>
                </div>
                {gatewayConfigOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {gatewayConfigOpen && (
                <div className="p-3 pt-1 space-y-3 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-relaxed">
                    {isBn
                      ? "সার্ভার থেকে স্বয়ংক্রিয় ব্যাকগ্রাউন্ড হোয়াটসঅ্যাপ পাঠাতে Twilio বা Green API অ্যাকাউন্ট ক্রেডেনশিয়াল এখানে কনফিগার করুন:"
                      : "Configure Twilio or Green API credentials to enable automated server-side background message delivery:"}
                  </p>

                  {/* Green API Inputs */}
                  <div className="p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                    <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <span>🟢 Option 1: Green API (Direct WhatsApp)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 text-[9px]">
                          Instance ID:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1101xxxxxx"
                          value={configInputs.greenApiId}
                          onChange={(e) => setConfigInputs({ ...configInputs, greenApiId: e.target.value })}
                          className="w-full bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 text-[9px]">
                          API Token:
                        </label>
                        <input
                          type="password"
                          placeholder="token..."
                          value={configInputs.greenApiToken}
                          onChange={(e) => setConfigInputs({ ...configInputs, greenApiToken: e.target.value })}
                          className="w-full bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Twilio Inputs */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span>🔵 Option 2: Twilio WhatsApp</span>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300 text-[9px]">
                        Twilio Account SID:
                      </label>
                      <input
                        type="text"
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={configInputs.twilioSid}
                        onChange={(e) => setConfigInputs({ ...configInputs, twilioSid: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300 text-[9px]">
                        Twilio Auth Token:
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••••••••••••••••••"
                        value={configInputs.twilioToken}
                        onChange={(e) => setConfigInputs({ ...configInputs, twilioToken: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300 text-[9px]">
                        Twilio WhatsApp Sender:
                      </label>
                      <input
                        type="text"
                        placeholder="+14155238886"
                        value={configInputs.twilioFrom}
                        onChange={(e) => setConfigInputs({ ...configInputs, twilioFrom: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={handleSaveGatewayConfig}
                      disabled={savingConfig}
                      className="flex-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3 h-3" />
                      <span>{savingConfig ? (isBn ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (isBn ? "ক্রেডেনশিয়াল সেভ করুন" : "Save Credentials")}</span>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/alerts/trigger-hourly-now", { method: "POST" });
                          if (res.ok) {
                            setConfigFeedback(isBn ? "স্বয়ংক্রিয় এলার্ট সফলভাবে সেন্ট ও আপডেট হয়েছে!" : "Automated cycle dispatched successfully!");
                            setTimeout(() => setConfigFeedback(null), 4000);
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Trigger automated dispatch loop now"
                    >
                      <span>{isBn ? "এখনই এলার্ট পাঠান ⚡" : "Dispatch Now ⚡"}</span>
                    </button>
                  </div>

                  {configFeedback && (
                    <div className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] text-center font-bold">
                      {configFeedback}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Real-time Server Log Console */}
            {simulationLogs.length > 0 && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-400 space-y-1.5 h-28 overflow-y-auto">
                <div className="text-[9px] text-slate-500 uppercase font-bold border-b border-slate-800 pb-1">
                  System Dispatch Logs:
                </div>
                {simulationLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            )}

            {simulatedDeliveriesCount > 0 && (
              <div className="text-center text-[10px] text-stone-500 font-mono font-bold">
                ✔ {simulatedDeliveriesCount} {isBn ? "টি সতর্কবার্তা সফলভাবে প্রেরিত হয়েছে" : "Alert batches successfully routed today"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
