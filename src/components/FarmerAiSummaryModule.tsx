import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { jsPDF } from "jspdf";
import {
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Mail,
  CheckSquare,
  Square,
  AlertTriangle,
  Droplets,
  CloudSun,
  ShieldAlert,
  Send,
  Printer,
  ChevronRight,
  ThumbsUp,
  Radio,
  MessageSquare,
} from "lucide-react";
import { GeoField, WeatherPayload, SoilPayload, IrrigationRecommendation, Language, FarmerAiSummary } from "../types";
import { useAuth } from "../context/AuthContext";

interface Props {
  field: GeoField;
  weather: WeatherPayload | null;
  soil?: SoilPayload | null;
  irrigation: IrrigationRecommendation | null;
  language: Language;
  onOpenEmailDesk?: () => void;
}

export const FarmerAiSummaryModule: React.FC<Props> = ({
  field,
  weather,
  soil,
  irrigation,
  language,
  onOpenEmailDesk,
}) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FarmerAiSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const buildFallbackSummary = (
    field: GeoField,
    weather: WeatherPayload | null,
    soil?: SoilPayload | null,
    irrigation?: IrrigationRecommendation | null,
    language?: Language
  ): FarmerAiSummary => {
    const crop = field?.variety || "BRRI Dhan-28";
    const temp = weather?.data?.current?.temperature_2m ?? 28;
    const humidity = weather?.data?.current?.relative_humidity_2m ?? 75;
    const moisture = field?.currentMoisturePct ?? 24;
    const rain48h = weather?.data?.daily?.precipitation_sum?.[0] ?? 0;
    const rainImminent = rain48h > 6;
    const hour = new Date().getHours();

    const timeSlot = hour < 11 ? "morning" : hour < 15 ? "midday" : hour < 18 ? "afternoon" : "evening";
    const rotationIndex = Math.floor(Date.now() / 15000) % 3;

    const taskPools = {
      morning: [
        {
          textEn: "Inspect leaf underside across 10 random tillers for early stem borer egg masses.",
          textBn: "সকালের শিশির শুকানোর পর ১০টি গোছার পাতার উল্টোপিঠে মাজরা পোকার ডিম আছে কিনা দেখুন।",
          priority: "high" as const,
        },
        {
          textEn: "Measure water head inside AWD tube before solar evapotranspiration spikes.",
          textBn: "কড়া রোদ ওঠার আগেই জমিতে পোতা এডব্লিউডি (AWD) পাইপে পানির উচ্চতা স্কেলে মাপুন।",
          priority: "normal" as const,
        },
        {
          textEn: "Remove weeds from field boundary ridges to prevent insect pest shelter.",
          textBn: "আইলের চারপাশের অপ্রয়োজনীয় আগাছা ছেঁটে ফেলুন যাতে ক্ষতিকর পোকা আশ্রয় না পায়।",
          priority: "normal" as const,
        },
      ],
      midday: [
        {
          textEn: "Halt all chemical spraying during midday heat to prevent leaf necrosis.",
          textBn: "দুপুরের তীব্র রোদে যেকোনো ধরনের কীটনাশক বা সার স্প্রে করা বন্ধ রাখুন।",
          priority: "high" as const,
        },
        {
          textEn: "Ensure drainage outlets are unobstructed for incoming rain runoff.",
          textBn: "জমির অতিরিক্ত পানি নিষ্কাশনের নালা ও নর্দমা পরিষ্কার রাখুন।",
          priority: "normal" as const,
        },
        {
          textEn: "Inspect soil surface cracking to verify root oxygenation.",
          textBn: "শুকনো জমিতে মাটিতে হালকা ফাটল তৈরি হয়ে শিকড়ে বাতাস ঢুকছে কি না তা লক্ষ্য করুন।",
          priority: "normal" as const,
        },
      ],
      afternoon: [
        {
          textEn: "Optimal window: Apply scheduled balanced MOP/Gypsum fertilizer in late afternoon.",
          textBn: "বিকালের শান্ত আবহে নির্ধারিত পটাশ (এমওপি) সার সুষম মাত্রায় ছিটিয়ে দিন।",
          priority: "high" as const,
        },
        {
          textEn: "Plant T-shaped bamboo perches in field corners for natural bird predation of moths.",
          textBn: "জমির মাঝে ও কোণায় 'টি' আকৃতির বাঁশের কঞ্চি পুঁতে দিন যাতে পাখি বসে পোকা শিকার করে।",
          priority: "normal" as const,
        },
        {
          textEn: "Test water pump switches and check engine fuel level for tomorrow's run.",
          textBn: "আগামীকালের সম্ভাব্য সেচের জন্য পাম্প ও মোটরের তার এবং সংযোগ পরীক্ষা করে রাখুন।",
          priority: "normal" as const,
        },
      ],
      evening: [
        {
          textEn: "Hang a simple kerosene or LED light trap over water basin to catch nocturnal moths.",
          textBn: "সন্ধ্যার পর জমির ধারে পানির গামলার ওপর বাতি ঝুলিয়ে আলোর ফাঁদ তৈরি করুন।",
          priority: "high" as const,
        },
        {
          textEn: "Review AgriVision daily moisture graph and confirm overnight soil status.",
          textBn: "রাতের আগে এগ্রিভিশনে মাটির আর্দ্রতা দেখে নিন এবং সেচ প্রয়োজন কিনা যাচাই করুন।",
          priority: "normal" as const,
        },
        {
          textEn: "Check perimeter embankments to protect against stray cattle or rodent burrows.",
          textBn: "জমির সীমানার আইলে ইঁদুরের গর্ত বা ফাটল থাকলে তা শক্ত কাদামাটি দিয়ে বন্ধ করুন।",
          priority: "normal" as const,
        },
      ],
    };

    const currentTasks = taskPools[timeSlot];
    const task1 = rainImminent
      ? {
          textEn: `Clear field outlets immediately: ${rain48h}mm rain forecast in incoming storm front.`,
          textBn: `দ্রুত জমির ড্রেন পরিষ্কার করুন: আগামী ৪৮ ঘণ্টায় ${rain48h} মিমি বৃষ্টির সম্ভাবনা রয়েছে।`,
          priority: "high" as const,
        }
      : moisture < 20
      ? {
          textEn: `Run light irrigation (45 mins) to rescue soil moisture from critical ${moisture}%.`,
          textBn: `মাটির আর্দ্রতা আশঙ্কাজনকভাবে ${moisture}% এ নেমেছে, ৪৫ মিনিট পাম্প চালিয়ে সেচ দিন।`,
          priority: "high" as const,
        }
      : currentTasks[rotationIndex % currentTasks.length];

    const task2 = humidity > 80
      ? {
          textEn: `Humidity is ${humidity}%: Keep Nativo/Trooper prophylactic fungicide ready for blast.`,
          textBn: `বাতাসে আর্দ্রতা ${humidity}%: পাতা ব্লাস্ট রোগ প্রতিরোধে নাটিভো বা ট্রুপার প্রস্তুত রাখুন।`,
          priority: "high" as const,
        }
      : currentTasks[(rotationIndex + 1) % currentTasks.length];

    return {
      generatedAt: new Date().toISOString(),
      fieldId: field?.id || "fld-1",
      fieldName: field?.name || "Field Parcel",
      cropName: crop,
      overallCondition: rainImminent ? "watch_needed" : moisture < 18 ? "critical_action" : "good",
      overallConditionBn: rainImminent ? "বৃষ্টির সম্ভাবনা (সতর্কতা)" : moisture < 18 ? "জরুরি সেচ প্রয়োজন" : "ভালো ও স্বাভাবিক বৃদ্ধি",
      headlineEn: rainImminent
        ? `Rain forecasted (${rain48h}mm). Hold irrigation and inspect drainage conduits.`
        : moisture < 20
        ? `Soil moisture depleted to ${moisture}%. Replenish rootzone before midday.`
        : `Crop vegetative vigor is steady. Moisture is optimal at ${moisture}% under ${temp}°C.`,
      headlineBn: rainImminent
        ? `বৃষ্টিপাতের সম্ভাবনা রয়েছে (${rain48h} মিমি)। সেচ বন্ধ রাখুন এবং ড্রেন উন্মুক্ত রাখুন।`
        : moisture < 20
        ? `মাটির রস কমে ${moisture}% এ নেমেছে। দুপুরের আগেই জমিতে হালকা সেচ দিন।`
        : `ফসলের বৃদ্ধি সন্তোষজনক। ${temp}° সে. তাপমাত্রায় মাটিতে আর্দ্রতা (${moisture}%) অনুকূল রয়েছে।`,
      todayDoList: [task1, task2],
      todayDontList: [
        {
          textEn: rainImminent
            ? "Do NOT apply granular urea during rainfall as runoff causes severe nitrogen loss."
            : hour >= 11 && hour <= 15
            ? "Do NOT apply liquid chemical foliar sprays during peak midday heat to prevent scorching."
            : "Do NOT allow irrigation pump to run unattended beyond prescribed water depth.",
          textBn: rainImminent
            ? "বৃষ্টির সময় জমিতে কোনো দানাদার ইউরিয়া সার ছিটাবেন না, পানিতে ভেসে অপচয় হবে।"
            : hour >= 11 && hour <= 15
            ? "বেলা ১১টা থেকে ৩টার প্রখর রোদে পাতায় কোনো রাসায়নিক স্প্রে করবেন না।"
            : "প্রয়োজনের অতিরিক্ত পানি দিয়ে জমিতে জলাবদ্ধতা তৈরি করবেন না।",
        },
        {
          textEn: moisture > 35
            ? "Do NOT block field drainage outlets; standing water promotes sheath blight fungus."
            : "Do NOT apply excess nitrogen fertilizers during high relative humidity periods.",
          textBn: moisture > 35
            ? "জমির পানি বের হওয়ার পথ আটকে রাখবেন না; দীর্ঘস্থায়ী জমা পানিতে খোলপোড়া রোগ বাড়ে।"
            : "আর্দ্র আবহাওয়ায় মাত্রাতিরিক্ত ইউরিয়া দেবেন না, এতে গাছের কান্ড নরম হয়ে পোকার আক্রমণ ঘটে।",
        },
      ],
      weatherAdvisory: {
        textEn: `Current temperature is ${temp}°C with ${humidity}% humidity. Wind is calm.`,
        textBn: `আজ তাপমাত্রা প্রায় ${temp}° সেলসিয়াস এবং বাতাসের আর্দ্রতা ${humidity}%। আবহাওয়া কৃষিকাজের অনুকূলে।`,
      },
      irrigationAdvice: {
        textEn: rainImminent
          ? "Turn OFF pump motors. Incoming rain will replenish moisture."
          : moisture < 20
          ? "Run pump motor for 45-60 minutes during early morning or late afternoon."
          : "No pumping needed today. Soil moisture is within healthy equilibrium.",
        textBn: rainImminent
          ? "পাম্প বন্ধ রাখুন। বৃষ্টির পানিতে মাটির রস পূরণ হবে।"
          : moisture < 20
          ? "সকাল বা বিকালে ৪৫-৬০ মিনিট পাম্প চালিয়ে জমিতে পরিমিত রস নিশ্চিত করুন।"
          : "আজ সেচের প্রয়োজন নেই। মাটিতে স্বাভাবিক আর্দ্রতা রয়েছে।",
        pumpAction: rainImminent ? "STOP" : moisture < 20 ? "RUN_PUMP" : "MONITOR",
      },
      diseasePrecaution: {
        textEn: humidity > 80
          ? `High relative humidity (${humidity}%) creates favorable conditions for fungal blast. Scout leaf tips.`
          : "Fungal disease threat is currently low. Keep inspecting for stem borer larvae.",
        textBn: humidity > 80
          ? `বাতাসে আর্দ্রতা (${humidity}%) বেশি থাকায় পাতা ব্লাস্ট রোগের ঝুঁকি রয়েছে। পাতার ডগা পরীক্ষা করুন।`
          : "বর্তমানে ছত্রাকের আক্রমণ কম। মাজরা পোকার কোনো উপস্থিতি আছে কিনা লক্ষ্য রাখুন।",
      },
      audioTextBn: `আসসালামু আলাইকুম কৃষক ভাই। আজ আপনার ${crop} ক্ষেতে মাটির রস ${moisture}% এবং তাপমাত্রা ${temp}° সেলসিয়াস। আজকের বিশেষ পরামর্শ: ${task1.textBn}। সুস্থ থাকুন ও এগ্রিভিশনের সাথে থাকুন।`,
      audioTextEn: `Hello farmer. Today your ${crop} soil moisture is ${moisture}% and temperature is ${temp} degrees Celsius. Key action: ${task1.textEn}.`,
      source: "dynamic_agronomic_engine",
    };
  };

  const fetchAiSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/farmer-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          weather,
          soil,
          irrigation,
          language,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data && data.success && data.summary) {
          setSummary(data.summary);
          setCheckedTasks({});
          return;
        }
      }
      
      // Fallback if res is HTML or not valid JSON format
      setSummary(buildFallbackSummary(field, weather, soil, irrigation, language));
      setCheckedTasks({});
    } catch (err) {
      console.warn("AI summary endpoint offline or returned non-JSON, using local synthesis:", err);
      setSummary(buildFallbackSummary(field, weather, soil, irrigation, language));
      setCheckedTasks({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiSummary();
  }, [field.id, field.currentMoisturePct, weather?.data?.current?.temperature_2m]);

  // Voice playback using Web Speech API
  const handleToggleVoice = () => {
    if (!speechSupported || !summary) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = language === "bn" ? summary.audioTextBn : summary.audioTextEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try to find a Bengali or native voice if available
    const voices = window.speechSynthesis.getVoices();
    if (language === "bn") {
      const bnVoice = voices.find((v) => v.lang.includes("bn") || v.name.includes("Bangla") || v.name.includes("Bengali"));
      if (bnVoice) utterance.voice = bnVoice;
      else utterance.lang = "bn-BD";
    } else {
      utterance.lang = "en-US";
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const getBriefingWhatsAppLink = () => {
    if (!summary) return "#";
    const headline = language === "bn" ? summary.headlineBn : summary.headlineEn;
    const tasks = (summary.todayDoList || [])
      .slice(0, 4)
      .map((t, i) => `${i + 1}. ${language === "bn" ? t.textBn : t.textEn}`)
      .join("\n");
    const text =
      language === "bn"
        ? `🌾 *এগ্রিভিশন দৈনিক কৃষি বুলেটিন* 🌾\n\n📍 *মাঠ:* ${field.nameBn || field.name} (${field.variety})\n⚡ *সারসংক্ষেপ:* ${headline}\n\n📋 *আজকের করণীয় কাজ:*\n${tasks}\n\n📞 সরকারি কৃষি কল সেন্টার: 16123\n✨ _এগ্রিভিশন স্মার্ট এগ্রিকালচার_`
        : `🌾 *AgriVision Daily Agronomic Briefing* 🌾\n\n📍 *Field:* ${field.name} (${field.variety})\n⚡ *Summary:* ${headline}\n\n📋 *Today's Action Tasks:*\n${tasks}\n\n📞 Krishi Hotline: 16123\n✨ _AgriVision Precision Agriculture_`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Dispatch Email
  const handleQuickEmail = async () => {
    if (!summary) return;
    setEmailStatus("sending");
    try {
      const recipient = user?.email || "zrziaur360@gmail.com";
      const res = await fetch("/api/email/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          field,
          summary,
          irrigation,
          weather,
          type: "ai_summary",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus(`Dispatched to ${recipient}`);
        setTimeout(() => setEmailStatus(null), 4000);
      }
    } catch {
      setEmailStatus("Failed to send");
      setTimeout(() => setEmailStatus(null), 3000);
    }
  };

  const downloadPdfReport = () => {
    if (!summary) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const primaryColor = [27, 67, 50]; // Forest Green
    const secondaryColor = [158, 42, 43]; // Terracotta Red

    // Page margin
    let y = 20;

    // Outer Decorative Border (1800s vintage framing)
    doc.setDrawColor(212, 163, 115); // Warm Gold
    doc.setLineWidth(0.8);
    doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);

    // Inner thin border
    doc.setDrawColor(27, 67, 50); // Deep Olive
    doc.setLineWidth(0.2);
    doc.rect(11.5, 11.5, doc.internal.pageSize.width - 23, doc.internal.pageSize.height - 23);

    // Header Title
    doc.setTextColor(27, 67, 50); // Deep Forest
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("AGRI-VISION BANGLADESH", 15 + 2, y);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(158, 42, 43); // Terracotta
    doc.text("1800s Heritage-Inspired Precision Agronomic Decision Report", 15 + 2, y + 5);

    // Divider Line
    y += 9;
    doc.setDrawColor(212, 163, 115);
    doc.setLineWidth(0.5);
    doc.line(15, y, doc.internal.pageSize.width - 15, y);

    // Metadata Grid Box
    y += 5;
    doc.setFillColor(250, 247, 242); // Vintage Sand Background
    doc.rect(15, y, doc.internal.pageSize.width - 30, 28, "F");
    doc.setDrawColor(232, 224, 213);
    doc.setLineWidth(0.3);
    doc.rect(15, y, doc.internal.pageSize.width - 30, 28, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(27, 67, 50);
    doc.text("FIELD & CROP METADATA", 18, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(`Field Name: ${field.name || "Rajshahi Dhan-28"} (${field.district || "Rajshahi"})`, 18, y + 10);
    doc.text(`Crop Variety: ${field.variety || "BRRI Dhan-28"}`, 18, y + 15);
    doc.text(`Report Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 18, y + 20);
    doc.text(`Target Farmer: ${user?.name || "Ziaur Rahman"} (${user?.email || "zrziaur360@gmail.com"})`, 18, y + 25);

    // Soil profile on the right side of metadata box
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 67, 50);
    doc.text("SOIL SPECS", 120, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(`Soil Type: Clay-Loam`, 120, y + 10);
    doc.text(`Soil pH: ${soil?.layers?.["0-5cm"]?.ph?.toFixed(1) || "6.4"} (Optimum)`, 120, y + 15);
    doc.text(`Rhizosphere Moisture: ${field.currentMoisturePct || 24}%`, 120, y + 20);

    // Section 1: Executive Briefing
    y += 35;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(158, 42, 43); // Terracotta Red
    doc.text("1. EXECUTIVE AGRONOMIC BRIEFING", 15, y);

    doc.setDrawColor(158, 42, 43);
    doc.setLineWidth(0.3);
    doc.line(15, y + 1.5, doc.internal.pageSize.width - 15, y + 1.5);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Overall Condition: ${summary.overallCondition.toUpperCase().replace("_", " ")}`, 15, y);

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const briefingText = summary.headlineEn;
    const splitBriefing = doc.splitTextToSize(briefingText, doc.internal.pageSize.width - 30);
    doc.text(splitBriefing, 15, y);

    // Section 2: Daily Crop Vitals & Climate Matrix
    y += (splitBriefing.length * 5) + 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(158, 42, 43);
    doc.text("2. DAILY MICRO-CLIMATE & FIELD VITALS", 15, y);

    doc.setDrawColor(158, 42, 43);
    doc.setLineWidth(0.3);
    doc.line(15, y + 1.5, doc.internal.pageSize.width - 15, y + 1.5);

    y += 6;
    // Vitals Table Header
    doc.setFillColor(27, 67, 50);
    doc.rect(15, y, doc.internal.pageSize.width - 30, 7, "F");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Agronomic Metric", 18, y + 4.8);
    doc.text("Observed Value", 110, y + 4.8);
    doc.text("Risk & Recommendation", 150, y + 4.8);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    
    // Row 1: Soil Moisture
    y += 7;
    doc.rect(15, y, doc.internal.pageSize.width - 30, 8);
    doc.text("Rhizosphere Soil Moisture", 18, y + 5.5);
    doc.text(`${field.currentMoisturePct || 24}%`, 110, y + 5.5);
    doc.text("Optimum crop root intake", 150, y + 5.5);

    // Row 2: Air Temp
    y += 8;
    doc.rect(15, y, doc.internal.pageSize.width - 30, 8);
    doc.text("Canopy Air Temperature", 18, y + 5.5);
    doc.text(`${weather?.data?.current?.temperature_2m ?? 27.5}°C`, 110, y + 5.5);
    doc.text("Normal photosynthetically active range", 150, y + 5.5);

    // Row 3: precipitation
    y += 8;
    doc.rect(15, y, doc.internal.pageSize.width - 30, 8);
    doc.text("48h Projected Precipitation", 18, y + 5.5);
    doc.text(`${weather?.data?.daily?.precipitation_sum?.[0] ?? 0} mm`, 110, y + 5.5);
    doc.text(weather?.data?.daily?.precipitation_sum?.[0] ? "Drain excess water" : "Groundwater saving mode", 150, y + 5.5);

    // Section 3: Smart Irrigation Schedule
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(158, 42, 43);
    doc.text("3. FAO-56 SMART IRRIGATION ADVISORY", 15, y);

    doc.setDrawColor(158, 42, 43);
    doc.setLineWidth(0.3);
    doc.line(15, y + 1.5, doc.internal.pageSize.width - 15, y + 1.5);

    y += 6;
    doc.setFillColor(250, 247, 242);
    doc.rect(15, y, doc.internal.pageSize.width - 30, 16, "F");
    doc.rect(15, y, doc.internal.pageSize.width - 30, 16, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(27, 67, 50);
    doc.text(`RECOMMENDED PUMP COMMAND: ${summary.irrigationAdvice.pumpAction}`, 18, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const irrigationText = summary.irrigationAdvice.textEn;
    const splitIrr = doc.splitTextToSize(irrigationText, doc.internal.pageSize.width - 36);
    doc.text(splitIrr, 18, y + 10);

    // Section 4: Action Checklists
    y += 23;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(158, 42, 43);
    doc.text("4. FIELD OPERATIONS CHECKLIST", 15, y);

    doc.setDrawColor(158, 42, 43);
    doc.setLineWidth(0.3);
    doc.line(15, y + 1.5, doc.internal.pageSize.width - 15, y + 1.5);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(27, 67, 50);
    doc.text("DOs (Recommended Activities):", 15, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    summary.todayDoList.forEach((item) => {
      y += 5;
      const doText = `[ ] ${item.textEn}`;
      const splitDo = doc.splitTextToSize(doText, doc.internal.pageSize.width - 30);
      doc.text(splitDo, 15, y);
      y += (splitDo.length - 1) * 4;
    });

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(158, 42, 43);
    doc.text("DONTs (Precautions & Warnings):", 15, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    summary.todayDontList.forEach((item) => {
      y += 5;
      const dontText = `[!] ${item.textEn}`;
      const splitDont = doc.splitTextToSize(dontText, doc.internal.pageSize.width - 30);
      doc.text(splitDont, 15, y);
      y += (splitDont.length - 1) * 4;
    });

    // Signatures / Footnotes
    y += 12;
    if (y > 260) {
      doc.addPage();
      // redraw border
      doc.setDrawColor(212, 163, 115);
      doc.setLineWidth(0.8);
      doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);
      doc.setDrawColor(27, 67, 50);
      doc.setLineWidth(0.2);
      doc.rect(11.5, 11.5, doc.internal.pageSize.width - 23, doc.internal.pageSize.height - 23);
      y = 25;
    }

    doc.setDrawColor(212, 163, 115);
    doc.setLineWidth(0.3);
    doc.line(15, y, doc.internal.pageSize.width - 15, y);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(27, 67, 50);
    doc.text("Agronomic Extension Officer Digital Signature", 15, y);
    doc.text("Ministry of Agriculture & Extension, Bangladesh", 15, y + 4);

    doc.setFont("helvetica", "italic");
    doc.text("AgriVision DSS Engine Version 2.4", 130, y);
    doc.text("Official Agricultural Hotline: 16123", 130, y + 4);

    doc.save(`AgriVision_Report_${field.variety.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const toggleTask = (idx: number) => {
    setCheckedTasks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const conditionColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    excellent: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-800 dark:text-emerald-300",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200",
    },
    good: {
      bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-800 dark:text-emerald-300",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200",
    },
    watch_needed: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-800 dark:text-amber-300",
      badge: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200",
    },
    critical_action: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      badge: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/60 dark:text-red-200",
    },
  };

  const currentTheme = conditionColors[summary?.overallCondition || "good"];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                {language === "bn" ? "কৃষক এআই সারাংশ ও দৈনিক বুলেটিন" : "AI Farmer Daily Briefing"}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 shadow-xs">
                {summary?.source === "gemini-3.8-flash" ? "Gemini 3.8 Flash" : "Agro-AI Engine"}
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              {language === "bn"
                ? `${field.nameBn} (${field.variety}) এর জন্য সহজ ও স্পষ্ট কৃষি নির্দেশনা`
                : `Tailored action-oriented advisory for ${field.name} (${field.variety})`}
            </p>
          </div>
        </div>

        {/* Action Controls: Audio + Refresh + Email */}
        <div className="flex items-center gap-2">
          {speechSupported && (
            <button
              onClick={handleToggleVoice}
              disabled={loading || !summary}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                isSpeaking
                  ? "bg-amber-400 text-slate-950 animate-bounce"
                  : "bg-white/15 hover:bg-white/25 text-white border border-white/20"
              }`}
              title="Listen to summary in audio"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>
                {isSpeaking
                  ? language === "bn"
                    ? "পড়া থামান"
                    : "Stop Audio"
                  : language === "bn"
                  ? "মুখে শুনুন"
                  : "Listen Aloud"}
              </span>
            </button>
          )}

          <a
            href={getBriefingWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
            title="Share daily agronomic briefing to WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-200" />
            <span>
              {language === "bn" ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
            </span>
          </a>

          <button
            onClick={downloadPdfReport}
            disabled={!summary || loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition cursor-pointer"
            title="Download Agronomic Report as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>
              {language === "bn" ? "পিডিএফ রিপোর্ট" : "Download PDF"}
            </span>
          </button>

          <button
            onClick={fetchAiSummary}
            disabled={loading}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer"
            title="Refresh AI Analysis"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-5">
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === "bn"
                ? "মাটির আর্দ্রতা ও আবহাওয়ার ডেটা বিশ্লেষণ করে এআই পরামর্শ প্রস্তুত হচ্ছে..."
                : "Analyzing microclimate, satellite NDVI, and rhizosphere moisture for daily farmer briefing..."}
            </p>
          </div>
        ) : summary ? (
          <>
            {/* Condition Headline Box */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${currentTheme.bg} ${currentTheme.border}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${currentTheme.badge}`}>
                    {language === "bn" ? summary.overallConditionBn : summary.overallCondition.replace("_", " ")}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {language === "bn" ? "ডাইনামিক রিয়েল-টাইম সিঙ্ক" : "Dynamic Live Telemetry"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchAiSummary}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-slate-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 shadow-xs transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-emerald-600" : "text-emerald-700"}`} />
                    <span>{language === "bn" ? "নতুন টাস্ক ও সিদ্ধান্ত রিফ্রেশ" : "Rotate Tasks & Advice"}</span>
                  </button>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {new Date(summary.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {language === "bn" ? summary.headlineBn : summary.headlineEn}
              </p>
            </motion.div>

            {/* Two Column Grid: Today's DOs & DONTs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Today's Actions (DO) */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                    {language === "bn" ? "আজ কী করবেন (করণীয় তালিকা)" : "Today's Action Checklist"}
                  </h3>
                </div>

                <div className="space-y-2">
                  {summary.todayDoList.map((item, idx) => {
                    const isChecked = !!checkedTasks[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTask(idx)}
                        className={`p-2.5 rounded-lg border transition cursor-pointer flex items-start gap-2.5 ${
                          isChecked
                            ? "bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 opacity-60 line-through"
                            : "bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300"
                        }`}
                      >
                        <button className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                          {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>
                        <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {language === "bn" ? item.textBn : item.textEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's DON'Ts */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    ✕
                  </div>
                  <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                    {language === "bn" ? "আজ যা করবেন না (সতর্কতা)" : "What NOT to Do Today"}
                  </h3>
                </div>

                <div className="space-y-2">
                  {summary.todayDontList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {language === "bn" ? item.textBn : item.textEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Pillars: Weather Impact, Irrigation Action, Disease Precaution */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Weather Impact */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <span>{language === "bn" ? "আবহাওয়ার প্রভাব" : "Weather Impact"}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === "bn" ? summary.weatherAdvisory.textBn : summary.weatherAdvisory.textEn}
                </p>
              </div>

              {/* Water & Pump Advice */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-bold">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>{language === "bn" ? "সেচ ও পাম্প নির্দেশ" : "Pump Command"}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    summary.irrigationAdvice.pumpAction === "STOP"
                      ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                  }`}>
                    {summary.irrigationAdvice.pumpAction}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === "bn" ? summary.irrigationAdvice.textBn : summary.irrigationAdvice.textEn}
                </p>
              </div>

              {/* Disease Prevention */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span>{language === "bn" ? "বালাই প্রতিরোধ" : "Disease Caution"}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === "bn" ? summary.diseasePrecaution.textBn : summary.diseasePrecaution.textEn}
                </p>
              </div>
            </div>

            {/* Quick Action Footer: Send via Email / Email Desk */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuickEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "ইমেইলে পাঠান" : "Email This Summary"}</span>
                </button>

                <button
                  onClick={downloadPdfReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 hover:bg-amber-100 font-bold transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "রিপোর্ট ডাউনলোড (PDF)" : "Download PDF Report"}</span>
                </button>

                {onOpenEmailDesk && (
                  <button
                    onClick={onOpenEmailDesk}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer"
                  >
                    <span>{language === "bn" ? "অটোমেটেড ইমেইল ডেস্ক" : "Email Automation Desk"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {emailStatus && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 animate-pulse">
                  {emailStatus}
                </span>
              )}

              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === "bn" ? "কৃষি তথ্য ও যোগাযোগ কেন্দ্র: ১৬১২৩" : "Agricultural Extension Line: 16123"}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
