import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  UserCheck,
  Shield,
  Sprout,
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  Building,
  MapPin,
  Check,
  ArrowRight,
  LogOut,
  Bell,
  Phone,
  Smartphone,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { UserRole, Language } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onRoleChanged?: (role: UserRole) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  onRoleChanged,
}) => {
  const { user, isAuthenticated, demoUsers, login, logout, register, updateUserPreferences } = useAuth();
  const [activeTab, setActiveTab] = useState<"whatsapp" | "quick" | "signin" | "register">("whatsapp");
  const [whatsappPhone, setWhatsappPhone] = useState("+8801731460855");
  const [whatsappPin, setWhatsappPin] = useState("");
  const [registerPhone, setRegisterPhone] = useState("+8801731460855");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState<UserRole>("farmer");
  const [districtInput, setDistrictInput] = useState("Rajshahi");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const roleDetails: Record<UserRole, { titleEn: string; titleBn: string; descEn: string; descBn: string; icon: React.ReactNode; color: string }> = {
    farmer: {
      titleEn: "Farmer",
      titleBn: "কৃষক",
      descEn: "Simplified dashboard, actionable field instructions, today's tasks & Bangla audio briefing.",
      descBn: "সহজ বাংলা ইন্টারফেস, আজকের করণীয় তালিকা এবং ভয়েস সহায়তা।",
      icon: <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
    },
    agronomist: {
      titleEn: "Extension Officer / Agronomist",
      titleBn: "উপ-সহকারী কৃষি কর্মকর্তা",
      descEn: "Multi-field GIS overview, early warning disease alerts, and automated email dispatch.",
      descBn: "একাধিক পার্সেল পর্যবেক্ষণ, বালাই সতর্কবার্তা ও কৃষকদের বার্তা প্রেরণ।",
      icon: <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: "border-blue-500/50 bg-blue-500/10 text-blue-800 dark:text-blue-300",
    },
    researcher: {
      titleEn: "Agricultural Researcher",
      titleBn: "কৃষি গবেষক / বিজ্ঞানী",
      descEn: "Raw ISRIC SoilGrids, FAO-56 Penman-Monteith formulas, radar data, and methodology exports.",
      descBn: "গবেষণা তথ্য, মাটির রাসায়নিক রূপরেখা, বৈজ্ঞানিক সূত্র ও কাঁচা ডেটা এক্সপোর্ট।",
      icon: <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: "border-purple-500/50 bg-purple-500/10 text-purple-800 dark:text-purple-300",
    },
    admin: {
      titleEn: "System Administrator",
      titleBn: "সিস্টেম অ্যাডমিনিস্ট্রেটর",
      descEn: "Full access to API gateway, automated email cron, user directories, and system telemetry.",
      descBn: "এপিআই গেটওয়ে, অটো ইমেইল ইঞ্জিন এবং সম্পূর্ণ প্রশাসনিক নিয়ন্ত্রণ।",
      icon: <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: "border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-300",
    },
  };

  const handleSelectDemo = async (u: typeof demoUsers[0]) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await login(u.email, undefined, u.role, u.id);
      const isBn = language === "bn";
      setSuccessMsg(
        isBn
          ? `স্বাগতম ${u.nameBn || u.name}! +8801731460855 নাম্বার থেকে আপনার মোবাইলে স্বয়ংক্রিয় ওয়েলকাম মেসেজ পাঠানো হয়েছে।`
          : `Welcome, ${u.name}! An automated WhatsApp welcome message has been dispatched from +8801731460855 to ${u.phone || "+8801731460855"}.`
      );
      if (onRoleChanged) onRoleChanged(u.role);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 3500);
    } catch {
      setErrorMsg("Failed to switch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setErrorMsg(language === "bn" ? "অনুগ্রহ করে ইমেইল ঠিকানা দিন" : "Please provide an email address");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await login(emailInput, passwordInput, roleInput);
      if (result.success) {
        const isBn = language === "bn";
        setSuccessMsg(
          isBn
            ? `সফলভাবে লগইন হয়েছে! +8801731460855 নাম্বার থেকে আপনার মোবাইলে স্বয়ংক্রিয় ওয়েলকাম মেসেজ পাঠানো হয়েছে।`
            : `Logged in successfully! An automated WhatsApp welcome message has been dispatched from +8801731460855 directly to your registered terminal.`
        );
        if (onRoleChanged) onRoleChanged(roleInput);
        setTimeout(() => {
          setSuccessMsg("");
          onClose();
        }, 2000);
      } else {
        setErrorMsg(result.message || (language === "bn" ? "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে" : "Could not verify credentials"));
      }
    } catch {
      setErrorMsg(language === "bn" ? "লগইন করতে সমস্যা হয়েছে" : "Network error during login");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawDigits = whatsappPhone.replace(/[^0-9]/g, "");
    if (!rawDigits || rawDigits.length < 8) {
      setErrorMsg(
        language === "bn"
          ? "অনুগ্রহ করে সঠিক হোয়াটসঅ্যাপ মোবাইল নম্বর দিন (যেমন: 01731460855 বা +8801731460855)"
          : "Please enter a valid WhatsApp mobile number (e.g. 01731460855 or +8801731460855)"
      );
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const formattedPhone = rawDigits.startsWith("880")
        ? `+${rawDigits}`
        : rawDigits.startsWith("0")
        ? `+88${rawDigits}`
        : `+880${rawDigits}`;

      const result = await login(formattedPhone, whatsappPin || undefined, roleInput, undefined, formattedPhone);
      if (result.success) {
        const isBn = language === "bn";
        setSuccessMsg(
          isBn
            ? `হোয়াটসঅ্যাপ নম্বর দিয়ে সফলভাবে প্রবেশ করা হয়েছে! ${formattedPhone} নাম্বারে লাইভ ফিল্ড অ্যালার্ট ও স্বাগতম বার্তা পাঠানো হয়েছে।`
            : `Logged in via WhatsApp successfully! Live telemetry and field advisories dispatched to ${formattedPhone}.`
        );
        if (onRoleChanged) onRoleChanged(roleInput);
        setTimeout(() => {
          setSuccessMsg("");
          onClose();
        }, 2200);
      } else {
        setErrorMsg(result.message || (language === "bn" ? "হোয়াটসঅ্যাপ লগইন ব্যর্থ হয়েছে" : "Could not complete WhatsApp authentication"));
      }
    } catch {
      setErrorMsg(language === "bn" ? "হোয়াটসঅ্যাপে সাইন-ইন করতে নেটওয়ার্ক সমস্যা হয়েছে" : "Network error during WhatsApp sign-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {language === "bn" ? "ব্যবহারকারী অ্যাকাউন্ট ও রোল ব্যবস্থাপনা" : "User Access & Role Management"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "bn" ? "কৃষক, কর্মকর্তা ও গবেষকদের জন্য সুরক্ষিত প্রবেশাধিকার" : "Precision Agriculture Security & Role-Based Access"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Bar if logged in */}
        {isAuthenticated && user && (
          <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {language === "bn" && user.nameBn ? user.nameBn : user.name}
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300">
                  {user.role}
                </span>
                <span className="ml-2 text-slate-500 dark:text-slate-400 hidden sm:inline">
                  ({user.district})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateUserPreferences({ emailAlertsEnabled: !user.emailAlertsEnabled })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition ${
                  user.emailAlertsEnabled
                    ? "bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
                title="Toggle Automated Email Notifications"
              >
                <Bell className="w-3 h-3" />
                <span>{user.emailAlertsEnabled ? "Email Alerts: ON" : "Email Alerts: OFF"}</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-[11px] font-semibold hover:bg-red-100 dark:hover:bg-red-900/60 transition"
              >
                <LogOut className="w-3 h-3" />
                <span>{language === "bn" ? "প্রস্থান" : "Log out"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-white dark:bg-slate-900 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`pb-2.5 font-bold transition border-b-2 mr-5 cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "whatsapp"
                ? "border-[#25D366] text-emerald-700 dark:text-[#25D366]"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
            <span>{language === "bn" ? "হোয়াটসঅ্যাপ লগইন" : "WhatsApp Sign In"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-300/40">
              Live
            </span>
          </button>
          <button
            onClick={() => setActiveTab("quick")}
            className={`pb-2.5 font-bold transition border-b-2 mr-5 cursor-pointer shrink-0 ${
              activeTab === "quick"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {language === "bn" ? "১-ক্লিক ডেমো রোল" : "1-Click Roles"}
          </button>
          <button
            onClick={() => setActiveTab("signin")}
            className={`pb-2.5 font-bold transition border-b-2 mr-5 cursor-pointer shrink-0 ${
              activeTab === "signin"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {language === "bn" ? "ইমেইল দিয়ে লগইন" : "Email Sign In"}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`pb-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 ${
              activeTab === "register"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {language === "bn" ? "নতুন প্রোফাইল নিবন্ধন" : "Register Profile"}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* WhatsApp Direct Sign-in Tab */}
          {activeTab === "whatsapp" && (
            <form onSubmit={handleWhatsAppLogin} className="space-y-4 max-w-md mx-auto py-2">
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-xs">
                    {language === "bn" ? "হোয়াটসঅ্যাপ দিয়ে সরাসরি সাইন-ইন ও নোটিফিকেশন" : "Direct WhatsApp Authentication & Alerts"}
                  </h4>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300/90 leading-relaxed mt-0.5">
                    {language === "bn"
                      ? "আপনার হোয়াটসঅ্যাপ মোবাইল নম্বর দিন। সিস্টেমে সাইন-ইন করার সাথে সাথে সরাসরি আপনার হোয়াটসঅ্যাপে লাইভ ফিল্ড রিমাইন্ডার এবং ফসল আপডেট পৌঁছে যাবে।"
                      : "Enter your WhatsApp number. Live agronomic alerts and daily field advisories will be sent directly to your phone."}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>{language === "bn" ? "হোয়াটসঅ্যাপ মোবাইল নম্বর *" : "WhatsApp Mobile Number *"}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setWhatsappPhone("+8801731460855")}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
                  >
                    {language === "bn" ? "এডমিন/টেস্ট নম্বর (01731460855)" : "Use Demo: +8801731460855"}
                  </button>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs select-none">
                    🇧🇩
                  </span>
                  <input
                    type="tel"
                    required
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+8801731460855 অথবা 01731460855"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>{language === "bn" ? "বাংলাদেশের যেকোনো সচল হোয়াটসঅ্যাপ নম্বর" : "Any active WhatsApp mobile number"}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">+880 / 01...</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>{language === "bn" ? "পাসওয়ার্ড / পিন (যদি পূর্বে সেট করা থাকে)" : "Password / PIN (If set previously)"}</span>
                  <span className="text-[10px] text-slate-400">
                    {language === "bn" ? "প্রথমবার হলে ঐচ্ছিক" : "Optional for instant access"}
                  </span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={whatsappPin}
                    onChange={(e) => setWhatsappPin(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "bn" ? "কার্যকরী ভূমিকা (Role)" : "Operational Role"}
                </label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="farmer">Farmer (কৃষক — ফিল্ড গাইড ও অডিও পরামর্শ)</option>
                  <option value="agronomist">Extension Officer (উপ-সহকারী কৃষি কর্মকর্তা — জোন অ্যালার্ট)</option>
                  <option value="researcher">Agricultural Researcher (গবেষক — ডেটা ও আর্দ্রতা সূচক)</option>
                  <option value="admin">System Administrator (এডমিন — মেসেজিং গেটওয়ে)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>
                  {loading
                    ? (language === "bn" ? "যাচাই ও প্রবেশ হচ্ছে..." : "Verifying & Signing In...")
                    : (language === "bn" ? "হোয়াটসঅ্যাপ নম্বরে সাইন-ইন করুন ➔" : "Sign In via WhatsApp ➔")}
                </span>
              </button>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{language === "bn" ? "নতুন প্রোফাইল তৈরি করবেন?" : "New to AgriVision?"}</span>
                <button
                  type="button"
                  onClick={() => {
                    setRegisterPhone(whatsappPhone || "+8801731460855");
                    setActiveTab("register");
                  }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {language === "bn" ? "হোয়াটসঅ্যাপ দিয়ে নিবন্ধন করুন" : "Register with WhatsApp"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "quick" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "bn"
                  ? "সিস্টেমের বিভিন্ন বৈশিষ্ট্য সরাসরি পরীক্ষার জন্য যেকোনো রোলে ক্লিক করুন:"
                  : "Instantly switch personas to explore role-specific intelligence engines and permission sets:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoUsers.map((u) => {
                  const details = roleDetails[u.role];
                  const isCurrent = user?.id === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectDemo(u)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                        isCurrent
                          ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {details.icon}
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {language === "bn" && u.nameBn ? u.nameBn : u.name}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${details.color}`}>
                            {language === "bn" ? details.titleBn : details.titleEn}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                          {language === "bn" ? details.descBn : details.descEn}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{u.district}</span>
                        </div>
                        {isCurrent ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {language === "bn" ? "সক্রিয়" : "Active"}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 group">
                            <span>{language === "bn" ? "প্রবেশ করুন" : "Switch to this"}</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "signin" && (
            <form onSubmit={handleCustomLogin} className="space-y-4 max-w-md mx-auto py-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>{language === "bn" ? "ইমেইল বা হোয়াটসঅ্যাপ নম্বর" : "Email or WhatsApp Phone"}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("whatsapp")}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {language === "bn" ? "হোয়াটসঅ্যাপ দিয়ে সাইন-ইন ➔" : "Use WhatsApp Login ➔"}
                  </button>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. zrziaur360@gmail.com অথবা +8801731460855"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "bn" ? "পাসওয়ার্ড (ঐচ্ছিক)" : "Password / PIN"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "bn" ? "কার্যকরী ভূমিকা (Role)" : "Operational Role"}
                </label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="farmer">Farmer (কৃষক)</option>
                  <option value="agronomist">Extension Officer (কৃষি কর্মকর্তা)</option>
                  <option value="researcher">Agricultural Researcher (গবেষক)</option>
                  <option value="admin">System Administrator (এডমিন)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Signing in..." : language === "bn" ? "লগইন করুন" : "Sign In to AgriVision"}
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <div className="space-y-4 max-w-md mx-auto py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === "bn" ? "পূর্ণ নাম *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. মোঃ কাসেম মিয়া"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === "bn" ? "জেলা" : "District"}
                  </label>
                  <input
                    type="text"
                    value={districtInput}
                    onChange={(e) => setDistrictInput(e.target.value)}
                    placeholder="e.g. Rajshahi / Bogura"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Dedicated WhatsApp Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>{language === "bn" ? "হোয়াটসঅ্যাপ মোবাইল নম্বর (লগইন ও এলার্টের জন্য) *" : "WhatsApp Mobile Number (For Login & Alerts) *"}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRegisterPhone("+8801731460855")}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {language === "bn" ? "টেস্ট নম্বর পূরণ" : "Use Demo: 01731460855"}
                  </button>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs select-none">
                    🇧🇩
                  </span>
                  <input
                    type="tel"
                    required
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="+8801731460855 অথবা 01731460855"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  />
                </div>
                <p className="mt-1 text-[10px] text-emerald-700 dark:text-emerald-400">
                  {language === "bn"
                    ? "🌾 এই নম্বরে নিবন্ধনের পর সরাসরি স্বয়ংক্রিয় ফিল্ড বুলেটিন ও মাটির আর্দ্রতা সতর্কতা পাঠানো হবে এবং পরবর্তীতে এই নম্বর দিয়েই লগইন করতে পারবেন।"
                    : "Automated field soil moisture alerts & irrigation advice will be sent to this WhatsApp number, and you can sign in anytime using it."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>{language === "bn" ? "ইমেইল ঠিকানা (ঐচ্ছিক)" : "Email Address (Optional)"}</span>
                  <span className="text-[10px] text-slate-400">{language === "bn" ? "না থাকলে খালি রাখুন" : "Optional if WhatsApp provided"}</span>
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. zrziaur360@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "bn" ? "পাসওয়ার্ড সেট করুন" : "Set Account Password"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={language === "bn" ? "আপনার গোপনীয় পাসওয়ার্ড দিন" : "Create password"}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "bn" ? "কার্যকরী ভূমিকা (Role)" : "Operational Role"}
                </label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="farmer">Farmer (কৃষক)</option>
                  <option value="agronomist">Extension Officer (কৃষি কর্মকর্তা)</option>
                  <option value="researcher">Agricultural Researcher (গবেষক)</option>
                  <option value="admin">System Administrator (এডমিন)</option>
                </select>
              </div>

              {/* Registration Notice */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <span className="text-sm">💬</span>
                <div>
                  <strong>{language === "bn" ? "স্বয়ংক্রিয় স্বাগতম হোয়াটসঅ্যাপ ও ইমেইল:" : "Automated Welcome Dispatch:"}</strong>{" "}
                  {language === "bn"
                    ? "রেজিস্ট্রেশনের পর আপনার হোয়াটসঅ্যাপ নম্বরে স্বয়ংক্রিয়ভাবে কনফার্মেশন ও প্রাথমিক ফিল্ড ডাটা চলে যাবে।"
                    : "After registration, your WhatsApp number will automatically receive confirmation & initial field telemetry."}
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const rawPhone = registerPhone.replace(/[^0-9]/g, "");
                  if (!nameInput) {
                    setErrorMsg(language === "bn" ? "অনুগ্রহ করে আপনার নাম দিন।" : "Please enter your name.");
                    return;
                  }
                  if (!rawPhone && !emailInput) {
                    setErrorMsg(language === "bn" ? "অনুগ্রহ করে হোয়াটসঅ্যাপ মোবাইল নম্বর অথবা ইমেইল দিন।" : "Please provide a WhatsApp phone number or email.");
                    return;
                  }
                  setLoading(true);
                  setErrorMsg("");
                  try {
                    const formattedPhone = rawPhone
                      ? (rawPhone.startsWith("880") ? `+${rawPhone}` : rawPhone.startsWith("0") ? `+88${rawPhone}` : `+880${rawPhone}`)
                      : undefined;

                    const effectiveEmail = emailInput && emailInput.includes("@")
                      ? emailInput
                      : formattedPhone ? `wa.${rawPhone.slice(-6)}@agrivision.bd` : `user.${Date.now()}@agrivision.bd`;

                    const result = await register({
                      name: nameInput,
                      email: effectiveEmail,
                      phone: formattedPhone,
                      whatsapp: formattedPhone,
                      password: passwordInput || "123456",
                      role: roleInput,
                      district: districtInput,
                    });
                    if (result.success) {
                      setSuccessMsg(
                        language === "bn"
                          ? `🌾 রেজিস্ট্রেশন সম্পন্ন হয়েছে! ${formattedPhone || effectiveEmail}-এ স্বাগতম বার্তা পাঠানো হয়েছে। এখন আপনি সরাসরি লগইন করতে পারবেন।`
                          : `🌾 Registration complete! Welcome dispatch sent to ${formattedPhone || effectiveEmail}. You can now sign in.`
                      );
                      setTimeout(() => {
                        setSuccessMsg("");
                        onClose();
                      }, 2500);
                    } else {
                      setErrorMsg(result.message || "Registration failed");
                    }
                  } catch {
                    setErrorMsg("Registration request failed");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                {loading ? (language === "bn" ? "রেজিস্ট্রেশন হচ্ছে..." : "Registering...") : (language === "bn" ? "হোয়াটসঅ্যাপ প্রোফাইল তৈরি করুন" : "Register WhatsApp Profile")}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>
            {language === "bn" ? "প্রিসিশন এগ্রিকালচার সিকিউরিটি প্রটোকল v2.5" : "Precision Agriculture Security Layer v2.5"}
          </span>
          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
            Session Encrypted
          </span>
        </div>
      </motion.div>
    </div>
  );
};
