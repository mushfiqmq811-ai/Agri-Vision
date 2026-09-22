export type AppMode = "standard" | "farmer" | "researcher";
export type Language = "en" | "bn";

export type ActiveTab =
  | "dashboard"
  | "map"
  | "weather"
  | "soil"
  | "irrigation"
  | "cropDoctor"
  | "satellite"
  | "risk"
  | "simulator"
  | "analytics"
  | "sustainability"
  | "alerts"
  | "aiSummary"
  | "emailDesk"
  | "apiHealth";

export interface GeoField {
  id: string;
  name: string;
  nameBn: string;
  division: string;
  district: string;
  coordinates: [number, number]; // [lat, lon]
  areaBigha: number; // 1 Bigha = 1338 m²
  cropId: string;
  variety: string;
  sowingDate: string;
  currentStage: string;
  currentStageBn: string;
  stageProgressPct: number;
  soilType: string;
  soilTypeBn: string;
  polygon: [number, number][];
  currentMoisturePct: number;
  ndviAverage: number;
  irrigationMethod: "flood" | "drip" | "furrow" | "sprinkler";
  temperature?: number;
  humidity?: number;
  rainfallLast24h?: number;
  lastTelemetryUpdate?: string;
  telemetrySeq?: number;
  sensorStatus?: "online" | "syncing";
}

export interface CropProfile {
  id: string;
  name: string;
  nameBn: string;
  scientificName: string;
  category: "cereal" | "fiber" | "tuber" | "oilseed" | "pulse" | "fruit";
  popularVarieties: string[];
  durationDays: number;
  stages: {
    name: string;
    nameBn: string;
    durationDays: number;
    kc: number; // Crop coefficient
    rootDepthM: number;
    waterSensitivity: "low" | "medium" | "high" | "critical";
  }[];
  criticalDeficitTolerancePct: number; // e.g. 45%
  optimalTempRange: [number, number]; // [min, max] °C
  salinityToleranceEc: number; // dS/m
  commonDiseases: {
    name: string;
    nameBn: string;
    favorableConditions: string;
    symptoms: string;
    ipmControl: string;
    chemicalControl: string;
  }[];
}

export interface WeatherPayload {
  source: string;
  live: boolean;
  timestamp: string;
  coordinates: { lat: number; lon: number };
  data: {
    current?: {
      temperature_2m: number;
      relative_humidity_2m: number;
      apparent_temperature: number;
      precipitation: number;
      rain: number;
      weather_code: number;
      surface_pressure: number;
      wind_speed_10m: number;
      wind_direction_10m: number;
      soil_temperature_0_to_10cm?: number;
      soil_moisture_0_to_1cm?: number;
      soil_moisture_1_to_3cm?: number;
      soil_moisture_3_to_9cm?: number;
      soil_moisture_9_to_27cm?: number;
    };
    hourly?: {
      time: string[];
      temperature_2m: number[];
      relative_humidity_2m: number[];
      precipitation_probability: number[];
      precipitation: number[];
      evapotranspiration: number[];
      et0_fao_evapotranspiration: number[];
    };
    daily?: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_sum: number[];
      precipitation_probability_max: number[];
      et0_fao_evapotranspiration: number[];
      wind_speed_10m_max: number[];
    };
  };
}

export interface SoilGridsLayer {
  ph: number;
  socGkg: number; // organic carbon g/kg
  clayPct: number;
  sandPct: number;
  siltPct: number;
  nitrogenGkg: number;
  cecMmol: number;
  bulkDensityGcm3: number;
}

export interface SoilPayload {
  source: string;
  live: boolean;
  timestamp: string;
  layers: {
    "0-5cm": SoilGridsLayer;
    "5-15cm": SoilGridsLayer;
    "15-30cm": SoilGridsLayer;
  };
  texturalClass: string;
  fertilityRating: "Low" | "Medium" | "High" | "Optimal";
  drainageRate: "Rapid" | "Moderate" | "Slow" | "Poor";
}

