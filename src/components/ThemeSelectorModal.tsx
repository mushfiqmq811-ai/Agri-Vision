import React from "react";
import { motion } from "motion/react";
import { X, Sun, Moon, Laptop, Check, Sparkles, Eye, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Language } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ThemeSelectorModal: React.FC<Props> = ({ isOpen, onClose, language }) => {
  const { theme, setTheme } = useTheme();
  const isBn = language === "bn";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-[#FFFDFB] dark:bg-[#14221B] rounded-3xl shadow-2xl border border-[#E8E0D5] dark:border-[#22382D] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF7F2] dark:bg-[#1A2C22] border-b border-[#E8E0D5] dark:border-[#22382D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                {isBn ? "থিম ও ডিসপ্লে সেটিংস" : "Theme & Visual Atmosphere"}
              </h3>
              <p className="text-xs text-[#6B6355] dark:text-stone-400 font-bangla">
                {isBn ? "আপনার চোখের জন্য আরামদায়ক আলো নির্বাচন করুন" : "Select your preferred visual aesthetic"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Light Mode: Relaxing Off-White */}
            <div
              onClick={() => setTheme("light")}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                theme === "light"
                  ? "border-emerald-600 bg-[#FAF7F2] ring-2 ring-emerald-500/40 shadow-sm"
                  : "border-[#E8E0D5] bg-[#FCFAF7] hover:border-amber-400"
              }`}
            >
              {theme === "light" && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    {isBn ? "হালকা অফ-হোয়াইট" : "Relaxing Off-White"}
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                    {isBn ? "ঐতিহ্যবাহী শান্ত আলো" : "Warm Heritage"}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#EAE2D7] text-[11px] text-slate-700 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[10px]">
                  <span>ক্যানোপি আর্দ্রতা</span>
                  <span className="font-bold text-emerald-800">২৪%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-3/4" />
                </div>
              </div>

              <p className="text-xs text-slate-600 font-bangla">
                {isBn
                  ? "নরম ও আরামদায়ক অফ-হোয়াইট ব্যাকগ্রাউন্ড যা দিনের বেলা চোখের ওপর চাপ সৃষ্টি করে না।"
                  : "Soft warm off-white canvas preventing screen glare during daytime field operations."}
              </p>
            </div>

            {/* Dark Mode: Nocturnal Forest & Paddy */}
            <div
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                theme === "dark"
                  ? "border-emerald-500 bg-[#16251E] ring-2 ring-emerald-500/40 shadow-sm"
                  : "border-[#E8E0D5] dark:border-[#22382D] bg-slate-900/40 hover:border-emerald-500"
              }`}
            >
              {theme === "dark" && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-300">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 font-display">
                    {isBn ? "গাঢ় মাঠের রাত্রি" : "Earthen Twilight"}
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    {isBn ? "রাতের জন্য উপযোগী" : "Forest Dark"}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D1612] border border-[#22382D] text-[11px] text-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-400 text-[10px]">
                  <span>ক্যানোপি আর্দ্রতা</span>
                  <span className="font-bold text-emerald-400">২৪%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-3/4" />
                </div>
              </div>

              <p className="text-xs text-stone-300 font-bangla">
                {isBn
                  ? "গভীর নিঝুম রাতের সবুজ ও মাটির রঙের সমন্বয়, বিদ্যুৎ সাশ্রয়ী ও চোখবান্ধব।"
                  : "Deep nocturnal evergreen palette with energy savings and tranquil night viewing."}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#182820] border border-[#E8E0D5] dark:border-[#22382D] text-xs text-[#5A5040] dark:text-stone-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{isBn ? "পছন্দসই ফন্ট: Hind Siliguri, Outfit & Plus Jakarta" : "Modern Typography: Hind Siliguri, Outfit & Plus Jakarta"}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#101B15] text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-[#DDD3C4] dark:border-[#22382D]">
              Active
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF7F2] dark:bg-[#1A2C22] border-t border-[#E8E0D5] dark:border-[#22382D] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            {isBn ? "সম্পন্ন" : "Done"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
