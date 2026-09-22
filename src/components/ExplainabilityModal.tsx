import React from "react";
import { X, HelpCircle, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { Language } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  title: string;
  formula: string;
  inputs: { label: string; value: string; source: string }[];
  logicSteps: string[];
  citation: string;
  confidenceScore: number;
}

export const ExplainabilityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  title,
  formula,
  inputs,
  logicSteps,
  citation,
  confidenceScore,
}) => {
  if (!isOpen) return null;
  const isBn = language === "bn";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/70 flex items-center justify-center text-emerald-200">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {isBn ? "সুপারিশের বৈজ্ঞানিক কার্যকারণ ব্যাখ্যা" : "Algorithmic & Agronomic Reasoning"}
              </h3>
              <p className="text-xs text-emerald-200">
                {title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Formula box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                {isBn ? "প্রযুক্ত সূত্র ও পদ্ধতি" : "Mathematical & Agronomic Equation"}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isBn ? `মডেল নির্ভরতা: ${confidenceScore}%` : `Confidence: ${confidenceScore}%`}
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-emerald-950">
              {formula}
            </div>
          </div>

          {/* Measured parameters */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              {isBn ? "প্রাকৃতিক ও সেন্সর পরিমাপকৃত উপাত্ত" : "Model Input Parameters & Live Sensors"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {inputs.map((inp, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="text-slate-500 text-[11px] mb-0.5">{inp.label}</div>
                  <div className="font-semibold text-slate-900 text-sm">{inp.value}</div>
                  <div className="text-[10px] text-emerald-700 font-medium mt-1">
                    {inp.source}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step by step logic */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {isBn ? "ধাপে ধাপে সিদ্ধান্ত গ্রহণ যুক্তি" : "Deduction & Decision Logic"}
            </span>
            <ol className="space-y-2 text-xs text-slate-700">
              {logicSteps.map((step, idx) => (
                <li key={idx} className="flex gap-2.5 bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Scientific Citation */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <span className="font-semibold block mb-0.5">
              {isBn ? "আন্তর্জাতিক ও জাতীয় মানদণ্ড রেফারেন্স:" : "Standard & Agronomic Citation:"}
            </span>
            <p className="text-emerald-800 italic">
              {citation}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition"
          >
            {isBn ? "বুঝেছি, বন্ধ করুন" : "Acknowledge & Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
