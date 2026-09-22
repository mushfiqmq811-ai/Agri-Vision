import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Eye,
  Smartphone,
  Monitor,
  RefreshCw,
  Calendar,
  Sparkles,
  Inbox,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { GeoField, WeatherPayload, IrrigationRecommendation, Language, EmailSubscription, EmailLog } from "../types";
import { useAuth } from "../context/AuthContext";

interface Props {
  selectedField: GeoField;
  weather: WeatherPayload | null;
  irrigation: IrrigationRecommendation | null;
  language: Language;
}

export const EmailAutomationModule: React.FC<Props> = ({
  selectedField,
  weather,
  irrigation,
  language,
}) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<EmailSubscription>({
    email: user?.email || "zrziaur360@gmail.com",
    farmerName: user?.name || "Md. Rafiqul Islam",
    district: user?.district || "Rajshahi",
    enabled: true,
    frequency: "daily",
    types: ["irrigation", "disease_alert", "weather_forecast", "ai_summary"],
    preferredHour: 6,
    lastSentAt: new Date().toISOString(),
  });

  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [dispatching, setDispatching] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewLog, setPreviewLog] = useState<EmailLog | null>(null);
  const [devicePreviewMode, setDevicePreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [savingSettings, setSavingSettings] = useState(false);

  // Load existing subscription and logs
  const loadData = async () => {
    try {
      const [subRes, logsRes] = await Promise.all([
        fetch("/api/email/subscription"),
        fetch("/api/email/logs"),
      ]);

      if (subRes.ok && subRes.headers.get("content-type")?.includes("application/json")) {
        const subData = await subRes.json();
        if (subData) setSubscription(subData);
      }
      
      if (logsRes.ok && logsRes.headers.get("content-type")?.includes("application/json")) {
        const logsData = await logsRes.json();
        if (logsData?.logs) setLogs(logsData.logs);
      }
    } catch (err) {
      console.warn("Email system endpoints offline or non-JSON, using local state:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSubscription = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(language === "bn" ? "সাবস্ক্রিপশন সফলভাবে সংরক্ষিত হয়েছে!" : "Email preferences saved!");
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch {
      // ignore
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTriggerDispatch = async (dispatchType: "daily_briefing" | "irrigation_alert" | "disease_warning" | "ai_summary" = "daily_briefing") => {
    setDispatching(true);
    try {
      const res = await fetch("/api/email/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: subscription.email,
          field: selectedField,
          weather,
          irrigation,
          type: dispatchType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Automated advisory successfully delivered to ${subscription.email}`);
        if (data.log) {
          setLogs((prev) => [data.log, ...prev]);
        }
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error("Dispatch failed:", err);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#16291F] rounded-3xl p-6 text-white border border-[#3E6B57] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Mail className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight font-display">
                {language === "bn" ? "স্বয়ংক্রিয় কৃষি ইমেইল ও সতর্কতা ব্যবস্থা" : "Automated Agronomic Email Advisory Engine"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-200 border border-amber-400/40">
                CRON v2.5
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 font-bangla mt-1">
              {language === "bn"
                ? "কৃষক ও কর্মকর্তাদের জন্য দৈনিক সকালের বুলেটিন, রেজিস্ট্রেশন স্বাগতম বার্তা ও জরুরি বালাই সতর্কতা পাঠানো হয়"
                : "Automated scheduled dispatches delivering rhizosphere vitals, welcome advisories, FAO-56 irrigation schedules, and DAE early warnings"}
            </p>
            {/* Prominent Authorized Sender Badge */}
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/30 border border-emerald-400/30 text-xs">
              <span className="text-emerald-300 font-semibold">{language === "bn" ? "স্বয়ংক্রিয় প্রেরক:" : "Automated Sender:"}</span>
              <span className="font-mono text-amber-300 font-bold">mushfiqmq811@gmail.com</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 uppercase font-bold tracking-wider">Verified DAE Desk</span>
            </div>
          </div>
        </div>

        {/* Quick Dispatch Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriggerDispatch("daily_briefing")}
            disabled={dispatching}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-4 h-4 ${dispatching ? "animate-spin" : ""}`} />
            <span>
              {dispatching
                ? language === "bn"
                  ? "বার্তা পাঠানো হচ্ছে..."
                  : "Dispatching..."
                : language === "bn"
                ? "এখনই টেস্ট বুলেটিন পাঠান"
                : "Dispatch Test Advisory Now"}
            </span>
          </button>
        </div>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {/* Main Grid: Subscription Manager & Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Automated Subscription Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {language === "bn" ? "সাবস্ক্রিপশন কনফিগারেশন" : "Automated Delivery Rules"}
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={subscription.enabled}
                onChange={(e) => setSubscription({ ...subscription, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === "bn" ? "প্রাপকের ইমেইল" : "Target Recipient Email"}
              </label>
              <input
                type="email"
                value={subscription.email}
                onChange={(e) => setSubscription({ ...subscription, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                Default: zrziaur360@gmail.com (Verified DAE Extension Channel)
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === "bn" ? "প্রেরণের সময়সূচি (Frequency)" : "Dispatch Schedule"}
              </label>
              <select
                value={subscription.frequency}
                onChange={(e) => setSubscription({ ...subscription, frequency: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="daily">{language === "bn" ? "প্রতিদিন সকাল ৬:০০ টা (দৈনিক বুলেটিন)" : "Daily at 06:00 AM BDT (Morning Briefing)"}</option>
                <option value="critical_only">{language === "bn" ? "শুধুমাত্র জরুরি দুর্যোগ ও রোগ সতর্কতা" : "Only on Critical Weather & Disease Alerts"}</option>
                <option value="weekly">{language === "bn" ? "সাপ্তাহিক সামগ্রিক সারসংক্ষেপ" : "Weekly Comprehensive Digest"}</option>
              </select>
            </div>

            {/* Alert Categories */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {language === "bn" ? "অন্তর্ভুক্ত পরামর্শ বিষয়াবলী" : "Active Advisory Topics"}
              </label>
              <div className="space-y-2">
                {[
                  { key: "irrigation", labelEn: "FAO-56 Irrigation & Pump Runtime", labelBn: "সেচ ও পাম্প চালানোর নির্দেশিকা" },
                  { key: "disease_alert", labelEn: "Fungal Blast & Pest Early Warnings", labelBn: "ব্লাস্ট ও বালাই পূর্বাভাস সতর্কতা" },
                  { key: "weather_forecast", labelEn: "Radar 48h Precipitation & Heat Forecast", labelBn: "বৃষ্টিপাত ও আবহাওয়া পূর্বাভাস" },
                  { key: "ai_summary", labelEn: "Colloquial AI Farmer Daily Checklist", labelBn: "সহজ এআই কৃষক করণীয় তালিকা" },
                ].map((topic) => {
                  const isChecked = subscription.types.includes(topic.key as any);
                  return (
                    <label key={topic.key} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? subscription.types.filter((t) => t !== topic.key)
                            : [...subscription.types, topic.key as any];
                          setSubscription({ ...subscription, types: updated });
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{language === "bn" ? topic.labelBn : topic.labelEn}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSaveSubscription}
              disabled={savingSettings}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer"
            >
              {savingSettings ? "Saving..." : language === "bn" ? "পছন্দসমূহ সংরক্ষণ করুন" : "Save Email Preferences"}
            </button>
          </div>
        </div>

        {/* Center & Right Column: Interactive Email Previewer & Sent Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Email Template Preview Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {language === "bn" ? "প্রেরিতব্য ইমেইলের সরাসরি প্রিভিউ" : "Live Rendered Email Template Preview"}
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setDevicePreviewMode("desktop")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    devicePreviewMode === "desktop"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "text-slate-500"
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevicePreviewMode("mobile")}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    devicePreviewMode === "mobile"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "text-slate-500"
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Email Container Frame */}
            <div className="flex justify-center bg-slate-100 dark:bg-slate-950 p-4 rounded-xl overflow-x-auto">
              <div
                className={`bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-all ${
                  devicePreviewMode === "mobile" ? "w-[360px]" : "w-full max-w-[620px]"
                }`}
              >
                {/* Simulated Email Header */}
                <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white p-5">
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 font-mono uppercase tracking-wider mb-1">
                    <span>AGRI-VISION ADVISORY DISPATCH</span>
                    <span>DAE BANGLADESH</span>
                  </div>
                  <h3 className="text-base font-black tracking-tight">{selectedField.name}</h3>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    Crop: <strong>{selectedField.variety}</strong> &bull; Stage: <strong>{selectedField.currentStage}</strong>
                  </p>
                </div>

                {/* Email Body */}
                <div className="p-5 space-y-4 text-xs text-slate-700">
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="font-bold text-emerald-900 text-sm mb-1">
                      🌾 Field Vitals Equilibrium: Healthy
                    </div>
                    <p className="text-emerald-800 leading-relaxed text-[11px]">
                      {language === "bn"
                        ? "মাটির আর্দ্রতা অনুকূল মাত্রায় রয়েছে। আগামী ৪৮ ঘণ্টায় বৃষ্টিপাতের সম্ভাবনা থাকায় সেচ পাম্প স্থগিত রাখুন।"
                        : "Rhizosphere moisture is within optimum field capacity. Due to projected rainfall, keep irrigation pumps offline."}
                    </p>
                  </div>

                  {/* Vitals Grid in Email */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Rhizosphere Moisture</div>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">{selectedField.currentMoisturePct}%</div>
                      <small className="text-emerald-700 font-medium">Adequate</small>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">FAO-56 Water Need</div>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">{irrigation?.netIrrigationMm ?? 0} mm</div>
                      <small className="text-slate-600">{irrigation?.action === "NO_IRRIGATION" ? "Pumps OFF" : "Run Scheduled"}</small>
                    </div>
                  </div>

                  {/* Checklist inside Email */}
                  <div>
                    <div className="font-bold text-slate-900 mb-2 uppercase text-[11px] tracking-wide">
                      ✅ Today&apos;s Recommended Farm Actions
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 bg-emerald-50 border-l-3 border-emerald-600 rounded text-emerald-900">
                        <strong>DO:</strong> Clear drainage outlets along field bunds to avoid stagnation.
                      </div>
                      <div className="p-2 bg-rose-50 border-l-3 border-rose-600 rounded text-rose-900">
                        <strong>AVOID:</strong> Avoid granular urea broadcast prior to rain.
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <span className="inline-block bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs">
                      Access Live Field Dashboard &rarr;
                    </span>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-1">
                  <div>Automated Precision Decision Support System &bull; Grounded in Open-Meteo & ISRIC SoilGrids</div>
                  <div>Helpline: <strong>16123</strong> (DAE Krishi Call Center Bangladesh)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatch Audit Logs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {language === "bn" ? "প্রেরিত ইমেইলের ইতিহাস ও লগ" : "Recent Dispatch Logs & Delivery Audit"}
                </h3>
              </div>
              <button
                onClick={loadData}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{language === "bn" ? "রিফ্রেশ" : "Refresh"}</span>
              </button>
            </div>

            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {language === "bn" ? "কোনো ইমেইল রেকর্ড পাওয়া যায়নি।" : "No automated dispatches logged yet."}
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      log.type === "welcome_email"
                        ? "border-amber-300 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20"
                        : "border-[#E8E0D5] dark:border-[#22382D] bg-[#FCFAF7] dark:bg-[#16251E]"
                    } flex flex-wrap items-center justify-between gap-3 text-xs`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {log.type === "welcome_email" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-2xs">
                            🌾 {language === "bn" ? "রেজিস্ট্রেশন স্বাগতম বার্তা" : "Welcome Email"}
                          </span>
                        )}
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-bangla">
                          {language === "bn" ? log.subjectBn : log.subject}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {log.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 font-bangla">
                        <span>
                          {language === "bn" ? "প্রেরক:" : "From:"}{" "}
                          <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                            {log.sender || "mushfiqmq811@gmail.com"}
                          </strong>
                        </span>
                        <span>&bull;</span>
                        <span>
                          {language === "bn" ? "প্রাপক:" : "To:"}{" "}
                          <strong className="font-mono text-slate-700 dark:text-slate-300">{log.recipient}</strong>
                        </span>
                        <span>&bull;</span>
                        <span>{new Date(log.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setPreviewLog(log)}
                      className="px-3 py-1.5 rounded-xl border border-[#DDD3C4] dark:border-[#2B4537] bg-white dark:bg-[#1C3026] text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#F2ECE0] dark:hover:bg-[#253E31] transition cursor-pointer"
                    >
                      {language === "bn" ? "এইচটিএমএল দেখুন" : "View HTML"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal to view raw HTML email */}
      {previewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{previewLog.subject}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sent to: {previewLog.recipient}</p>
              </div>
              <button
                onClick={() => setPreviewLog(null)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 bg-white text-slate-900">
              <div dangerouslySetInnerHTML={{ __html: previewLog.previewHtml }} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
