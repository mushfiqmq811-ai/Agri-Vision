import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sprout } from "lucide-react";

interface Props {
  isTransitioning: boolean;
  moduleNameEn: string;
  moduleNameBn: string;
  isBn: boolean;
}

export const AgriVisionTransitionOverlay: React.FC<Props> = ({
  isTransitioning,
  moduleNameEn,
  moduleNameBn,
  isBn,
}) => {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md pointer-events-none select-none"
        >
          <motion.div
            initial={{ scale: 0.88, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: -8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#0F1D17]/95 border border-emerald-500/30 dark:border-emerald-500/40 shadow-2xl max-w-xs sm:max-w-sm w-full mx-4 text-center"
          >
            {/* AgriVision Logo Animation */}
            <div className="relative mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 6, -6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-lg shadow-emerald-700/30"
              >
                <Sprout className="w-9 h-9 text-emerald-300" />
              </motion.div>

              {/* Glowing Pulse Rings */}
              <motion.div
                animate={{
                  scale: [1, 1.45],
                  opacity: [0.6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-2xl border-2 border-emerald-400 pointer-events-none"
              />
            </div>

            {/* Brand Title */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm font-black tracking-tight text-emerald-900 dark:text-emerald-300 font-display">
                AgriVision Bangladesh
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Target Module Name */}
            <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-bangla mb-3">
              {isBn ? moduleNameBn : moduleNameEn}
            </h4>

            {/* Animated Micro Progress Bar */}
            <div className="w-full bg-slate-200/80 dark:bg-emerald-950/60 rounded-full h-1.5 overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 0.85,
                  ease: "easeInOut",
                }}
                className="w-1/2 h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
              />
            </div>

            <p className="text-[10px] text-slate-500 dark:text-emerald-400/80 font-mono mt-3 uppercase tracking-wider">
              {isBn ? "স্মার্ট মডিউল লোড হচ্ছে..." : "Loading Agronomic Module..."}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
