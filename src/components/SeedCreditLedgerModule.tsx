import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Award,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  Percent,
  Banknote,
  Stamp,
} from "lucide-react";
import { Language, GeoField } from "../types";

interface Props {
  selectedField: GeoField;
  language: Language;
}

interface InputRecord {
  id: string;
  date: string;
  category: "Seed" | "Urea" | "TSP" | "MOP" | "Organic";
  name: string;
  source: string;
  quantityKg: number;
  isCertified: boolean;
}

export const SeedCreditLedgerModule: React.FC<Props> = ({
  selectedField,
  language,
}) => {
  const isBn = language === "bn";

  const [records, setRecords] = useState<InputRecord[]>([
    {
      id: "rec-1",
      date: "2026-08-15",
      category: "Seed",
      name: "BRRI Dhan 28 (Certified Grade A)",
      source: "BADC - Bangladesh Agricultural Development Corp",
      quantityKg: 40,
      isCertified: true,
    },
    {
      id: "rec-2",
      date: "2026-09-02",
      category: "Organic",
      name: "Vermicompost Soil Booster",
      source: "Local Upazila Cooperative",
      quantityKg: 200,
      isCertified: true,
    },
    {
      id: "rec-3",
      date: "2026-09-10",
      category: "Urea",
      name: "Granular Urea (Non-certified batch)",
      source: "Open Market Vendor",
      quantityKg: 50,
      isCertified: false,
    },
  ]);

  // Form states for adding new record
  const [newCat, setNewCat] = useState<"Seed" | "Urea" | "TSP" | "MOP" | "Organic">("Seed");
  const [newName, setNewName] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newQty, setNewQty] = useState(25);
  const [newCert, setNewCert] = useState(true);

  const addRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newRecord: InputRecord = {
      id: `rec-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      category: newCat,
      name: newName,
      source: newSource || (isBn ? "উন্মুক্ত বাজার ডিলার" : "Open Market Dealer"),
      quantityKg: Number(newQty),
      isCertified: newCert,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setNewName("");
    setNewSource("");
  };

  // Math to calculate Agricultural Credit Score (0 - 100)
  // Scoring weights: certified seeds (40 pts), organic inputs (30 pts), balanced urea usage (30 pts)
  let creditScore = 40; // Base score
  const hasCertSeeds = records.some((r) => r.category === "Seed" && r.isCertified);
  const organicQty = records
    .filter((r) => r.category === "Organic")
    .reduce((sum, r) => sum + r.quantityKg, 0);
  const chemicalToOrganicRatio = organicQty > 100 ? 30 : organicQty > 0 ? 15 : 0;

  if (hasCertSeeds) creditScore += 25;
  creditScore += chemicalToOrganicRatio;
  if (records.length >= 4) creditScore += 5; // reporting discipline

  // Bounds limit
  if (creditScore > 100) creditScore = 100;

  // Subsidies eligibility text
  const isEligibleForSubsidy = creditScore >= 75;
  const creditStatus = creditScore >= 85 
    ? (isBn ? "চমৎকার (Premium Platinum)" : "Premium Platinum") 
    : creditScore >= 70 
      ? (isBn ? "প্রথম শ্রেণী (A-Grade)" : "A-Grade Scholar")
      : (isBn ? "সাধারণ (Standard)" : "Standard Rating");

  return (
    <div className="bg-[#FCF9F2] dark:bg-slate-900 rounded-3xl p-6 border-2 border-[#1B3B2B] dark:border-emerald-800 shadow-md vintage-manuscript-paper space-y-6">
      
      {/* Top Ledger Header styled like an 1800s scroll deed */}
      <div className="text-center space-y-2 border-b-2 border-double border-[#1B3B2B]/30 pb-4">
        <div className="inline-flex items-center gap-1.5 text-stone-500 font-mono text-[10px] tracking-widest uppercase">
          <Stamp className="w-3.5 h-3.5 text-[#9A3412]" />
          <span>Government Subsidised Digital Registry &bull; গণপ্রজাতন্ত্রী বাংলাদেশ</span>
        </div>
        <h2 className="text-2xl font-black text-[#1B3B2B] dark:text-emerald-400 font-display">
          {isBn ? "ডিজিটাল কৃষি বীজ ও সার খতিয়ান" : "Digital Krishi Seed & Input Ledger"}
        </h2>
        <p className="text-xs text-[#5C4033] dark:text-stone-300 italic max-w-md mx-auto">
          {isBn 
            ? "জমির জৈব গুণাগুণ ও শংসাপত্র রেকর্ড বুক - সরকারি ঋণ ও ভর্তুকির নির্ভরযোগ্য প্রমাণপত্র।" 
            : "Certified ledger documenting verified seeds and fertilizers used. Serves as certified credit rating."}
        </p>
      </div>

      {/* Main Grid: Credit Meter left, Records on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Score & Bank Certification */}
        <div className="lg:col-span-5 bg-[#FAF7F0] dark:bg-slate-950 p-5 rounded-2xl border border-[#1B3B2B]/20 space-y-6 text-center relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#9A3412]/5 pointer-events-none" />

          {/* Golden Seal Wax Stamp */}
          <div className="flex justify-center">
            <div className="wax-seal rounded-full w-20 h-20 text-white font-sans flex flex-col items-center justify-center p-2">
              <span className="text-[10px] uppercase font-bold tracking-wider leading-none">Agri</span>
              <span className="text-xl font-extrabold font-mono mt-0.5 leading-none">{creditScore}</span>
              <span className="text-[8px] italic leading-none mt-1">Certified</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs uppercase font-extrabold text-[#5C4033] dark:text-stone-300">
              {isBn ? "আপনার কৃষি ক্রেডিট স্কোর" : "Your Agronomic Credit Rating"}
            </h4>
            <div className="text-lg font-black text-[#9A3412] font-display">
              {creditStatus}
            </div>
            <p className="text-[10px] text-stone-500 leading-relaxed px-4">
              {isBn 
                ? "বিএডিসি বীজ ও অনুমোদিত সারের রেকর্ড সংরক্ষণের ভিত্তিতে এই মানদণ্ড নির্ধারিত হয়েছে।" 
                : "This rating updates dynamically as you log certified inputs of premium quality grades."}
            </p>
          </div>

          {/* Benefits Status Box */}
          <div className="border-t border-dashed border-[#1B3B2B]/20 pt-4 text-left space-y-3.5">
            <h5 className="text-[11px] font-extrabold uppercase text-[#1B3B2B] dark:text-emerald-400">
              {isBn ? "ভর্তুকি ও ঋণ যোগ্যতা কার্ড" : "Credit & Subsidy Eligibility"}
            </h5>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">{isBn ? "সরকারি বীজ ভর্তুকি:" : "Govt Seed Subsidy:"}</span>
                <span className={`font-bold ${isEligibleForSubsidy ? "text-emerald-700" : "text-[#B45309]"}`}>
                  {isEligibleForSubsidy ? (isBn ? "✅ যোগ্য (৮০% মওকুফ)" : "Eligible (80% Rebate)") : (isBn ? "⚠️ স্কোর বাড়ান" : "Score too low")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">{isBn ? "স্বল্প সুদে কৃষি ঋণ:" : "Low-interest Bank Loan:"}</span>
                <span className="font-extrabold text-stone-700 dark:text-stone-300">
                  {creditScore >= 80 ? (isBn ? "✅ ৪% সরল সুদে মঞ্জুর" : "Approved at 4% APR") : (isBn ? "⚠️ ৭৫+ স্কোর আবশ্যক" : "Requires 75+ Score")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">{isBn ? "সার্টিফিকেশন ট্রাস্ট:" : "Trust Index:"}</span>
                <span className="font-bold font-mono text-stone-600 dark:text-stone-400">
                  {((creditScore / 100) * 10).toFixed(1)} / 10.0
                </span>
              </div>
            </div>

            {/* Print Certificate button */}
            <button
              onClick={() => alert(isBn ? "আপনার কৃষি সার্টিফিকেট ডাউনলোড করা হচ্ছে..." : "Downloading authenticated Seed Input Ledger certification...")}
              className="w-full mt-2 bg-[#1B3B2B] dark:bg-emerald-800 hover:bg-[#234e39] text-white text-[11px] font-bold py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Banknote className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? "সার্টিফিকেট ডাউনলোড করুন" : "Download Subsidized Certificate"}</span>
            </button>
          </div>

        </div>

        {/* Right Side: Ledger Records Table and Interactive Adding Form */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Add Entry Form */}
          <form onSubmit={addRecord} className="p-4 bg-white dark:bg-slate-950 border border-[#1B3B2B]/10 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-[#1B3B2B] dark:text-emerald-400 flex items-center gap-1">
              <PlusCircle className="w-4 h-4 text-[#9A3412]" />
              <span>{isBn ? "নতুন উপকরণ খতিয়ানে যুক্ত করুন" : "Log New Farming Input & Fertilizer"}</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-stone-400">{isBn ? "শ্রেণী" : "Category"}</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full bg-[#FCF9F2] dark:bg-slate-900 border border-[#1B3B2B]/20 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1"
                >
                  <option value="Seed">Seed</option>
                  <option value="Urea">Urea (Nitrogen)</option>
                  <option value="TSP">TSP (Phosphate)</option>
                  <option value="MOP">MOP (Potassium)</option>
                  <option value="Organic">Organic Compost</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-stone-400">{isBn ? "পরিমাণ (কেজি)" : "Qty (Kg)"}</label>
                <input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  className="w-full bg-[#FCF9F2] dark:bg-slate-900 border border-[#1B3B2B]/20 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-stone-400">{isBn ? "উপকরণের নাম/ব্র্যান্ড" : "Input Brand Name"}</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: BADC ব্রি-২৮"
                  className="w-full bg-[#FCF9F2] dark:bg-slate-900 border border-[#1B3B2B]/20 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-stone-400">{isBn ? "সরবরাহকারী/ডিলার" : "Dealer/Source"}</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="যেমন: বিএডিসি রাজশাহী জোন"
                  className="w-full bg-[#FCF9F2] dark:bg-slate-900 border border-[#1B3B2B]/20 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCert}
                  onChange={(e) => setNewCert(e.target.checked)}
                  className="rounded text-[#1B3B2B] focus:ring-[#1B3B2B] h-3.5 w-3.5"
                />
                <span>{isBn ? "সরকারি বিএডিসি/কৃষি কর্মকর্তা কর্তৃক প্রত্যায়িত" : "Govt / Certified Registered Batch"}</span>
              </label>

              <button
                type="submit"
                className="bg-[#9A3412] text-white hover:bg-[#b03d16] font-bold text-[11px] py-1.5 px-4 rounded-xl transition cursor-pointer"
              >
                {isBn ? "খতিয়ান এন্ট্রি করুন" : "Add to Ledger"}
              </button>
            </div>
          </form>

          {/* Historical Record Log */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-extrabold text-[#5C4033] dark:text-stone-300">
              {isBn ? "রেকর্ডকৃত খতিয়ান বিবরণী" : "Ledger Entries History"}
            </h4>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-[#1B3B2B]/10 hover:border-[#1B3B2B]/30 transition flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        r.category === "Seed"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.category === "Organic"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }`}>
                        {r.category}
                      </span>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{r.name}</span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      📅 {r.date} &bull; Source: <span className="italic">{r.source}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-stone-800 dark:text-stone-100 font-mono block">
                      {r.quantityKg} Kg
                    </span>
                    <span className={`text-[9px] font-bold ${r.isCertified ? "text-emerald-700" : "text-stone-400"}`}>
                      {r.isCertified ? (isBn ? "✓ প্রত্যায়িত" : "✓ Certified") : (isBn ? "✗ সাধারণ" : "✗ General")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
