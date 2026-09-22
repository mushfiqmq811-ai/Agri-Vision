import React from "react";
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Compass,
  Gauge,
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { WeatherPayload, Language, GeoField } from "../types";

interface Props {
  weather: WeatherPayload | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  language: Language;
  selectedField: GeoField;
}

export const WeatherModule: React.FC<Props> = ({
  weather,
  loading,
  error,
  onRetry,
  language,
  selectedField,
}) => {
  const isBn = language === "bn";

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="font-bold text-slate-800 text-base">
          {isBn ? "লাইভ আবহাওয়া উপাত্ত আনা হচ্ছে..." : "Querying Live Open-Meteo Synoptic Model..."}
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-mono">
          Coordinates: {selectedField.coordinates[0].toFixed(4)}°N, {selectedField.coordinates[1].toFixed(4)}°E
        </p>
      </div>
    );
  }

  if (error || !weather?.data?.current) {
    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 text-base mb-1">
          {isBn ? "আবহাওয়া উপাত্ত পেতে ত্রুটি হয়েছে" : "Weather Feed Disruption"}
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
          {error || "Unable to parse Open-Meteo numerical weather forecast stream."}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition cursor-pointer"
        >
          {isBn ? "পুনরায় চেষ্টা করুন" : "Retry Open-Meteo Connection"}
        </button>
      </div>
    );
  }

  const current = weather.data.current;
  const hourly = weather.data.hourly;
  const daily = weather.data.daily;

  // Format hourly chart data (next 24 hours)
  const hourlyChartData = (hourly?.time || []).slice(0, 24).map((timeStr, idx) => {
    const d = new Date(timeStr);
    const hourLabel = d.toLocaleTimeString([], { hour: "numeric" });
    return {
      hour: hourLabel,
      temp: hourly?.temperature_2m?.[idx] ?? 0,
      rainProb: hourly?.precipitation_probability?.[idx] ?? 0,
      et0: hourly?.et0_fao_evapotranspiration?.[idx] ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header with Source & Scientific Transparency */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {isBn ? "লাইভ উন্মুক্ত আবহাওয়া তথ্য" : "LIVE NUMERICAL WEATHER INTELLIGENCE"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
              Open-Meteo ECMWF
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {isBn
              ? `${selectedField.nameBn} মাইক্রোক্লাইমেট`
              : `${selectedField.name} Synoptic & Atmospheric Feed`}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(weather.timestamp).toLocaleTimeString()}</span>
          </span>
          <span>&bull;</span>
          <span>
            {weather.coordinates.lat.toFixed(3)}°N, {weather.coordinates.lon.toFixed(3)}°E
          </span>
        </div>
      </div>

      {/* Current Conditions Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>{isBn ? "বায়ুর তাপমাত্রা" : "Temperature"}</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {current.temperature_2m}°C
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isBn ? "অনুভূত:" : "Feels:"} {current.apparent_temperature}°C
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>{isBn ? "আপেক্ষিক আর্দ্রতা" : "Humidity"}</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {current.relative_humidity_2m}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {current.relative_humidity_2m > 80 ? "High Disease Risk" : "Normal Canopy"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>{isBn ? "বর্তমান বৃষ্টিপাত" : "Precipitation"}</span>
            <CloudRain className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {current.precipitation} <span className="text-sm font-semibold">mm</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isBn ? "বৃষ্টিপাতের তীব্রতা" : "Rate: Current"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>{isBn ? "বায়ুপ্রবাহ" : "Wind Speed"}</span>
            <Wind className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {current.wind_speed_10m} <span className="text-sm font-semibold">km/h</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {current.wind_direction_10m}° Heading
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>{isBn ? "মাটির তাপমাত্রা" : "Soil Temp (0-10cm)"}</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {current.soil_temperature_0_to_10cm ?? 24.5}°C
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Rhizosphere Depth
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>{isBn ? "বাষ্পীভবন (ET₀)" : "Ref Evapo (ET₀)"}</span>
            <Sun className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {daily?.et0_fao_evapotranspiration?.[0]?.toFixed(1) ?? "3.8"}{" "}
            <span className="text-sm font-semibold">mm</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
            FAO-56 Daily Rate
          </div>
        </div>
      </div>

      {/* 24-Hour Diurnal Chart */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "পরবর্তী ২৪ ঘণ্টার তাপমাত্রা ও বৃষ্টির সম্ভাবনা" : "24-Hour Microclimate Diurnal Trajectory"}
            </h3>
            <p className="text-xs text-slate-500">
              {isBn ? "প্রতি ঘণ্টার তাপমাত্রা (°C) ও বৃষ্টিপাতের সম্ভাবনা (%)" : "Hourly Temperature (°C) vs Precipitation Probability (%)"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span>Temperature (°C)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span>Rain Probability (%)</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tickLine={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tickLine={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area type="monotone" dataKey="temp" stroke="#15803d" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" name="Temp (°C)" />
              <Area type="monotone" dataKey="rainProb" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#rainGradient)" name="Rain Prob (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 15-Day Synoptic Weather Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? "১৫ দিনের আবহাওয়া ও সেচ পরিকল্পনা পূর্বাভাস" : "15-Day Synoptic Crop Forecast & Evapotranspiration Matrix"}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Open-Meteo Ensemble 16-Day
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{isBn ? "তারিখ" : "Date"}</th>
                <th className="py-3 px-3">{isBn ? "সর্বোচ্চ / সর্বনিম্ন" : "Max / Min Temp"}</th>
                <th className="py-3 px-3">{isBn ? "বৃষ্টিপাত" : "Rainfall (mm)"}</th>
                <th className="py-3 px-3">{isBn ? "বৃষ্টির সম্ভাবনা" : "Rain Prob"}</th>
                <th className="py-3 px-3">{isBn ? "বাষ্পীভবন (ET₀)" : "ET₀ (mm/d)"}</th>
                <th className="py-3 px-3">{isBn ? "বায়ুর গতি" : "Max Wind"}</th>
                <th className="py-3 px-4">{isBn ? "সেচ পূর্বাভাস পরামর্শ" : "Irrigation Outlook"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(daily?.time || []).slice(0, 15).map((dateStr, idx) => {
                const dateObj = new Date(dateStr);
                const isToday = idx === 0;
                const rain = daily?.precipitation_sum?.[idx] ?? 0;
                const rainProb = daily?.precipitation_probability_max?.[idx] ?? 0;
                const maxTemp = daily?.temperature_2m_max?.[idx] ?? 0;
                const minTemp = daily?.temperature_2m_min?.[idx] ?? 0;
                const et0 = daily?.et0_fao_evapotranspiration?.[idx] ?? 3.5;
                const wind = daily?.wind_speed_10m_max?.[idx] ?? 10;

                let outlook = isBn ? "পরিমিত সেচ" : "Normal Irrigation";
                let outlookColor = "text-slate-700 bg-slate-100";
                if (rain > 10) {
                  outlook = isBn ? "সেচ বন্ধ রাখুন (বৃষ্টি)" : "Hold Irrigation (Rain)";
                  outlookColor = "text-sky-800 bg-sky-100";
                } else if (maxTemp > 35) {
                  outlook = isBn ? "হালকা অতিরিক্ত সেচ (তাপপ্রবাহ)" : "Supplemental Evapo Pulse";
                  outlookColor = "text-amber-800 bg-amber-100";
                }

                return (
                  <tr
                    key={dateStr}
                    className={`hover:bg-slate-50/80 transition ${
                      isToday ? "bg-emerald-50/50 font-medium" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {dateObj.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      {isToday && (
                        <span className="text-[10px] text-emerald-800 font-bold uppercase">
                          {isBn ? "আজ" : "Today"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">
                      <span className="text-slate-900">{maxTemp}°</span> /{" "}
                      <span className="text-slate-400">{minTemp}°C</span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {rain > 0 ? (
                        <span className="font-bold text-sky-700">{rain.toFixed(1)} mm</span>
                      ) : (
                        <span className="text-slate-400">0.0 mm</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full"
                            style={{ width: `${rainProb}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-600">{rainProb}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {et0.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {wind.toFixed(0)} km/h
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${outlookColor}`}>
                        {outlook}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