export interface IrrigationRecommendation {
  action: "NO_IRRIGATION" | "DELAY_RAIN_EXPECTED" | "IMMEDIATE_IRRIGATION" | "SCHEDULE_IRRIGATION" | "ADEQUATE_MOISTURE";
  netIrrigationMm: number;
  grossIrrigationMm: number;
  volumeNeededM3PerBigha: number;
  estimatedPumpDurationMinutes: number;
  reasonEn: string;
  reasonBn: string;
  scientificCitation: string;
  calculatedAt: string;
  ETc: number;
  effectiveRainfallMm: number;
  readilyAvailableWaterMm: number;
  currentAvailableMm: number;
}

export interface CropDoctorDiagnosis {
  diseaseName: string;
  diseaseNameBn: string;
  pathogenType: string;
  confidenceScore: number;
  severityLevel: "Low" | "Moderate" | "Severe" | "Critical";
  visualEvidence: string[];
  underlyingCauses: string;
  organicRemedy: string[];
  chemicalTreatment: string[];
  preventionMeasures: string[];
  urgencyAction: string;
  urgencyActionBn: string;
}

export interface RiskForecastDay {
  dayIndex: number;
  date: string;
  overallRiskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number; // 0-100
  primaryRisk: string;
  primaryRiskBn: string;
  temperature: number;
  rainfallMm: number;
  humidityPct: number;
  advisoryEn: string;
  advisoryBn: string;
  blastFungalRiskIndex: number; // 0-100
  heatStressRiskIndex: number; // 0-100
  floodWaterloggingRiskIndex: number; // 0-100
  moistureDeficitRiskIndex: number; // 0-100
}

export interface SmartAlert {
  id: string;
  level: "critical" | "warning" | "advisory" | "info";
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  actionEn: string;
  actionBn: string;
  timestamp: string;
  acknowledged: boolean;
  category: "weather" | "irrigation" | "disease" | "pest" | "soil";
  autoDispatchedWhatsApp?: boolean;
  autoDispatchedEmail?: boolean;
}

export type ThemeMode = "light" | "dark";

export type UserRole = "farmer" | "agronomist" | "researcher" | "admin";

export interface User {
  id: string;
  name: string;
  nameBn: string;
  email: string;
  password?: string;
  phone?: string;
  whatsapp?: string;
  role: UserRole;
  district: string;
  zone?: string;
  organization?: string;
  avatarUrl?: string;
  assignedFieldIds: string[];
  preferredLanguage: Language;
  emailAlertsEnabled: boolean;
  selectedZones?: string[];
  alertPreferences?: { [key: string]: boolean };
}

export interface EmailSubscription {
  email: string;
  farmerName: string;
  district: string;
  enabled: boolean;
  frequency: "daily" | "weekly" | "critical_only";
  types: ("irrigation" | "disease_alert" | "weather_forecast" | "ai_summary")[];
  preferredHour: number; // e.g. 6 (6 AM)
  lastSentAt?: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  sender?: string;
  subject: string;
  subjectBn: string;
  timestamp: string;
  type: "daily_briefing" | "irrigation_alert" | "disease_warning" | "ai_summary" | "welcome_email";
  status: "delivered" | "simulated" | "pending";
  previewHtml: string;
  summarySnippet?: string;
}

export interface FarmerAiSummary {
  generatedAt: string;
  fieldId: string;
  fieldName: string;
  cropName: string;
  overallCondition: "excellent" | "good" | "watch_needed" | "critical_action";
  overallConditionBn: string;
  headlineEn: string;
  headlineBn: string;
  todayDoList: { textEn: string; textBn: string; priority: "high" | "normal" }[];
  todayDontList: { textEn: string; textBn: string }[];
  weatherAdvisory: { textEn: string; textBn: string };
  irrigationAdvice: { textEn: string; textBn: string; pumpAction: string };
  diseasePrecaution: { textEn: string; textBn: string };
  audioTextBn: string;
  audioTextEn: string;
  source: "gemini-3.8-flash" | "rule_based_engine" | "dynamic_agronomic_engine";
}

export interface ApiStatusReport {
  timestamp: string;
  services: {
    openMeteo: { name: string; status: string; latencyMs: number; error?: string };
    isricSoil: { name: string; status: string; latencyMs: number; error?: string };
    geminiVision: { name: string; status: string; configured: boolean; message?: string };
    copernicus: { name: string; status: string; configured: boolean; message?: string };
    thingSpeak: { name: string; status: string; configured: boolean; message?: string };
  };
}

