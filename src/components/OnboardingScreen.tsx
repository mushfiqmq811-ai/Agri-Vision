import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import {
  Sprout,
  Atom,
  User,
  MapPin,
  Compass,
  Phone,
  Mail,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Lock,
  LogIn,
  KeyRound,
  Shield,
  GraduationCap,
  UserCheck,
} from "lucide-react";

export const OnboardingScreen: React.FC = () => {
  const { register, login, demoUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register" | "demo">("login");

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("Rajshahi");
  const [zone, setZone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [role, setRole] = useState<"farmer" | "researcher">("farmer");
  const [selectedZones, setSelectedZones] = useState<string[]>(["Rajshahi"]);
  const [alertPreferences, setAlertPreferences] = useState<{ [key: string]: boolean }>({
    drought: true,
    heavy_rain: true,
    blast_disease: true,
    heatwave: true,
    general: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const bangladeshDistricts = [
    "Rajshahi",
    "Bogura",
    "Dinajpur",
    "Mymensingh",
    "Jashore",
    "Dhaka",
    "Sylhet",
    "Rangpur",
    "Chittagong",
    "Barishal",
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!loginIdentifier.trim()) {
      setErrorMsg("ইমেইল বা মোবাইল নম্বর দিন / Enter Email or Phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const input = loginIdentifier.toLowerCase().trim();
      const res = await login(input, loginPassword);
      if (res.success) {
        setSuccessMsg(`স্বাগতম! সফলভাবে লগইন করা হয়েছে।`);
      } else {
        setErrorMsg(res.message || "লগইন ব্যর্থ হয়েছে। সঠিক ইমেইল ও পাসওয়ার্ড প্রদান করুন।");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "লগইন করতে সমস্যা হচ্ছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("অনুগ্রহ করে আপনার নাম লিখুন / Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("সঠিক ইমেইল ঠিকানা প্রদান করুন / Please enter a valid email");
      return;
    }
    if (!registerPassword.trim()) {
      setErrorMsg("একটি গোপনীয় পাসওয়ার্ড দিন / Please enter a password");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name,
        email,
        password: registerPassword,
        phone: whatsapp,
        whatsapp,
        role: role as UserRole,
        district,
        zone: selectedZones.join(", ") || `${district} Grid Zone`,
        organization:
          role === "researcher"
            ? "Bangladesh Agricultural Research Council"
            : "Local Agriculture Cooperative",
        selectedZones,
        alertPreferences,
      } as any);

      if (res.success) {
        setSuccessMsg("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! পাসওয়ার্ডটি সংরক্ষিত রইল।");
      } else {
        setErrorMsg(res.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoUser: any) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await login(demoUser.email, demoUser.role, demoUser.id);
    } catch {
      setErrorMsg("ডেমো লগইন ব্যর্থ হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-emerald-200 selection:text-emerald-950 transition-colors duration-300">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-[#0F172A] rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-10">
        
        {/* Left Side: Cultural & Branding Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0F291E] via-[#1B4332] to-[#0A1A13] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-300 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AgriVision Bangladesh</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight leading-none text-white font-display">
                এগ্রিভিশন <span className="text-emerald-300">বাংলাদেশ</span>
              </h1>
              <p className="text-xs text-emerald-200/90 font-medium">
                Smart Precision Agriculture & Biophysical Decision Engine
              </p>
            </div>

            <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
              সোনার বাংলার মাটি ও আধুনিক বিজ্ঞানের মেলবন্ধন। কৃষক, কর্মকর্তা ও গবেষকদের জন্য তৈরি ক্লাইমেট-স্মার্ট প্ল্যাটফর্ম।
            </p>
          </div>

          <div className="space-y-6 pt-10 relative z-10">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-800/80 text-amber-300 border border-emerald-700/50">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">কৃষক ইন্টারফেস (Farmer Portal)</h4>
                  <p className="text-[11px] text-emerald-200/85">সহজ উপায়ে ক্রপ ডক্টর রোগ সনাক্তকরণ এবং মডিউলার সেচ হিসাব।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-800/80 text-amber-300 border border-emerald-700/50">
                  <Atom className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">গবেষক ইন্টারফেস (Researcher Portal)</h4>
                  <p className="text-[11px] text-emerald-200/85">বায়োফিজিক্যাল ক্রপ ডিজিটাল টুইন, NDVI স্যাটেলাইট এবং সিমুলেশন।</p>
                </div>
              </div>
            </div>

            <div className="border-t border-emerald-800/60 pt-4 flex items-center justify-between text-[10px] text-emerald-300/80 font-mono">
              <span>HOTLINE: 16123</span>
              <span>VERIFIED LOGIN SECURE</span>
            </div>
          </div>
        </div>

        {/* Right Side: Onboarding & Login Workspace */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-[#111815]">
          
          {/* Top Form Navigation Switcher */}
          <div className="flex bg-[#F6F3EC] dark:bg-[#18231E] rounded-xl p-1 mb-6 border border-[#EAE3D5] dark:border-[#22332B] text-xs">
            <button
              onClick={() => {
                setActiveTab("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-lg font-bold transition text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "login"
                  ? "bg-white dark:bg-[#0F1613] text-[#1B4332] dark:text-emerald-400 shadow-sm border border-[#E5DEC9]/40 font-extrabold"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              <span>লগইন করুন / Sign In</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-lg font-bold transition text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "register"
                  ? "bg-white dark:bg-[#0F1613] text-[#1B4332] dark:text-emerald-400 shadow-sm border border-[#E5DEC9]/40 font-extrabold"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>নতুন অ্যাকাউন্ট / Register</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("demo");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-lg font-bold transition text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "demo"
                  ? "bg-white dark:bg-[#0F1613] text-[#1B4332] dark:text-emerald-400 shadow-sm border border-[#E5DEC9]/40 font-extrabold"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>ডেমো অ্যাকাউন্ট / Quick</span>
            </button>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-medium"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium"
            >
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === "login" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-800 dark:text-slate-100 flex items-center gap-2">
                  <span>এগ্রিভিশন অ্যাকাউন্টে প্রবেশ করুন</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  আপনার ইমেইল বা ফোন নম্বর ব্যবহার করে সিস্টেমে লগইন করুন।
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email / Mobile input */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                    ইমেইল বা মোবাইল নম্বর / Email or Phone
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="যেমন: rafiqul.farmer@agrivision.bd অথবা 01711234567"
                      className="w-full bg-[#FAF9F6] dark:bg-[#17201C] border border-[#DDD3C4] dark:border-[#2B4537] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                      পাসওয়ার্ড / Password
                    </label>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium cursor-pointer hover:underline">
                      পাসওয়ার্ড ভুলে গেছেন?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9F6] dark:bg-[#17201C] border border-[#DDD3C4] dark:border-[#2B4537] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                    />
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-[#1B4332]"
                    />
                    <span>আমাকে মনে রাখুন (Remember Me)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1B4332] dark:bg-emerald-800 hover:bg-[#22533e] dark:hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>লগইন হচ্ছে... / Authenticating...</span>
                  ) : (
                    <>
                      <span>লগইন করুন / Sign In Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Role Sign-In Buttons */}
              <div className="pt-3 border-t border-[#EBE3D5] dark:border-[#22332B]">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block mb-2.5">
                  এক ক্লিকে রোল অনুযায়ী সরাসরি প্রবেশ করুন:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDemoLogin(demoUsers[0])}
                    className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 text-left transition cursor-pointer flex items-center gap-2"
                  >
                    <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-800 dark:text-stone-200">কৃষক লগইন</div>
                      <div className="text-[9px] text-stone-400">মোঃ রফিকুল ইসলাম</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDemoLogin(demoUsers[2])}
                    className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 text-left transition cursor-pointer flex items-center gap-2"
                  >
                    <Atom className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-800 dark:text-stone-200">গবেষক লগইন</div>
                      <div className="text-[9px] text-stone-400">ড. আনিসুর রহমান</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Account Role Cards */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                  অ্যাকাউন্ট টাইপ / Choose Interface Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRole("farmer")}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col items-center justify-center gap-1.5 text-center ${
                      role === "farmer"
                        ? "border-[#1B4332] bg-emerald-50/40 dark:bg-emerald-950/20"
                        : "border-[#EBE3D5] dark:border-[#22332B] hover:bg-stone-50 dark:hover:bg-stone-900"
                    }`}
                  >
                    <Sprout className={`w-5 h-5 ${role === "farmer" ? "text-emerald-600" : "text-stone-400"}`} />
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">চাষী / Farmer</span>
                    <span className="text-[9px] text-stone-400">সহজ ও পরিষ্কার ইন্টারফেস</span>
                  </div>

                  <div
                    onClick={() => setRole("researcher")}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col items-center justify-center gap-1.5 text-center ${
                      role === "researcher"
                        ? "border-[#1B4332] bg-emerald-50/40 dark:bg-emerald-950/20"
                        : "border-[#EBE3D5] dark:border-[#22332B] hover:bg-stone-50 dark:hover:bg-stone-900"
                    }`}
                  >
                    <Atom className={`w-5 h-5 ${role === "researcher" ? "text-emerald-600" : "text-stone-400"}`} />
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">গবেষক / Researcher</span>
                    <span className="text-[9px] text-stone-400">উন্নত বৈজ্ঞানিক সিমুলেশন</span>
                  </div>
                </div>
              </div>

              {/* Name field */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                  আপনার নাম / Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    className="w-full bg-[#FAF9F6] dark:bg-[#17201C] border border-[#DDD3C4] dark:border-[#2B4537] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  />
                </div>
              </div>

              {/* District & Multiple Active Zones selection */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                      জেলা / District
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <select
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          if (!selectedZones.includes(e.target.value)) {
                            setSelectedZones([...selectedZones, e.target.value]);
                          }
                        }}
                        className="w-full bg-[#FAF9F6] dark:bg-[#17201C] border border-[#DDD3C4] dark:border-[#2B4537] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B4332] appearance-none"
                      >
                        {bangladeshDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                      জোন / Specific Custom Zone
                    </label>
                    <div className="relative">
                      <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                        placeholder="যেমন: উত্তর জোন / North Grid"
                        className="w-full bg-[#FAF9F6] dark:bg-[#17201C] border border-[#DDD3C4] dark:border-[#2B4537] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                    সক্রিয় কৃষি জোন সমূহ (একাধিক নির্বাচন করতে পারেন) / Active Agricultural Zones (Can Select Multiple)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-[#FAF9F6] dark:bg-[#17201C] p-2.5 rounded-2xl border border-[#DDD3C4] dark:border-[#2B4537]">
                    {["Rajshahi", "Bogura", "Dinajpur", "Mymensingh", "Cumilla", "Jashore"].map((z) => {
                      const isChecked = selectedZones.includes(z);
                      return (
                        <label
                          key={z}
                          className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-[11px] cursor-pointer transition select-none ${
                            isChecked
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#111c16]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                if (selectedZones.length > 1) {
                                  setSelectedZones(selectedZones.filter((sz) => sz !== z));
                                }
                              } else {
                                setSelectedZones([...selectedZones, z]);
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

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                    পছন্দের অ্যালার্ট প্রকারভেদ / Desired Alert Preferences (Email & WhatsApp)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-[#FAF9F6] dark:bg-[#17201C] p-2.5 rounded-2xl border border-[#DDD3C4] dark:border-[#2B4537]">
                    {[
                      { id: "drought", nameEn: "Drought", nameBn: "খরা" },
                      { id: "heavy_rain", nameEn: "Heavy Rain", nameBn: "ভারী বৃষ্টি" },
                      { id: "blast_disease", nameEn: "Blast", nameBn: "ব্লাস্ট" },
                      { id: "heatwave", nameEn: "Heatwave", nameBn: "তীব্র তাপদাহ" },
                      { id: "general", nameEn: "Advisory", nameBn: "সাধারণ" },
                    ].map((pref) => {
                      const isChecked = alertPreferences[pref.id] ?? false;
                      return (
                        <label
                          key={pref.id}
                          className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-[11px] cursor-pointer transition select-none ${
                            isChecked
                              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300 font-semibold"
                              : "border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#111c16]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setAlertPreferences({
                                ...alertPreferences,
                                [pref.id]: !isChecked,
                              });
                            }}
                            className="accent-amber-500 w-3.5 h-3.5 cursor-pointer rounded"
                          />
                          <span>{pref.nameBn} ({pref.nameEn})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* WhatsApp field */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                  হোয়াটসঅ্যাপ নম্বর / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+880 1711-XXXXXX"
                    className="w-full bg-[#FAF9F6] dark:bg-[#17201C] border border-[#DDD3C4] dark:border-[#2B4537] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                  ইমেইল ঠিকানা / Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-[#FAF9F6] dark:bg-[#17201C] border border-[#DDD3C4] dark:border-[#2B4537] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 dark:text-stone-500 block">
                  গোপনীয় পাসওয়ার্ড / Set Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন (যেমন: password123)"
                    className="w-full bg-[#FAF9F6] dark:bg-[#17201C] border border-[#DDD3C4] dark:border-[#2B4537] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B4332] dark:bg-emerald-800 hover:bg-[#22533e] dark:hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>অ্যাকাউন্ট তৈরি হচ্ছে... / Saving...</span>
                ) : (
                  <>
                    <span>অ্যাকাউন্ট তৈরি করুন ও প্রবেশ করুন / Register & Onboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: DEMO ACCOUNTS */}
          {activeTab === "demo" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-800 dark:text-slate-200">
                  সরাসরি ডেমো অ্যাকাউন্ট দিয়ে প্রবেশ করুন
                </h3>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  পরীক্ষার জন্য আমাদের তৈরি করা ডেমো অ্যাকাউন্ট থেকে যেকোনো একটি সিলেক্ট করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoUsers.map((demo) => (
                  <div
                    key={demo.id}
                    onClick={() => handleDemoLogin(demo)}
                    className="p-3.5 rounded-2xl border-2 border-[#EBE3D5] dark:border-[#22332B] hover:border-[#1B4332] cursor-pointer transition hover:bg-[#FAF9F6] dark:hover:bg-stone-900 bg-white dark:bg-[#111815] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-100">
                          {demo.name}
                        </span>
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded font-mono ${
                          demo.role === "farmer"
                            ? "bg-emerald-100 text-emerald-800"
                            : demo.role === "researcher"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {demo.role}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-stone-400 block font-mono">
                        {demo.email}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 border-t border-[#F2ECE0]/60 pt-2 text-[10px] text-stone-500">
                      <span>📍 {demo.district}</span>
                      <span className="font-bold text-[#1B4332] dark:text-emerald-400 flex items-center gap-0.5">
                        লগইন <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

