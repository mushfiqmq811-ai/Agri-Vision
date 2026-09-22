import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  QrCode,
  CheckCircle,
  FileSpreadsheet,
  Award,
  ExternalLink,
  Smartphone,
  Calendar,
  Sparkles,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";
import { Language, GeoField } from "../types";

interface Props {
  selectedField: GeoField;
  language: Language;
}

export const QrTraceabilityModule: React.FC<Props> = ({
  selectedField,
  language,
}) => {
  const isBn = language === "bn";
  const [harvestDate, setHarvestDate] = useState("2026-09-18");
  const [organicCert, setOrganicCert] = useState(true);
  const [pestFree, setPestFree] = useState(true);
  const [showScanModal, setShowScanModal] = useState(false);

  // Simulated unique QR traceability batch string
  const qrBatchId = `batch-${selectedField.id}-${harvestDate.replace(/-/g, "")}`;

  // Direct consumer landing page simulation link
  const mockUrl = `https://agrivision.gov.bd/trace/${qrBatchId}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-[#1B3B2B] dark:border-emerald-800 shadow-md vintage-manuscript-paper space-y-6 relative overflow-hidden">
      
      {/* Visual background leaf overlay */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none text-[#1B3B2B] dark:text-emerald-500">
        <QrCode className="w-40 h-40" />
      </div>

      <div className="border-b border-[#1B3B2B]/20 dark:border-emerald-800/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#1B3B2B] dark:text-emerald-400 flex items-center justify-center border border-emerald-100">
            <QrCode className="w-5 h-5 text-[#9A3412]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#1B3B2B] dark:text-emerald-400 font-display">
              {isBn ? "নিরাপদ খাদ্য কিউআর কোড এবং ট্রেসেবিলিটি" : "QR Code Traceability & Farm-to-Fork"}
            </h3>
            <p className="text-[11px] text-[#5C4033] dark:text-stone-400">
              {isBn 
                ? "ভোক্তাদের জন্য বিষমুক্ত খাদ্য ও ফসলের খতিয়ান নিশ্চিতকরণ" 
                : "Safe food traceability linking markets directly to farm biophysical audits"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Inputs & Certifications */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="text-xs uppercase font-extrabold text-[#1B3B2B] dark:text-emerald-400 tracking-wider">
            {isBn ? "ফসল তোলা ও সার্টিফিকেশন তথ্য" : "Harvest & Safety Certifications"}
          </h4>

          <div className="space-y-3.5">
            {/* Harvest Date Input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>{isBn ? "ফসল তোলার তারিখ" : "Harvest Date"}</span>
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="bg-[#FCF9F2] dark:bg-slate-950 border border-[#1B3B2B]/20 rounded-xl px-3 py-2 text-xs text-[#5C4033] dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
              />
            </div>

            {/* Certification Checkboxes */}
            <div className="space-y-2 bg-[#FAF7F0] dark:bg-slate-950 p-3.5 rounded-2xl border border-dashed border-[#1B3B2B]/20">
              
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={organicCert}
                  onChange={(e) => setOrganicCert(e.target.checked)}
                  className="rounded text-[#1B3B2B] focus:ring-[#1B3B2B] h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    {isBn ? "শতভাগ রাসায়নিক কীটনাশকমুক্ত ফসল" : "100% Chemical Pesticide-Free"}
                  </span>
                  <span className="text-[9px] text-stone-400 block">
                    {isBn ? "কোনো রাসায়নিক কীটনাশক ছাড়া সমন্বিত বালাইনাশক ব্যবহার" : "Integrated Pest Management was solely practiced"}
                  </span>
                </div>
              </label>

              <div className="border-t border-[#1B3B2B]/10 my-2 pt-2" />

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pestFree}
                  onChange={(e) => setPestFree(e.target.checked)}
                  className="rounded text-[#1B3B2B] focus:ring-[#1B3B2B] h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    {isBn ? "এগ্রিভিশন গবেষক দ্বারা সার্টিফাইড" : "AgriVision Researcher Approved"}
                  </span>
                  <span className="text-[9px] text-stone-400 block">
                    {isBn ? "মাটির পিএইচ, আর্দ্রতা এবং পুষ্টি বিশ্লেষণ করে সঠিক ফসল মান নিশ্চিত" : "Soil pH and satellite vegetative canopy indices meet premium safety standards"}
                  </span>
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* Right: Printable Packaging Card Tag with simulated QR code */}
        <div className="md:col-span-5 flex flex-col items-center">
          
          {/* Packaging Card Tag Visual */}
          <div className="bg-[#FAF7F0] dark:bg-slate-950 p-5 rounded-3xl border-2 border-double border-[#1B3B2B] text-center space-y-4 max-w-[240px] shadow-md relative">
            <div className="absolute top-2 left-2 text-[8px] font-mono font-bold text-[#1B3B2B]/50">
              TAG-ID: 1800xBC
            </div>

            <div className="space-y-1">
              <h5 className="text-[11px] font-black text-[#1B3B2B] uppercase tracking-wide">
                {isBn ? "নিরাপদ খাদ্য ট্রাস্ট" : "Safe Food Trust"}
              </h5>
              <div className="text-[9px] text-stone-400">
                {selectedField.variety} &bull; {selectedField.district}
              </div>
            </div>

            {/* Interactive Simulated QR Code Box */}
            <div
              onClick={() => setShowScanModal(true)}
              className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl border-2 border-dashed border-[#9A3412] hover:border-[#1B3B2B] cursor-pointer transition-all duration-300 relative group flex items-center justify-center shadow-xs"
            >
              {/* QR Pattern Representation */}
              <div className="grid grid-cols-5 gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4.5 h-4.5 rounded-xs ${
                      (i % 3 === 0 && i % 2 === 0) || i === 0 || i === 4 || i === 20 || i === 24
                        ? "bg-[#1B3B2B]"
                        : i % 5 === 1 || i % 4 === 2
                          ? "bg-[#9A3412]"
                          : "bg-transparent"
                    }`}
                  />
                ))}
              </div>

              {/* Floating Scan Action Indicator */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-2">
                <Smartphone className="w-5 h-5 text-amber-300 animate-bounce mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{isBn ? "স্ক্যান দেখুন" : "Preview Scan"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold font-mono text-stone-500 block">
                BATCH: {qrBatchId.slice(0, 15)}...
              </span>
              <p className="text-[9px] text-stone-400 italic leading-none">
                {isBn ? "বাজারে ক্রেতার মোবাইল দিয়ে কিউআরটি স্ক্যানযোগ্য" : "Scan to track full chemical analysis & crop history"}
              </p>
            </div>

            {/* Red Wax Seal Overlay */}
            <div className="absolute -bottom-4 -right-4">
              <div className="wax-seal rounded-full w-10 h-10 text-white font-sans text-[8px] font-bold">
                SEAL
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Interactive Consumer Landings Modal Simulation */}
      <AnimatePresence>
        {showScanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FCF9F2] text-[#5C4033] dark:bg-slate-950 dark:text-stone-200 p-6 rounded-3xl max-w-md w-full border-2 border-[#1B3B2B] space-y-5 relative"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setShowScanModal(false)}
                className="absolute top-4 right-4 p-1 rounded-xl bg-[#FAF7F0] hover:bg-stone-200 dark:bg-slate-900 text-stone-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Verified Badge */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1B3B2B] dark:text-emerald-400 uppercase tracking-wide">
                    {isBn ? "ভোক্তা ট্রেসেবিলিটি প্যানেল" : "Verified Safe Food Certificate"}
                  </h3>
                  <p className="text-[10px] text-stone-400">
                    BATCH VERIFICATION COMPLIANT &bull; 100% SECURE
                  </p>
                </div>
              </div>

              {/* Interactive Traceability Parameters */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#1B3B2B]/10 space-y-3 text-xs leading-relaxed">
                
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-400">{isBn ? "উৎপাদক জমি:" : "Origin Field Plot:"}</span>
                  <span className="font-extrabold text-[#1B3B2B] dark:text-emerald-400">
                    {isBn ? selectedField.nameBn : selectedField.name}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-400">{isBn ? "ফসল এবং জাত:" : "Crop Variety:"}</span>
                  <span className="font-bold">{selectedField.variety}</span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-400">{isBn ? "জেলা ও ভৌগোলিক জোন:" : "Subdistrict Geography:"}</span>
                  <span className="font-semibold">{selectedField.district}</span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-400">{isBn ? "শস্য স্বাস্থ্যসূচক (NDVI):" : "Canopy NDVI Average:"}</span>
                  <span className="font-bold text-emerald-700 font-mono">{selectedField.ndviAverage}</span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-400">{isBn ? "কীটনাশকমুক্ত নিশ্চয়তা:" : "Pesticide Analysis:"}</span>
                  <span className="text-emerald-700 font-bold">
                    {organicCert ? (isBn ? "শতভাগ রাসায়নিক কীটনাশকমুক্ত" : "100% Organic, No Residue") : (isBn ? "অনুমোদিত মাত্রা সীমা" : "Approved Trace Limit")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">{isBn ? "সেচ গুণাগুণ সূচক:" : "Irrigation AWD Index:"}</span>
                  <span className="text-[#9A3412] font-bold">
                    {pestFree ? (isBn ? "জলবায়ু-বান্ধব অল্টারনেট সেচ" : "IPCC Low Carbon AWD") : (isBn ? "মানসম্মত" : "Standard")}
                  </span>
                </div>

              </div>

              {/* Trust disclaimer text */}
              <p className="text-[10px] text-stone-500 italic leading-relaxed text-center px-4">
                {isBn 
                  ? "ক্রেতারা এই খতিয়ানের মাধ্যমে সরাসরি তাদের ফসলের জন্ম ইতিহাস জানতে পেরে বিশ্বস্ততা ও গুণমান নিশ্চিত হন।" 
                  : "Consumers scanning this QR Code see physical soil telemetry records and historical growth metrics instantly."}
              </p>

              <button
                onClick={() => setShowScanModal(false)}
                className="w-full bg-[#1B3B2B] hover:bg-[#214a36] text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                {isBn ? "ঠিক আছে" : "Close Certificate View"}
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
