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
  const [activeTab, setActiveTab] = useState<"quick" | "signin" | "register">("quick");
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
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-white dark:bg-slate-900 text-xs">
          <button
            onClick={() => setActiveTab("quick")}
            className={`pb-2.5 font-bold transition border-b-2 mr-6 cursor-pointer ${
              activeTab === "quick"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {language === "bn" ? "১-ক্লিকে ডেমো রোল পরিবর্তন" : "1-Click Role Switch"}
          </button>
          <button
            onClick={() => setActiveTab("signin")}
            className={`pb-2.5 font-bold transition border-b-2 mr-6 cursor-pointer ${
              activeTab === "signin"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {language === "bn" ? "ইমেইল দিয়ে লগইন" : "Email Sign In"}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. zrziaur360@gmail.com"
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
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
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
                    {language === "bn" ? "পূর্ণ নাম" : "Full Name"}
                  </label>
                  <input
                    type="text"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "bn" ? "ইমেইল (লগইনের জন্য)" : "Email Address"}
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

              {/* Registration Notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <span className="text-sm">📧</span>
                <div>
                  <strong>{language === "bn" ? "স্বয়ংক্রিয় স্বাগতম ইমেইল ও হোয়াটসঅ্যাপ:" : "Automated Welcome Dispatch:"}</strong>{" "}
                  {language === "bn"
                    ? "রেজিস্ট্রেশনের পর এই পাসওয়ার্ড দিয়ে পরবর্তীতে যেকোনো সময় ইমেইল দিয়ে সহজেই লগইন করতে পারবেন।"
                    : "After registration, you can seamlessly sign in anytime using your email and password."}
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!nameInput || !emailInput || !passwordInput) {
                    setErrorMsg(language === "bn" ? "নাম, ইমেইল ও পাসওয়ার্ড প্রদান করুন।" : "Please fill in your name, email and password.");
                    return;
                  }
                  setLoading(true);
                  setErrorMsg("");
                  try {
                    const result = await register({
                      name: nameInput,
                      email: emailInput,
                      password: passwordInput,
                      role: roleInput,
                      district: districtInput,
                    });
                    if (result.success) {
                      setSuccessMsg(
                        language === "bn"
                          ? "🌾 রেজিস্ট্রেশন সম্পন্ন হয়েছে! আপনার পাসওয়ার্ডটি সংরক্ষিত হয়েছে। পরবর্তী সময় ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।"
                          : "🌾 Registration complete! Password saved. You can now log in anytime with your credentials."
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
                {loading ? (language === "bn" ? "রেজিস্ট্রেশন হচ্ছে..." : "Registering...") : (language === "bn" ? "অ্যাকাউন্ট তৈরি করুন ও পাসওয়ার্ড সেট করুন" : "Create Account with Password")}
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
