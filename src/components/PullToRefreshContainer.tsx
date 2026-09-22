import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Sprout, CheckCircle2 } from "lucide-react";

interface Props {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  isBn: boolean;
  disabled?: boolean;
}

export const PullToRefreshContainer: React.FC<Props> = ({
  children,
  onRefresh,
  isBn,
  disabled = false,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 65;
  const MAX_PULL = 110;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    if (window.scrollY <= 5) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || disabled || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0 && window.scrollY <= 5) {
      // Apply elastic resistance
      const resistedDistance = Math.min(MAX_PULL, diff * 0.48);
      setPullDistance(resistedDistance);
    } else {
      setPullDistance(0);
      isPullingRef.current = false;
    }
  };

  const handleTouchEnd = async () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(THRESHOLD);

      try {
        await Promise.resolve(onRefresh());
        setJustCompleted(true);
        setTimeout(() => {
          setJustCompleted(false);
          setPullDistance(0);
          setIsRefreshing(false);
        }, 650);
      } catch (err) {
        setPullDistance(0);
        setIsRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
  };

  const rotation = Math.min(360, (pullDistance / THRESHOLD) * 360);
  const isReadyToRelease = pullDistance >= THRESHOLD;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-screen"
    >
      {/* Pull To Refresh Top Indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ height: `${pullDistance}px` }}
            className="w-full flex items-center justify-center overflow-hidden transition-all duration-75 bg-emerald-50/60 dark:bg-emerald-950/30 border-b border-emerald-200/50 dark:border-emerald-800/40 select-none z-30"
          >
            <div className="flex items-center gap-2.5 py-2 px-4 rounded-full bg-white/90 dark:bg-[#14261D]/90 border border-emerald-300 dark:border-emerald-700 shadow-sm">
              {justCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-bangla">
                    {isBn ? "তথ্য আপডেট সম্পন্ন!" : "Telemetry Synced!"}
                  </span>
                </>
              ) : isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-bangla">
                    {isBn ? "লাইভ তথ্য সিঙ্ক হচ্ছে..." : "Syncing live climate data..."}
                  </span>
                </>
              ) : (
                <>
                  <div
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 transition-transform"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-stone-300 font-bangla">
                    {isReadyToRelease
                      ? isBn
                        ? "ছেড়ে দিন রিফ্রেশ করতে..."
                        : "Release to refresh..."
                      : isBn
                      ? "নিচে টানুন রিফ্রেশ করতে..."
                      : "Pull down to refresh..."}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        style={{
          transform: pullDistance > 0 && !isRefreshing ? `translateY(${pullDistance * 0.25}px)` : "none",
          transition: isPullingRef.current ? "none" : "transform 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};
