import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Send,
  HelpCircle,
  RotateCcw,
  Check,
  Radio,
} from "lucide-react";
import { GeoField, Language, WeatherPayload, SoilPayload, IrrigationRecommendation, SmartAlert } from "../types";

interface Props {
  field: GeoField;
  language: Language;
  weather: WeatherPayload | null;
  soil?: SoilPayload | null;
  irrigation: IrrigationRecommendation | null;
  alerts: SmartAlert[];
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

export const FarmerVoiceAiSupporter: React.FC<Props> = ({
  field,
  language,
  weather,
  soil,
  irrigation,
  alerts,
}) => {
  const isBn = language === "bn";
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [micErrorMsg, setMicErrorMsg] = useState<string | null>(null);

  // Initial welcome message from AI
  const initialAiMsg: Message = {
    id: "welcome-1",
    sender: "ai",
    text: isBn
      ? `আসসালামু আলাইকুম! আমি আপনার ভয়েস এআই কৃষি উপদেষ্টা। আপনার ${field.nameBn} জমির (${field.variety}) জন্য যেকোনো প্রশ্ন মুখে বলুন, আমি শুনে উত্তর জানিয়ে দেব।`
      : `Hello! I am your Voice AI Farming Assistant. Ask me anything about your ${field.name} (${field.variety}) field using your voice, and I will speak the solution.`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  const [messages, setMessages] = useState<Message[]>([initialAiMsg]);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested voice prompts for quick tap
  const samplePrompts = isBn
    ? [
        "আজকে কি সেচ দেওয়া লাগবে?",
        "ফসলের পাতায় লালচে দাগ কেন?",
        "আজ বৃষ্টি হওয়ার সম্ভাবনা আছে?",
        "সার দেওয়ার উপযুক্ত সময় কোনটা?",
      ]
    : [
        "Do I need to irrigate today?",
        "Why are there yellow spots on leaves?",
        "Is rain expected today?",
        "When is the best time for fertilizer?",
      ];

  // Auto-scroll message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Read AI text aloud
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();

    // Clean markdown stars or bullets before speaking
    const cleanText = text.replace(/[*#_`]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isBn ? "bn-BD" : "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Generate AI Response based on context & query
  const generateAdvice = (userQuery: string): string => {
    const q = userQuery.toLowerCase();
    const temp = weather?.data?.current?.temperature_2m ?? 28;
    const humidity = weather?.data?.current?.relative_humidity_2m ?? 72;
    const rainForecast = weather?.data?.daily?.precipitation_sum?.[0] ?? 0;
    const moisture = field.currentMoisturePct;

    if (q.includes("সেচ") || q.includes("পানি") || q.includes("irrigate") || q.includes("water") || q.includes("pump")) {
      if (irrigation?.action === "IMMEDIATE_IRRIGATION" || moisture < 28) {
        return isBn
          ? `আপনার ${field.nameBn} জমিতে মাটির রস কমে ${moisture}% এ নেমেছে। ৫ এইচপি পাম্প দিয়ে প্রায় ${irrigation?.estimatedPumpDurationMinutes || 45} মিনিট সেচ দেওয়া প্রয়োজন।`
          : `Soil moisture in ${field.name} is low at ${moisture}%. Please run your pump for about ${irrigation?.estimatedPumpDurationMinutes || 45} minutes today.`;
      } else if (rainForecast > 5) {
        return isBn
          ? `আগামী ২৪-৪৮ ঘণ্টায় প্রায় ${rainForecast} মিমি বৃষ্টির পূর্বাভাস রয়েছে। তাই আজ সেচ বন্ধ রেখে পাম্পের জ্বালানি ও টাকা বাঁচান।`
          : `Around ${rainForecast}mm of rain is expected in the next 24-48 hours. Hold off on irrigation today to save costs.`;
      } else {
        return isBn
          ? `মাটির বর্তমান রস ${moisture}% পর্যাপ্ত রয়েছে। আজ সেচ দেওয়ার প্রয়োজন নেই। কাল সকালে আবার মাটির অবস্থা পর্যবেক্ষণ করুন।`
          : `Current soil moisture is good at ${moisture}%. No irrigation needed today. Check back tomorrow morning.`;
      }
    }

    if (q.includes("বৃষ্টি") || q.includes("আবহাওয়া") || q.includes("rain") || q.includes("weather") || q.includes("ঝড়")) {
      return isBn
        ? `আজকে আপনার এলাকার তাপমাত্রা ${temp}° সেলসিয়াস এবং বাতাসের আর্দ্রতা ${humidity}%। আগামী দুই দিনে বৃষ্টিপাতের পরিমাণ আনুমানিক ${rainForecast} মিমি।`
        : `Today's temperature is ${temp}°C with ${humidity}% humidity. Expected rainfall over the next 2 days is ${rainForecast}mm.`;
    }

    if (q.includes("দাগ") || q.includes("রোগ") || q.includes("পোকা") || q.includes("পাতা") || q.includes("disease") || q.includes("pest") || q.includes("spot")) {
      const criticalAlert = alerts.find((a) => a.level === "critical");
      if (criticalAlert) {
        return isBn
          ? `সতর্কতা! বাতাসের আর্দ্রতা বেশি থাকায় পাতা ব্লাস্ট বা ছত্রাকের ঝুঁকি রয়েছে। ইউরিয়া সার বন্ধ রেখে ট্রুপার বা নাটিভো স্প্রে করুন। প্রয়োজনে 'পাতার ছবি তুলুন' বাটনে চাপ দিয়ে ছবি তুলুন।`
          : `Alert! High humidity increases fungal blast risk. Avoid extra urea and spray preventive fungicide. Use 'Scan Leaf' button to upload a photo.`;
      }
      return isBn
        ? `ফসলের পাতায় কোনো দাগ বা সমস্যা দেখলে ওপরের 'পাতার ছবি তুলুন' বাটনে চাপ দিয়ে ছবি আপলোড করুন। আমাদের এআই শস্য ডাক্তার সাথে সাথে সঠিক ওষুধ জানিয়ে দেবে।`
        : `If you notice spots on leaves, use the 'Scan Leaf' button above. Our AI Crop Doctor will identify the disease and prescribe medication.`;
    }

    if (q.includes("সার") || q.includes("ইউরিয়া") || q.includes("পটাশ") || q.includes("fertilizer") || q.includes("urea")) {
      return isBn
        ? `বর্তমান ${field.currentStageBn} ধাপে বিঘাপ্রতি ৮ কেজি এমওপি (পটাশ) সার ব্যবহার করুন। জমিতে অতিরিক্ত ইউরিয়া দিলে ছত্রাকের আক্রমণ বাড়ে, তাই পরিমিত প্রয়োগ করুন।`
        : `For the current ${field.currentStage} stage, apply 8kg MOP per bigha. Avoid excess urea as it increases fungal risks.`;
    }

    // Default intelligent response
    return isBn
      ? `আপনার ${field.nameBn} জমিতে ফসল: ${field.variety}, অবস্থা: ${field.currentStageBn}, মাটির রস: ${moisture}%। আজ তাপমাত্রা ${temp}°সে। নিয়ম মেনে সকালে ও বিকালে জমি পরিদর্শন করুন এবং কোনো প্রশ্ন থাকলে আবার বলুন।`
      : `Your field ${field.name} (${field.variety}) is at ${field.currentStage} stage with ${moisture}% soil moisture. Maintain daily field scouting. Ask me if you need help!`;
  };

  // Handle Query Execution with real Gemini / AI Backend connection
  const handleQuerySubmit = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscript("");
    setIsProcessing(true);

    try {
      const res = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          language: isBn ? "bn" : "en",
          field: {
            name: field.name,
            nameBn: field.nameBn,
            variety: field.variety,
            currentStage: field.currentStage,
            currentStageBn: field.currentStageBn,
            currentMoisturePct: field.currentMoisturePct,
            district: field.district,
          },
          weather: {
            temperature: weather?.data?.current?.temperature_2m ?? 28,
            humidity: weather?.data?.current?.relative_humidity_2m ?? 75,
            precipitation: weather?.data?.daily?.precipitation_sum?.[0] ?? 0,
          },
          soil: {
            ph: soil?.layers?.["0-5cm"]?.ph ?? 6.2,
            organicMatter: soil?.layers?.["0-5cm"]?.socGkg ?? 12,
          },
          irrigation: {
            action: irrigation?.action || "NO_IRRIGATION",
            pumpMinutes: irrigation?.estimatedPumpDurationMinutes || 0,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const advice = data.reply || generateAdvice(trimmed);
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: advice,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(advice);
      } else {
        throw new Error("Voice assistant API failed");
      }
    } catch {
      // Graceful fallback to local domain expert
      const fallbackAdvice = generateAdvice(trimmed);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: fallbackAdvice,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(fallbackAdvice);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start Speech Recognition
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isBn
          ? "আপনার ব্রাউজারে সরাসরি ভয়েস রিকগনিশন সমর্থিত নয়। দয়া করে নিচের প্রশ্নগুলোতে চাপ দিন অথবা লিখে অনুসন্ধান করুন।"
          : "Voice recognition is not supported in this browser. Please tap the suggested questions below."
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = isBn ? "bn-BD" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      setMicErrorMsg(null);

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice/error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicErrorMsg(
            isBn
              ? "মাইক্রোফোনের অনুমতি দেওয়া নেই। আপনি নিচে লিখে অথবা প্রশ্নের বাটনে চাপ দিয়েও প্রশ্ন করতে পারেন।"
              : "Microphone permission was denied. You can type or tap the suggested voice question buttons below."
          );
        } else if (event.error !== "no-speech" && event.error !== "aborted") {
          setMicErrorMsg(
            isBn
              ? "ভয়েস শুনতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা বাটনে চাপ দিন।"
              : "Voice recognition issue. Please try again or tap a question below."
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          handleQuerySubmit(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech start failed:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (transcript.trim()) {
      handleQuerySubmit(transcript);
    }
  };

  return (
    <div className="bg-gradient-to-b from-emerald-900 to-slate-950 text-white rounded-3xl p-5 md:p-6 shadow-xl border-2 border-emerald-700/60 font-sans relative overflow-hidden">
      {/* Decorative Glow background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-display">
                {isBn ? "🎙️ এআই ভয়েস কৃষি উপদেষ্টা" : "🎙️ AI Voice Farm Assistant"}
              </h3>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                VOICE AI
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 font-bangla">
              {isBn ? "মুখে কথা বলুন, ভয়েসে সমাধান শুনুন" : "Speak your query, hear instant voice audio advice"}
            </p>
          </div>
        </div>

        {isPlayingAudio && (
          <button
            onClick={stopAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow-lg animate-pulse cursor-pointer"
          >
            <VolumeX className="w-4 h-4" />
            <span>{isBn ? "ভয়েস থামান" : "Stop Audio"}</span>
          </button>
        )}
      </div>

      {/* Chat Messages Display Window */}
      <div className="bg-slate-900/80 border border-emerald-900/80 rounded-2xl p-4 h-64 overflow-y-auto space-y-3 scrollbar-thin mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                msg.sender === "user"
                  ? "bg-amber-500 text-slate-950"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded-tr-none"
                  : "bg-emerald-900/60 text-emerald-100 border border-emerald-700/50 rounded-tl-none"
              }`}
            >
              <p className="font-bangla font-medium">{msg.text}</p>

              <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/10 text-[10px] text-emerald-300/60">
                <span>{msg.time}</span>
                {msg.sender === "ai" && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="flex items-center gap-1 hover:text-white transition cursor-pointer"
                    title={isBn ? "পুনরায় শুনুন" : "Listen Again"}
                  >
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span>{isBn ? "শুনুন" : "Listen"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold animate-pulse p-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isBn ? "কৃষি উপদেষ্টা পরামর্শ ভাবছেন..." : "AI Assistant is formulating advice..."}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mic Permission Banner if blocked */}
      {micErrorMsg && (
        <div className="mb-3 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bangla flex items-center justify-between gap-2">
          <span>⚠️ {micErrorMsg}</span>
          <button
            onClick={() => setMicErrorMsg(null)}
            className="text-amber-100 underline hover:text-white shrink-0 text-[10px] font-bold cursor-pointer"
          >
            {isBn ? "ঠিক আছে" : "Dismiss"}
          </button>
        </div>
      )}

      {/* Suggested Voice Prompt Chips */}
      <div className="mb-4">
        <span className="text-[11px] font-bold text-emerald-300 block mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{isBn ? "বা চাপ দিয়ে দ্রুত প্রশ্ন করুন:" : "Or tap a voice question:"}</span>
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuerySubmit(prompt)}
              className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 hover:border-emerald-400"
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Microphone Action Area */}
      <div className="flex items-center gap-2 bg-slate-900 border border-emerald-800 rounded-2xl p-2">
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleQuerySubmit(transcript);
          }}
          placeholder={
            isListening
              ? isBn
                ? "শুনছি... আপনার কথা বলুন..."
                : "Listening... speak now..."
              : isBn
              ? "এখানে লিখুন অথবা ডানপাশের মাইকে চাপ দিয়ে বলুন..."
              : "Type here or press mic to speak..."
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-emerald-400/50 focus:outline-none font-bangla"
        />

        {transcript.trim() && !isListening && (
          <button
            onClick={() => handleQuerySubmit(transcript)}
            className="p-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition cursor-pointer"
            title={isBn ? "পাঠান" : "Send"}
          >
            <Send className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-3.5 rounded-2xl font-bold flex items-center gap-2 transition cursor-pointer shadow-lg shrink-0 ${
            isListening
              ? "bg-red-600 text-white animate-pulse ring-4 ring-red-500/40"
              : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
          }`}
          title={isListening ? (isBn ? "কথা বলা বন্ধ করুন" : "Stop Recording") : (isBn ? "মাইকে চাপ দিয়ে কথা বলুন" : "Tap to Speak")}
        >
          {isListening ? (
            <>
              <Radio className="w-5 h-5 animate-spin text-white" />
              <span className="text-xs hidden sm:inline">{isBn ? "শুনছি..." : "Listening..."}</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span className="text-xs font-black hidden sm:inline">{isBn ? "মুখে বলুন" : "Speak"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
