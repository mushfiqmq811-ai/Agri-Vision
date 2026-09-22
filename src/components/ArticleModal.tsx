import React from "react";
import {
  X,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Sparkles,
  Share2,
  Clock,
  Tag,
} from "lucide-react";

export interface ArticleData {
  id: string;
  categoryEn: string;
  categoryBn: string;
  readTime: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  authorEn: string;
  authorBn: string;
  date: string;
  overviewEn: string;
  overviewBn: string;
  keyPointsEn: string[];
  keyPointsBn: string[];
  sectionsEn: {
    heading: string;
    body: string;
    tips?: string[];
  }[];
  sectionsBn: {
    heading: string;
    body: string;
    tips?: string[];
  }[];
  practicalRulesEn: string[];
  practicalRulesBn: string[];
  relatedFeatureId: string;
}

export const FEATURE_ARTICLES: Record<string, ArticleData> = {
  ai_crop_doctor: {
    id: "ai_crop_doctor",
    categoryEn: "Computer Vision & Plant Pathology",
    categoryBn: "কম্পিউটার ভিশন ও উদ্ভিদ রোগতত্ত্ব",
    readTime: "৫ মিনিট পাঠ",
    titleEn: "AI Crop Doctor: Computer Vision for Early Rice Disease Diagnosis in Bangladesh",
    titleBn: "এআই শস্য ডাক্তার: ধানের রোগ বালাই সনাক্তকরণ ও আধুনিক চিকিৎসা নির্দেশিকা",
    subtitleEn: "How convolutional vision models and Gemini AI identify Leaf Blast, Bacterial Leaf Blight, and Sheath Blight before irreversible crop damage.",
    subtitleBn: "কম্পিউটার ভিশন ও এআই প্রযুক্তির সাহায্যে পাতা ব্লাস্ট, ব্যাকটেরিয়া পাতা পোড়া ও খোলপোড়া রোগ আগাম সনাক্তকরণ ও তাৎক্ষণিক চিকিৎসা।",
    authorEn: "AgriVision Agronomy & Pathology Research Wing",
    authorBn: "এগ্রিভিশন কৃষি ও উদ্ভিদ রোগতত্ত্ব গবেষণা বিভাগ",
    date: "সেপ্টেম্বর ২০২৬",
    relatedFeatureId: "doctor",
    overviewEn:
      "Fungal and bacterial diseases cause up to 25-40% yield loss in Aman and Boro paddy across Bangladesh. Early detection within 48 hours of lesion appearance allows targeted micro-dosing of fungicides, reducing chemical runoff and saving farmer expenditures by up to ৳3,500 per bigha.",
    overviewBn:
      "বাংলাদেশে আমন ও বোরো মৌসুমে ব্লাস্ট ও পাতা পোড়া রোগের কারণে প্রতি বছর শতকরা ২৫ থেকে ৪০ ভাগ ফলন হ্রাস পায়। প্রাথমিক অবস্থায় পাতার ক্ষতের ছবি তুলে এআই বিশ্লেষণের মাধ্যমে সঠিক ছত্রাকনাশক নির্বাচন করলে বিঘাপ্রতি প্রায় ৩,৫০০ টাকা সাশ্রয় হয় এবং ফসলের ক্ষতি রোধ করা যায়।",
    keyPointsEn: [
      "Convolutional visual features detect microscopic necrotic lesions invisible to naked eye",
      "Differentiates between nitrogen deficiency yellowing and fungal blast diamond spots",
      "Recommends targeted active ingredients (e.g. Tricyclazole, Azoxystrobin, Kasugamycin)",
      "Reduces prophylactic chemical overuse and protects beneficial soil microbiota"
    ],
    keyPointsBn: [
      "পাতার ক্ষুদ্রাতিক্ষুদ্র বাদামি দাগ ও ক্ষতের প্যাটার্ন নিখুঁতভাবে চিহ্নিত করে",
      "নাইট্রোজেনের ঘাটতিজনিত হলুদ পাতা ও ছত্রাকের দাগের মধ্যে পার্থক্য নির্ণয় করে",
      "সঠিক সক্রিয় উপাদান (যেমন ট্রাইসাইক্লাজোল, এজোক্সিস্ট্রোবিন বা কাসুগামাইসিন) সুপারিশ করে",
      "অতিরিক্ত কীটনাশক ব্যবহার বন্ধ করে প্রাকৃতিক অনুজীব ও মাটির উর্বরতা রক্ষা করে"
    ],
    sectionsEn: [
      {
        heading: "1. Common Paddy Pathogens in Bangladesh",
        body: "Leaf Blast (Magnaporthe oryzae) manifests as diamond or eye-shaped lesions with grayish centers. In contrast, Bacterial Leaf Blight (Xanthomonas oryzae) starts with water-soaked yellow stripes extending from leaf tips downwards along margins. Sheath Blight (Rhizoctonia solani) occurs near the waterline in high plant density plots.",
        tips: [
          "Check lower leaves first after heavy morning fog or dews",
          "Ensure spacing of at least 20cm x 15cm to allow sunlight penetration",
          "Drain stagnant field water immediately if bacterial oozing is spotted"
        ]
      },
      {
        heading: "2. Prescribed Chemical & Organic Protocols",
        body: "For Leaf Blast, spray Nativo 75 WG (0.6g/L) or Trooper (0.8g/L) during late afternoon. If practicing organic cultivation, apply Trichoderma harzianum bio-fungicide slurry at seedling root dip and tillering stage.",
        tips: [
          "Never spray during midday heat (11 AM - 3 PM) to prevent leaf scorching",
          "Use a flat-fan nozzle for uniform canopy coverage",
          "Temporarily stop all top-dressing urea while fungal attack persists"
        ]
      }
    ],
    sectionsBn: [
      {
        heading: "১. বাংলাদেশের ধানের প্রধান ক্ষতিকর রোগসমূহ",
        body: "পাতা ব্লাস্ট (ম্যাগনাপরথে ওরাইজি) রোগে পাতায় বাদামি বা তীরের মতো চোখের আকৃতির দাগ দেখা যায় যার কেন্দ্রভাগ ছাই রঙের হয়। অন্যদিকে ব্যাকটেরিয়া পাতা পোড়া রোগ পাতার ডগা থেকে নিচের দিকে ঢেউ খেলানো হলুদ দাগ হয়ে শুকিয়ে যায়। খোলপোড়া রোগ সাধারণত গোড়ার কাছে স্যাঁতসেঁতে পরিবেশে দ্রুত বিস্তার লাভ করে।",
        tips: [
          "সকালের কুয়াশা বা শিশির শুকানোর পরপরই জমির ১০টি পয়েন্টে পর্যবেক্ষণ করুন",
          "গাছের মধ্যে পর্যাপ্ত ফাঁকা জায়গা (২০ সেমি × ১৫ সেমি) বজায় রাখুন যাতে আলো-বাতাস চলাচল করে",
          "ব্যাকটেরিয়া আক্রমণের লক্ষণ দেখলে অবিলম্বে জমির জমা পানি নিষ্কাশন করে দিন"
        ]
      },
      {
        heading: "২. অনুমোদিত কীটনাশক ও জৈব চিকিৎসা",
        body: "পাতা ব্লাস্ট দমনে প্রতি লিটার পানিতে ০.৬ গ্রাম নাটিভো ৭৫ ডব্লিউজি অথবা ০.৮ গ্রাম ট্রুপার ভালোভাবে মিশিয়ে বিকালে স্প্রে করুন। জৈব কৃষিতে ট্রাইকোডার্মা মিশ্রণ ব্যবহার করলে মাটির স্বাস্থ্য ভালো থাকে এবং গাছের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি পায়।",
        tips: [
          "তীব্র রোদে কখনো স্প্রে করবেন না, এতে পাতার ত্বক পুড়ে যেতে পারে",
          "স্প্রে করার সময় স্প্রেয়ারের নোজল গাছের সমান্তরালে রাখুন",
          "রোগাক্রান্ত অবস্থায় কোনোভাবেই ইউরিয়া সার ছিটাবেন না"
        ]
      }
    ],
    practicalRulesEn: [
      "Take well-lit photos focusing on 1-2 affected leaves from 15-20cm distance",
      "Do not spray if rainfall is forecasted within the next 4 hours",
      "Contact the local Upazila Agriculture Officer (UAO) or dial 16123 for epidemic outbreaks"
    ],
    practicalRulesBn: [
      "আক্রান্ত পাতার ১৫-২০ সেমি দূর থেকে পরিষ্কার আলোতে ছবি তুলুন",
      "পরবর্তী ৪ ঘণ্টার মধ্যে বৃষ্টির সম্ভাবনা থাকলে স্প্রে করা স্থগিত রাখুন",
      "মহামারি আকারে রোগ দেখা দিলে উপজেলা কৃষি অফিসে অথবা ১৬১২৩ নাম্বারে সরাসরি পরামর্শ নিন"
    ]
  },

  smart_irrigation: {
    id: "smart_irrigation",
    categoryEn: "Hydrology & Water Management",
    categoryBn: "হাইড্রোলজি ও আধুনিক সেচ ব্যবস্থাপনা",
    readTime: "৬ মিনিট পাঠ",
    titleEn: "Smart Irrigation: FAO-56 Penman-Monteith Modeling & AWD Water Savings",
    titleBn: "স্মার্ট সেচ সূচি: এফএও-৫৬ পদ্ধতি ও এডব্লিউডি (AWD) পানি ও জ্বালানি সাশ্রয় কৌশল",
    subtitleEn: "How mathematical evapotranspiration (ET0) and perforated soil tubes save up to 30% diesel and electricity in Boro rice cultivation.",
    subtitleBn: "মাটির আর্দ্রতার সেন্সর এবং পারফোরেটেড এডব্লিউডি পাইপের সমন্বয়ে বোরো ধানে ৩০-৩৫% সেচের পানি ও বিদ্যুৎ খরচ কমানোর বৈজ্ঞানিক রূপরেখা।",
    authorEn: "AgriVision Water Resource Engineering Team",
    authorBn: "এগ্রিভিশন পানিসম্পদ ও কৃষি প্রকৌশল দল",
    date: "সেপ্টেম্বর ২০২৬",
    relatedFeatureId: "irrigation",
    overviewEn:
      "Over-irrigation leads to anaerobic root rot and excessive diesel pumping costs. By tracking reference evapotranspiration (ET0) and root-zone soil tension, AgriVision calculates the precise minute-by-minute pump runtime required to keep soil between 25% and 35% volumetric moisture.",
    overviewBn:
      "জমিতে সবসময় অনর্থক পানি জমিয়ে রাখলে শিকড় পচে যায় এবং কৃষকের বিপুল পরিমাণ ডিজেল ও বিদ্যুৎ অপচয় হয়। এগ্রিভিশনের এফএও-৫৬ বাষ্পীভবন মডেল ও সেন্সরের মাধ্যমে মাটির আর্দ্রতা ২৫-৩৫% এ বজায় রেখে পাম্প চালানোর নির্দিষ্ট সময় নির্ধারণ করা যায়।",
    keyPointsEn: [
      "Alternate Wetting and Drying (AWD) reduces methane emissions by 40%",
      "Calculates pump run-time based on horsepower (HP) and discharge delivery",
      "Avoids moisture stress during critical flowering and grain-filling phases",
      "Saves up to ৳2,800 to ৳4,000 per acre in diesel and electricity utility bills"
    ],
    keyPointsBn: [
      "এডব্লিউডি (AWD) পর্যায়ক্রমিক ভিজানো ও শুকানো পদ্ধতিতে মিথেন গ্যাস নির্গমন ৪০% কমে",
      "পাম্পের ক্ষমতা (হর্সপাওয়ার) ও নির্গমন হারের ওপর ভিত্তি করে পাম্প চালনার সঠিক মিনিট গণনা করে",
      "ফুল আসা ও ধানে দুধ আসার মতো সংবেদনশীল সময়ে পানির ঘাটতি হতে দেয় না",
      "একরে প্রায় ২,৮০০ থেকে ৪,০০০ টাকার ডিজেল ও বিদ্যুৎ বিল সাশ্রয় করে"
    ],
    sectionsEn: [
      {
        heading: "1. The Alternate Wetting and Drying (AWD) Principle",
        body: "A 30cm plastic pipe with perforations on the lower 20cm is installed 15cm into the soil. As long as water remains visible inside the pipe (even below ground surface), the rice root system has abundant access to water. Pumping is only initiated once water drops 15cm below soil level.",
        tips: [
          "Install AWD pipe 2 weeks after transplanting",
          "Maintain standing water (2-4cm) strictly during flowering stage",
          "Stop irrigation 10-14 days before final harvest to allow soil hardening"
        ]
      },
      {
        heading: "2. Pump Runtime Mathematical Formula",
        body: "Required water volume (m³) = Field Area (m²) × Rootzone Depth (m) × (Field Capacity - Current Moisture). A standard 5HP diesel centrifugal pump delivers ~1,200 liters/minute. Therefore, a 1-bigha plot needing 15mm irrigation requires approximately 45-55 minutes of operation.",
        tips: [
          "Check pump intake filters for sand clogging weekly",
          "Irrigate during cool morning or evening hours to minimize evaporation loss",
          "Ensure field bunds are plastered with mud to eliminate leakage"
        ]
      }
    ],
    sectionsBn: [
      {
        heading: "১. পর্যায়ক্রমিক ভিজানো ও শুকানো (AWD) পদ্ধতির কার্যপ্রণালী",
        body: "৩০ সেমি লম্বা ছিদ্রযুক্ত পিভিসি পাইপ জমিতে এমনভাবে পোতা হয় যাতে ১৫ সেমি মাটির নিচে থাকে। মাটির ওপর পানি না থাকলেও পাইপের ভেতরের স্তর পর্যবেক্ষণ করে বোঝা যায় শিকড় পানি পাচ্ছে কি না। পাইপের পানির স্তর মাটির নিচে ১৫ সেমি নামলে তবেই সেচ দিতে হয়।",
        tips: [
          "চারা রোপণের ২ সপ্তাহ পর এডব্লিউডি পাইপ স্থাপন করুন",
          "ধানের থোড় আসা ও ফুল ফোটার সময় জমিতে ২-৪ সেমি পানি বজায় রাখুন",
          "ধান কাটার ১০-১২ দিন আগেই সমস্ত সেচ বন্ধ করে দিন"
        ]
      },
      {
        heading: "২. পাম্প চালনার সময় গণনা",
        body: "১ বিঘা জমিতে ১৫ মিলিমিটার পানির স্তর পূরণ করতে একটি সাধারণ ৫ হর্সপাওয়ারের পাম্পকে গড়ে ৪৫ থেকে ৫৫ মিনিট চালাতে হয়। অহেতুক ঘণ্টার পর ঘণ্টা পাম্প চালিয়ে পানির স্তর ভাসিয়ে রাখার কোনো প্রয়োজন নেই।",
        tips: [
          "সকাল অথবা বিকাল বেলা সেচ দিলে বাষ্পীভবনে পানির অপচয় হয় না",
          "পাম্পের পাইপলাইনের লিকেজ নিয়মিত মেরামত করুন",
          "জমির আইল ভালোভাবে কাদামাটি দিয়ে মেরামত করুন যাতে পাশের জমিতে পানি চুয়ে না যায়"
        ]
      }
    ],
    practicalRulesEn: [
      "Always check the AWD tube before turning on the irrigation pump motor",
      "Do not irrigate if 10mm or more rainfall is in the 24-hour forecast",
      "Use AgriVision's Remote Pump Control to automate shutoff timings"
    ],
    practicalRulesBn: [
      "পাম্প চালানোর আগে সবসময় পাইপের ভেতরের পানির স্তর দেখুন",
      "পরবর্তী ২৪ ঘণ্টার মধ্যে ১০ মিমি বা বেশি বৃষ্টির পূর্বাভাস থাকলে সেচ বন্ধ রাখুন",
      "অতিরিক্ত পানি অপচয় রোধে এগ্রিভিশনের টাইমার ফিচার ব্যবহার করুন"
    ]
  },

  broadcast_engine: {
    id: "broadcast_engine",
    categoryEn: "Early Warning & Telecommunications",
    categoryBn: "আগাম সতর্কবার্তা ও স্বয়ংক্রিয় যোগাযোগ",
    readTime: "৪ মিনিট পাঠ",
    titleEn: "Multi-Zone Broadcast Engine: Autonomous WhatsApp & Email Emergency Network",
    titleBn: "মাল্টি-জোন ব্রডকাস্ট ইঞ্জিন: স্বয়ংক্রিয় হোয়াটসঅ্যাপ ও ইমেইল নোটিফিকেশন নেটওয়ার্ক",
    subtitleEn: "Instant climate hazard alerts delivered right to your smartphone without relying on manual government bulletin delivery.",
    subtitleBn: "চরম আবহাওয়া, তাপদাহ বা ছত্রাকের প্রাদুর্ভাব ঘটার সাথে সাথে কৃষকের নিজস্ব হোয়াটসঅ্যাপ ও ইমেইলে স্বয়ংক্রিয় নোটিফিকেশন প্রেরণের আধুনিক ব্যবস্থা।",
    authorEn: "AgriVision Telecommunications & IoT Infrastructure",
    authorBn: "এগ্রিভিশন টেলিকম ও আইওটি অবকাঠামো বিভাগ",
    date: "সেপ্টেম্বর ২০২৬",
    relatedFeatureId: "alerts",
    overviewEn:
      "When flash floods in Sunamganj or heatwaves in Rajshahi emerge, minutes matter. AgriVision's background autonomous scheduler scans sensor networks every hour, automatically triggering localized WhatsApp broadcasts and email dispatches to registered farmers and agronomists.",
    overviewBn:
      "হাওরে আগাম বন্যা বা বরেন্দ্র অঞ্চলে তীব্র তাপদাহ সৃষ্টি হলে প্রতিটি মিনিট মূল্যবান। এগ্রিভিশন ব্যাকগ্রাউন্ড ইঞ্জিন প্রতি ঘণ্টায় জলবায়ু ডেটা বিশ্লেষণ করে এবং বিপদসীমা অতিক্রম করলেই কৃষকের নিজস্ব হোয়াটসঅ্যাপ নম্বরে ও ইমেইলে তাৎক্ষণিক দিকনির্দেশনা পাঠায়।",
    keyPointsEn: [
      "Direct integration with WhatsApp API delivers rich Bengali messages directly to mobile",
      "Hourly automated background cron monitors humidity, rainfall, and thermal thresholds",
      "Zone-specific filtering ensures farmers only receive alerts relevant to their Upazila",
      "Zero manual human intervention required once subscriptions are saved"
    ],
    keyPointsBn: [
      "সরাসরি হোয়াটসঅ্যাপ মেসেজের মাধ্যমে সহজ বাংলায় পরামর্শ পাঠানো হয়",
      "প্রতি ঘণ্টায় ব্যাকগ্রাউন্ড ক্রন স্বয়ংক্রিয়ভাবে খরা, তাপদাহ ও রোগের ঝুঁকি পরীক্ষা করে",
      "কৃষক শুধুমাত্র তার নির্বাচিত জেলার সতর্কবার্তা পান, কোনো অপ্রয়োজনীয় স্প্যাম নয়",
      "একবার সাবস্ক্রিপশন সম্পন্ন হলে সম্পূর্ণ স্বয়ংক্রিয়ভাবে অ্যালার্ট আসতে থাকে"
    ],
    sectionsEn: [
      {
        heading: "1. The Automated Verification Loop",
        body: "The engine runs a dual-layer filter: Layer 1 ingests synoptic meteorological feeds; Layer 2 cross-references crop phenology stage. If relative humidity exceeds 85% for 6 consecutive hours during panicle initiation, an immediate 'Critical Blast Warning' WhatsApp is dispatched.",
        tips: [
          "Ensure your WhatsApp phone number includes country code (+880)",
          "Whitelist notifications in your phone's background battery settings",
          "Check the AgriVision Alert Center for historic delivery records"
        ]
      }
    ],
    sectionsBn: [
      {
        heading: "১. স্বয়ংক্রিয় অ্যালার্ট নির্ধারণ প্রক্রিয়া",
        body: "সিস্টেমটি দুটি স্তরে কাজ করে: প্রথম স্তরে স্যাটেলাইট ও স্থানীয় সেন্সর ডেটা রিড করা হয়; দ্বিতীয় স্তরে ফসলের বর্তমান বয়সের সাথে তা মেলানো হয়। যদি ধানের থোড় আসার সময়ে একটানা ৬ ঘণ্টা বাতাসের আর্দ্রতা ৮৫% এর বেশি থাকে, তবে সাথে সাথে কৃষকের হোয়াটসঅ্যাপে সতর্কতা পাঠানো হয়।",
        tips: [
          "নিবন্ধন করার সময় দেশের কোডসহ (+৮৮০) সঠিক মোবাইল নাম্বার প্রদান করুন",
          "ফোনের নোটিফিকেশন চালু রাখুন যাতে এলার্ট আসা মাত্রই দেখতে পান",
          "এগ্রিভিশন ড্যাশবোর্ডের অ্যালার্ট সেন্টারে বিগত সকল বার্তার ইতিহাস পাওয়া যায়"
        ]
      }
    ],
    practicalRulesEn: [
      "Subscribe to your primary and neighboring districts for early storm warnings",
      "Forward critical blast warnings to your local farmer cooperative group",
      "Review the automated hourly delivery log in the AgriVision Alert Center"
    ],
    practicalRulesBn: [
      "ঝড়ের আগাম পূর্বাভাসের জন্য আপনার নিজ জেলা ও পাশের জেলাগুলো সিলেক্ট করুন",
      "জরুরি ব্লাস্ট এলার্ট পেলে আশেপাশের কৃষকদের সাথে শেয়ার করে সচেতন করুন",
      "কোনো এলার্ট মিস হলে ড্যাশবোর্ডের অ্যালার্ট সেন্টারে গিয়ে সরাসরি পড়ে নিন"
    ]
  },

  digital_twin: {
    id: "digital_twin",
    categoryEn: "Phenology & Crop Modeling",
    categoryBn: "শস্যের বৃদ্ধি ও ডিজিটাল টুইন সিমুলেশন",
    readTime: "৬ মিনিট পাঠ",
    titleEn: "Crop Digital Twin: Virtual Phenology & Stoichiometric Nutrient Balancing",
    titleBn: "শস্য ডিজিটাল টুইন: ভার্চুয়াল বৃদ্ধি চক্র ও সুষম সার ব্যবস্থাপনা কৌশল",
    subtitleEn: "Simulate 120 days of crop growth in seconds to optimize N-P-K fertilizer applications and forecast harvest dates.",
    subtitleBn: "মাটিতে সার প্রয়োগের আগেই ভার্চুয়াল সিমুলেটরে নাইট্রোজেন, ফসফরাস ও পটাশের কার্যকারিতা পরীক্ষা করে ফলন ও লাভজনকতা বৃদ্ধির উপায়।",
    authorEn: "AgriVision Bio-Systems Modeling Division",
    authorBn: "এগ্রিভিশন বায়ো-সিস্টেমস সিমুলেশন উইং",
    date: "সেপ্টেম্বর ২০২৬",
    relatedFeatureId: "twin",
    overviewEn:
      "A digital twin is a real-time mathematical replica of your physical farm plot. It mirrors vegetative tillering, stem elongation, panicle initiation, and grain ripening based on temperature sum (Growing Degree Days - GDD), enabling farmers to test what-if scenarios without risking their livelihood.",
    overviewBn:
      "ডিজিটাল টুইন হলো আপনার ফসলি জমির একটি ভার্চুয়াল গাণিতিক প্রতিরূপ। তাপমাত্রার মাত্রা (GDD) এবং মাটির খাদ্য উপাদানের ওপর ভিত্তি করে এটি চারা রোপণ থেকে পাকা পর্যন্ত প্রতিটি ধাপ নিখুঁতভাবে সিমুলেট করে, যার ফলে ভুল সার বা সেচ দেওয়ার ঝুঁকি শূন্যে নেমে আসে।",
    keyPointsEn: [
      "Tracks Growing Degree Days (GDD) specific to Bangladesh rice cultivars (BRRI Dhan-28, 29, 89)",
      "Stoichiometric N-P-K ratios prevent nitrogen burning and lodging (falling over)",
      "Simulates yield impact under heat stress or delayed transplanting",
      "Provides exact calendar dates for 1st, 2nd, and 3rd urea top-dressings"
    ],
    keyPointsBn: [
      "ব্রি ধান-২৮, ২৯ ও ৮৯ এর সুনির্দিষ্ট তাপমাত্রার মাত্রা (GDD) নিবিড়ভাবে পর্যবেক্ষণ করে",
      "সুষম নাইট্রোজেন-ফসফরাস-পটাশের অনুপাত নির্ধারণ করে গাছ হেলে পড়া রোধ করে",
      "তীব্র তাপদাহ বা দেরিতে চারা রোপণ করলে ফলনে কী প্রভাব পড়বে তা আগাম দেখায়",
      "প্রথম, দ্বিতীয় ও তৃতীয় কিস্তির ইউরিয়া উপরি-প্রয়োগের সঠিক ক্যালেন্ডার দিনক্ষণ দেয়"
    ],
    sectionsEn: [
      {
        heading: "1. The 4 Critical Growth Stages of Modern Paddy",
        body: "Stage 1: Seedling & Vegetative Tillering (Days 1-35) - requires balanced basal fertilizer and intermittent shallow water. Stage 2: Stem Elongation & Panicle Initiation (Days 36-65) - highest nutrient demand, critical urea/potash application. Stage 3: Booting & Flowering (Days 66-90) - constant 3cm water depth mandatory. Stage 4: Grain Ripening (Days 91-125) - gradual moisture reduction.",
        tips: [
          "Apply Gypsum and Zinc Sulfate during final land preparation (Basal)",
          "Never apply urea during the flowering stage",
          "Apply 3rd top-dressing of MOP at 5-7 days before panicle initiation"
        ]
      }
    ],
    sectionsBn: [
      {
        heading: "১. আধুনিক ধানের ৪টি সংবেদনশীল বৃদ্ধির ধাপ",
        body: "১ম ধাপ: চারা ও কুশি পর্যায় (১-৩৫ দিন) - শিকড় ও কুশির সংখ্যা বাড়াতে সুষম সার ও হালকা পানি প্রয়োজন। ২য় ধাপ: থোড় আসার পূর্বমুহূর্ত (৩৬-৬৫ দিন) - গাছের সর্বোচ্চ পুষ্টি চাহিদা থাকে, এ সময়ে ২য় কিস্তির ইউরিয়া ও পটাশ দিতে হয়। ৩য় ধাপ: ফুল ফোটা ও পরাগায়ন (৬৬-৯০ দিন) - জমিতে অবশ্যই ২-৩ সেমি পানি ধরে রাখতে হবে। ৪র্থ ধাপ: দানা গঠন ও পাকা (৯১-১২০ দিন) - ধীরে ধীরে পানি শুকিয়ে নিতে হয়।",
        tips: [
          "জমি তৈরির শেষ চাষে জিপসাম ও জিংক সালফেট প্রয়োগ করুন",
          "ফুল ফোটার সময় কোনো রাসায়নিক সার উপরি-প্রয়োগ করবেন না",
          "থোড় বের হওয়ার ৫-৭ দিন পূর্বে শেষ কিস্তির পটাশ সার ব্যবহার করুন"
        ]
      }
    ],
    practicalRulesEn: [
      "Update your field planting date in the Digital Twin module to synchronize GDD counters",
      "Run the 'Drought Stress Test' in the Scenario Simulator before starting summer planting",
      "Split nitrogen into 3 equal top-dressings rather than a single heavy application"
    ],
    practicalRulesBn: [
      "সঠিক ফলাফল পেতে ডিজিটাল টুইন মডিউলে চারা রোপণের সঠিক তারিখ সেট করুন",
      "গ্রীষ্মকালীন বোরো মৌসুম শুরুর আগে দৃশ্যপট সিমুলেটরে খরার প্রভাব পরীক্ষা করে নিন",
      "একবারে বেশি ইউরিয়া না দিয়ে ৩ কিস্তিতে ভাগ করে প্রয়োগ করুন"
    ]
  },

  agro_market: {
    id: "agro_market",
    categoryEn: "Agricultural Economics & Marketing",
    categoryBn: "কৃষি অর্থনীতি ও বাজার দর পূর্বাভাস",
    readTime: "৫ মিনিট পাঠ",
    titleEn: "Agro-Market AI Predictor: Avoiding Harvest Distress Sales & Maximizing Profits",
    titleBn: "কৃষি বাজার এআই প্রেডিক্টর: ফসল কাটার মৌসুমের লোকসান এড়ানো ও সেরা দর পাওয়ার উপায়",
    subtitleEn: "Predictive wholesale mandi timelines for paddy, wheat, potato, and maize across Bangladesh agricultural hubs.",
    subtitleBn: "রাজশাহী, দিনাজপুর, বগুড়া ও নওগাঁর আড়তসমূহের পাইকারি বাজারদর বিশ্লেষণ ও ধান ১২% আর্দ্রতায় শুকিয়ে বেশি দামে বিক্রির রণকৌশল।",
    authorEn: "AgriVision Agricultural Economics Research",
    authorBn: "এগ্রিভিশন কৃষি অর্থনীতি ও বাজারজাতকরণ সেল",
    date: "সেপ্টেম্বর ২০২৬",
    relatedFeatureId: "market",
    overviewEn:
      "Farmers often lose up to 20-30% of their potential income by selling damp grain immediately upon harvest when mandis are flooded with supply. AgriVision's Market Predictor analyzes historic seasonal trends, storage cost trade-offs, and government procurement rates to identify the optimal 3-week selling window.",
    overviewBn:
      "ফসল কাটার মৌসুমে বাজারে সরবরাহ বেশি থাকায় কৃষকরা কম দামে কাঁচা ধান বিক্রি করে বড় ধরনের আর্থিক ক্ষতির শিকার হন। এগ্রিভিশন মার্কেট প্রেডিক্টর বিগত ১০ বছরের বাজার দর, গুদামজাতকরণ খরচ ও সরকারি ক্রয়মূল্য বিশ্লেষণ করে ফসল বিক্রির লাভজনক সময় প্রদর্শন করে।",
    keyPointsEn: [
      "Forecasts wholesale prices for BRRI Dhan-28, Miniket, Potato, and Maize",
      "Analyzes the breakeven return between immediate field sale vs. 60-day storage",
      "Guides proper grain moisture reduction to 12% to prevent mold and weight loss penalties",
      "Tracks government procurement targets and minimum support price announcements"
    ],
    keyPointsBn: [
      "ব্রি-২৮, মিনিকেট, স্বর্ণা, আলু ও ভুট্টার পাইকারি দামের আগামী ২-৪ মাসের পূর্বাভাস দেয়",
      "মাঠ থেকে সাথে সাথে বিক্রি বনাম ৬০ দিন গুদামে রাখার নিট লাভ-ক্ষতির তুলনা করে",
      "ধানে ফাঙ্গাস রোধ ও সঠিক ওজন বজায় রাখতে আর্দ্রতা ১২% এ নামানোর পদ্ধতি শেখায়",
      "সরকারি খাদ্য গুদামে ধান সংগ্রহের লক্ষ্যমাত্রা ও দর সংক্রান্ত তথ্য প্রদান করে"
    ],
    sectionsEn: [
      {
        heading: "1. The Economics of the 12% Grain Moisture Standard",
        body: "Freshly harvested paddy typically carries 22-26% moisture. If stored moist, respiration generates internal heat, causing fungal mycotoxins (aflatoxin) and discoloration. Proper sun drying on drying yards (চাতাল) for 2-3 days brings moisture down to 12-14%, allowing 6-8 months safe storage and unlocking ৳150-৳250 extra profit per maund.",
        tips: [
          "Use a digital grain moisture meter or traditional tooth-bite hardness test",
          "Store grains in airtight hermetic bags (PICS bags) or galvanized bins",
          "Place storage bags on wooden pallets raised 15cm from concrete floors"
        ]
      }
    ],
    sectionsBn: [
      {
        heading: "১. ধানের আর্দ্রতা ১২% এ নামানোর অর্থনৈতিক গুরুত্ব",
        body: "মাঠ থেকে কাটার সময় ধানে ২২-২৬% আর্দ্রতা থাকে। কাঁচা ধান বস্তাবন্দী রাখলে ভ্যাপসা গরমে ভেতরে বিষাক্ত ছত্রাক জন্মায় ও চাল লালচে হয়ে যায়। ২-৩ দিন রোদে ভালো করে শুকিয়ে আর্দ্রতা ১২-১৪% এ নামিয়ে আনলে ধান ৬-৮ মাস নিরাপদে সংরক্ষণ করা যায় এবং মণপ্রতি অতিরিক্ত ১৫০-২৫০ টাকা বেশি দাম পাওয়া যায়।",
        tips: [
          "দাঁতে কেটে 'কট' করে ভেঙে গেলে বোঝা যায় ধান সংরক্ষণের উপযুক্ত হয়েছে",
          "বায়ুরোধী পিক্স (PICS) ব্যাগ অথবা ড্রামে ধান সংরক্ষণ করুন",
          "মেঝের আর্দ্রতা থেকে রক্ষা পেতে কাঠের তক্তার (প্যালেট) ওপর বস্তা রাখুন"
        ]
      }
    ],
    practicalRulesEn: [
      "Never sell your entire harvest in the first 10 days of peak harvesting",
      "Form village cluster cooperatives to collectively transport grain to district wholesale mandis",
      "Consult the AgriVision Market Intelligence module weekly for live mandi trend updates"
    ],
    practicalRulesBn: [
      "ফসল কাটার প্রথম ১০ দিনের মধ্যে পুরো ফসল কখনো একবারে বিক্রি করবেন না",
      "গ্রামের কয়েকজন কৃষক মিলে একত্রিত হয়ে সরাসরি বড় আড়তে বা সরকারি গুদামে ধান দিন",
      "সাপ্তাহিক বাজারদরের উঠানামা জানতে এগ্রিভিশন মার্কেট মডিউল নিয়মিত দেখুন"
    ]
  },

  hyperlocal_microclimate: {
    id: "hyperlocal_microclimate",
    categoryEn: "Agro-Meteorology & Synoptic Analysis",
    categoryBn: "কৃষি আবহাওয়া ও কালবৈশাখী আগাম বার্তা",
    readTime: "৪ মিনিট পাঠ",
    titleEn: "Hyper-Local Microclimate: Synoptic Forecasts & Kalbaishakhi Storm Preparedness",
    titleBn: "হাইপার-লোকাল আবহাওয়া: কালবৈশাখী, শিলাবৃষ্টি ও অতিবৃষ্টি মোকাবেলায় আগাম প্রস্তুতি",
    subtitleEn: "High-resolution 7-day meteorological modeling tuned to Bangladesh's Agro-Ecological Zones (AEZ).",
    subtitleBn: "বাংলাদেশের ৩০টি কৃষি-বাস্তুতান্ত্রিক অঞ্চলের (AEZ) ওপর ভিত্তি করে ৭ দিনের আবহাওয়ার পূর্বাভাস, বাষ্পীভবন সূচক ও আকস্মিক দুর্যোগ প্রস্তুতি।",
    authorEn: "AgriVision Synoptic Meteorology Wing",
    authorBn: "এগ্রিভিশন সিনপটিক আবহাওয়া ও দুর্যোগ ব্যবস্থাপনা সেল",
    date: "সেপ্টেম্বর ২০২৬",
    relatedFeatureId: "weather",
    overviewEn:
      "Generic weather forecasts fail to capture localized convective thunderstorms (Kalbaishakhi) and micro-fog valleys in the northern Barind tract. AgriVision downscales atmospheric models using live ground station telemetry, giving farmers advance notice of hailstorms, sudden gale-force winds, and atmospheric vapor deficits.",
    overviewBn:
      "জাতীয় পর্যায়ের সাধারণ আবহাওয়া পূর্বাভাসে স্থানীয় কালবৈশাখী বা উত্তরের বরেন্দ্র অঞ্চলের গভীর কুয়াশা সঠিকভাবে প্রতিফলিত হয় না। এগ্রিভিশন স্থানীয় উপাত্ত বিশ্লেষণ করে শিলাবৃষ্টি, ভারী বর্ষণ ও আকস্মিক ঝড়ের আগাম বার্তা প্রদান করে যাতে মাঠের পাকা ফসল রক্ষা করা সম্ভব হয়।",
    keyPointsEn: [
      "7-day hourly temperature, humidity, dew point, and solar radiation modeling",
      "Convective storm alerts 24-48 hours before squall arrival",
      "Calculates Daily Evapotranspiration (ET0) to calibrate irrigation runs",
      "Integrated crop lodging risk index based on wind gust velocities"
    ],
    keyPointsBn: [
      "৭ দিনের প্রতি ঘণ্টার তাপমাত্রা, বাতাসের আর্দ্রতা, শিশিরাঙ্ক ও সূর্যালোকের পূর্বাভাস",
      "ঝড় ও বজ্রপাতের ২৪ থেকে ৪৮ ঘণ্টা পূর্বে বিশেষ কালবৈশাখী সতর্কবার্তা",
      "সেচ পরিচালনার জন্য দৈনিক সম্ভাব্য বাষ্পীভবন (ET0) মান নির্ণয়",
      "ঝড়ো বাতাসের গতির ওপর ভিত্তি করে ধান গাছ হেলে পড়ার ঝুঁকি বিশ্লেষণ"
    ],
    sectionsEn: [
      {
        heading: "1. Protecting Standing Crops from Convective Storms",
        body: "During the March-May transition, sudden squalls with hail can shatter 80% ripe paddy panicles within 15 minutes. When wind gusts exceed 45 km/h and convective cloud tops reach 12km, farmers are advised to harvest all plots that have achieved 80% golden ripeness immediately.",
        tips: [
          "Harvest paddy if 80% of grains in the panicle have turned straw-yellow",
          "Ensure perimeter ditches are dredged to discharge flood runoff within 2 hours",
          "Reinforce vegetable trellises and fruit tree stakes before gale fronts arrive"
        ]
      }
    ],
    sectionsBn: [
      {
        heading: "১. কালবৈশাখী ও শিলাবৃষ্টি থেকে ফসল রক্ষার তাৎক্ষণিক কৌশল",
        body: "মার্চ থেকে মে মাসে আকস্মিক কালবৈশাখী ও শিলাবৃষ্টির কারণে পাকা ধানের অপূরণীয় ক্ষতি হয়। বাতাসের গতিবেগ ৪৫ কিমি/ঘণ্টা ছাড়িয়ে যাওয়ার পূর্বাভাস পেলে জমিতে ৮০ ভাগ ধান পেকে থাকলে তা অবিলম্বে কেটে নিরাপদ স্থানে তুলে নেওয়া উচিত।",
        tips: [
          "শীষের শতকরা ৮০ ভাগ ধান সোনালী হলে কালবিলম্ব না করে কেটে ফেলুন",
          "জমির চারপাশের নালাগুলো পরিষ্কার রাখুন যাতে বৃষ্টির পানি দ্রুত নেমে যায়",
          "লাউ, শিম বা শাকসবজির মাচা মজবুত বাঁশের খুঁটি দিয়ে বেঁধে রাখুন"
        ]
      }
    ],
    practicalRulesEn: [
      "Check the 48-hour rainfall probability before applying granular fertilizers or chemicals",
      "If 80% of the rice panicle is mature, initiate emergency early harvesting before predicted hailstorms",
      "Keep drainage canals free of water hyacinths and silt"
    ],
    practicalRulesBn: [
      "সার বা কীটনাশক দেওয়ার আগে আগামী ৪৮ ঘণ্টার বৃষ্টির সম্ভাবনা দেখে নিন",
      "শীষের ৮০% ধান পরিপক্ব হলে শিলাবৃষ্টির আগে দ্রুত কেটে ফেলা বিজ্ঞতার কাজ",
      "ড্রেনেজ নালা থেকে কচুরিপানা ও পলি অপসারণ করে পানির প্রবাহ স্বাভাবিক রাখুন"
    ]
  },
};

interface ArticleModalProps {
  articleId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isBn: boolean;
  onEnterAppFeature?: (featureKey: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  articleId,
  isOpen,
  onClose,
  isBn,
  onEnterAppFeature,
}) => {
  if (!isOpen || !articleId) return null;

  const article = FEATURE_ARTICLES[articleId] || FEATURE_ARTICLES.ai_crop_doctor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#0c1322] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {isBn ? article.categoryBn : article.categoryEn}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* Article Title & Subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {isBn ? article.titleBn : article.titleEn}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {isBn ? article.subtitleBn : article.subtitleEn}
            </p>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>{isBn ? article.authorBn : article.authorEn}</span>
              <span>•</span>
              <span>{article.date}</span>
            </div>
          </div>

          {/* Overview Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? "সারসংক্ষেপ ও মাঠের গুরুত্ব" : "Executive Overview & Agronomic Impact"}</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/90 dark:text-emerald-100/90 leading-relaxed font-normal">
              {isBn ? article.overviewBn : article.overviewEn}
            </p>
          </div>

          {/* Key Insights Pills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>{isBn ? "মূল বৈজ্ঞানিক বিষয়সমূহ" : "Key Scientific Findings"}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(isBn ? article.keyPointsBn : article.keyPointsEn).map((pt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Structured Detailed Sections */}
          <div className="space-y-6 pt-2">
            {(isBn ? article.sectionsBn : article.sectionsEn).map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  {sec.heading}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sec.body}
                </p>

                {sec.tips && sec.tips.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isBn ? "মাঠের ব্যবহারিক পরামর্শ" : "Field Scouting Tips"}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/90 dark:text-amber-100/90">
                      {sec.tips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Golden Rules for Farmers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 dark:border dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? "কৃষক ভাইদের জন্য ৩টি সুবর্ণ নিয়ম" : "3 Golden Rules for Farmers"}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              {(isBn ? article.practicalRulesBn : article.practicalRulesEn).map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold font-mono">0{idx + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="sticky bottom-0 px-6 py-4 bg-slate-50 dark:bg-[#0c1322] border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {isBn
              ? "এগ্রিভিশন ডিজিটাল গবেষণাগার দ্বারা সত্যায়িত ও সার্বক্ষণিক হালনাগাদকৃত"
              : "Verified by AgriVision Digital Agronomy Framework"}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {isBn ? "বন্ধ করুন" : "Close Article"}
            </button>

            {onEnterAppFeature && (
              <button
                onClick={() => {
                  onClose();
                  onEnterAppFeature(article.relatedFeatureId);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <span>{isBn ? "ড্যাশবোর্ডে এই ফিচারটি খুলুন" : "Open in Workspace"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
