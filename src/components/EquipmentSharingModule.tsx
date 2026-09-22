import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Wrench,
  Calendar,
  MessageSquare,
  BadgeDollarSign,
  PlusCircle,
  Truck,
  CheckCircle,
  Clock,
  PhoneCall,
} from "lucide-react";
import { Language } from "../types";

interface Props {
  language: Language;
}

interface Equipment {
  id: string;
  nameEn: string;
  nameBn: string;
  ownerName: string;
  ownerContact: string;
  ratePerDayTk: number;
  location: string;
  locationBn: string;
  availability: "Available" | "Rented" | "Maintenance";
  availabilityBn: "সহজলভ্য" | "ভাড়াকৃত" | "মেরামতধীন";
  imageLabel: string;
}

export const EquipmentSharingModule: React.FC<Props> = ({ language }) => {
  const isBn = language === "bn";

  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: "eq-1",
      nameEn: "Modern Rotary Power Tiller",
      nameBn: "রোটারি পাওয়ার টিলার",
      ownerName: "মোঃ হাসিবুল ইসলাম (রাজশাহী)",
      ownerContact: "+8801712000000",
      ratePerDayTk: 1200,
      location: "North Paba, Rajshahi",
      locationBn: "উত্তর পবা, রাজশাহী",
      availability: "Available",
      availabilityBn: "সহজলভ্য",
      imageLabel: "🚜 Tiller",
    },
    {
      id: "eq-2",
      nameEn: "Submersible Solar Irrigation Water Pump",
      nameBn: "সৌর সেচ পানির পাম্প",
      ownerName: "করিম চাচা (দিনাজপুর)",
      ownerContact: "+8801713000000",
      ratePerDayTk: 600,
      location: "Birganj, Dinajpur",
      locationBn: "বীরগঞ্জ, দিনাজপুর",
      availability: "Available",
      availabilityBn: "সহজলভ্য",
      imageLabel: "💧 Solar Pump",
    },
    {
      id: "eq-3",
      nameEn: "Mini Combine Paddy Harvester",
      nameBn: "মিনি কম্বাইন ধান কাটার মেশিন",
      ownerName: "ডঃ শরিফুল আলম (বগুড়া)",
      ownerContact: "+8801714000000",
      ratePerDayTk: 3500,
      location: "Kahalu, Bogura",
      locationBn: "কাহালু, বগুড়া",
      availability: "Rented",
      availabilityBn: "ভাড়াকৃত",
      imageLabel: "🌾 Harvester",
    },
    {
      id: "eq-4",
      nameEn: "Autonomous Smart Drone Sprayer",
      nameBn: "ড্রোন কীটনাশক স্প্রেয়ার",
      ownerName: "রাজশাহী কৃষি বিশ্ববিদ্যালয় সমবায়",
      ownerContact: "+8801715000000",
      ratePerDayTk: 2000,
      location: "University Campus, Rajshahi",
      locationBn: "বিশ্ববিদ্যালয় ক্যাম্পাস, রাজশাহী",
      availability: "Available",
      availabilityBn: "সহজলভ্য",
      imageLabel: "🚁 Drone",
    },
  ]);

  // Rent booking modal state
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const [rentDays, setRentDays] = useState(3);
  const [isBooked, setIsBooked] = useState(false);

  // New Equipment Add Form state
  const [newEqName, setNewEqName] = useState("");
  const [newEqRate, setNewEqRate] = useState(800);
  const [newEqOwner, setNewEqOwner] = useState("");

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName.trim() || !newEqOwner.trim()) return;

    const newEq: Equipment = {
      id: `eq-${Date.now()}`,
      nameEn: newEqName,
      nameBn: newEqName, // copy for safety
      ownerName: newEqOwner,
      ownerContact: "+8801700112233",
      ratePerDayTk: Number(newEqRate),
      location: "Local Upazila Center",
      locationBn: "স্থানীয় উপজেলা কেন্দ্র",
      availability: "Available",
      availabilityBn: "সহজলভ্য",
      imageLabel: "⚙️ Equipment",
    };

    setEquipments((prev) => [...prev, newEq]);
    setNewEqName("");
    setNewEqOwner("");
    alert(isBn ? "আপনার কৃষি যন্ত্রপাতি সফলভাবে শেয়ারিং হাবে তালিকাভুক্ত হয়েছে!" : "Your machinery has been listed successfully in the sharing hub!");
  };

  const handleBookingSubmit = () => {
    setIsBooked(true);
    setTimeout(() => {
      setSelectedEq(null);
      setIsBooked(false);
      alert(
        isBn
          ? `সফল বুকিং! মোট ভাড়া: ৳${(selectedEq?.ratePerDayTk ?? 0) * rentDays} টাকা। বুকিং আইডি: BK-${Date.now().toString().slice(-6)}`
          : `Booking Confirmed! Total Rent: ৳${(selectedEq?.ratePerDayTk ?? 0) * rentDays} BDT.`
      );
    }, 1000);
  };

  return (
    <div className="bg-[#FCF9F2] dark:bg-slate-900 rounded-3xl p-6 border-2 border-[#1B3B2B] dark:border-emerald-800 shadow-md vintage-manuscript-paper space-y-6">
      
      {/* Title block */}
      <div className="border-b border-[#1B3B2B]/20 dark:border-emerald-800/20 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1B3B2B]/10 text-[#1B3B2B] flex items-center justify-center border border-[#1B3B2B]/20">
            <Wrench className="w-5 h-5 text-[#9A3412]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#1B3B2B] dark:text-emerald-400 font-display">
              {isBn ? "আধুনিক কৃষি যন্ত্রপাতি শেয়ারিং হাব" : "Smart Equipment Sharing Hub"}
            </h3>
            <p className="text-[11px] text-[#5C4033] dark:text-stone-400">
              {isBn 
                ? "কৃষকদের নিজস্ব উদ্যোগে পাওয়ার টিলার ও পানির পাম্প ভাড়া আদান-প্রদান নেটওয়ার্ক" 
                : "Peer-to-peer machinery leasing network bypasses broker markups"}
            </p>
          </div>
        </div>
        <div className="wax-seal rounded-full w-9 h-9 text-white font-sans text-[10px] font-bold">
          HUB
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Listed Machinery Grid */}
        <div className="lg:col-span-8 space-y-4">
          <h4 className="text-xs uppercase font-extrabold text-[#5C4033] dark:text-stone-300 tracking-wider">
            {isBn ? "ভাড়ার জন্য উপলব্ধ যন্ত্রপাতিসমূহ" : "Available Machinery Catalogue"}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {equipments.map((eq) => (
              <div
                key={eq.id}
                className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-[#1B3B2B]/15 hover:border-[#1B3B2B]/35 hover:shadow-xs transition flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                {/* Vintage stamp image replacement label */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-display text-[#1B3B2B] dark:text-emerald-400">
                    {eq.imageLabel}
                  </span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    eq.availability === "Available"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {isBn ? eq.availabilityBn : eq.availability}
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-black text-stone-800 dark:text-stone-100 uppercase tracking-wide">
                    {isBn ? eq.nameBn : eq.nameEn}
                  </h5>
                  <div className="text-[10px] text-stone-400 mt-1">
                    📍 {isBn ? eq.locationBn : eq.location}
                  </div>
                  <div className="text-[10px] text-[#5C4033] dark:text-stone-300 mt-0.5">
                    Owner: <span className="font-semibold">{eq.ownerName}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-[#1B3B2B]/10 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-[#9A3412] font-mono">৳{eq.ratePerDayTk}</span>
                    <span className="text-[9px] text-stone-400"> / {isBn ? "দিন" : "Day"}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (eq.availability !== "Available") {
                        alert(isBn ? "দুঃখিত, এই যন্ত্রটি বর্তমানে অন্য জমিতে ভাড়াকৃত রয়েছে।" : "Machinery currently leased elsewhere.");
                        return;
                      }
                      setSelectedEq(eq);
                    }}
                    className={`text-[10px] font-bold py-1.5 px-3 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                      eq.availability === "Available"
                        ? "bg-[#1B3B2B] hover:bg-[#204935] text-white"
                        : "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
                    }`}
                  >
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>{isBn ? "ভাড়া নিন" : "Rent Now"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: List New Machinery for Rent Form */}
        <div className="lg:col-span-4 bg-[#FAF7F0] dark:bg-slate-950 p-4 rounded-2xl border border-[#1B3B2B]/20 h-fit space-y-4">
          <h4 className="text-xs uppercase font-extrabold text-[#1B3B2B] dark:text-emerald-400 flex items-center gap-1">
            <PlusCircle className="w-4 h-4 text-[#9A3412]" />
            <span>{isBn ? "আপনার যন্ত্রপাতি শেয়ার করুন" : "Rent Out Your Machine"}</span>
          </h4>

          <form onSubmit={handleAddEquipment} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-stone-400">{isBn ? "যন্ত্রপাতির নাম" : "Equipment Name"}</label>
              <input
                type="text"
                value={newEqName}
                onChange={(e) => setNewEqName(e.target.value)}
                placeholder="যেমন: ৩ হর্সপাওয়ার মোটর পাম্প"
                className="w-full bg-white dark:bg-slate-900 border border-[#1B3B2B]/20 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-stone-400">{isBn ? "ভাড়া প্রতি দিন (৳ টাকা)" : "Lease Rate / Day (Tk)"}</label>
              <input
                type="number"
                value={newEqRate}
                onChange={(e) => setNewEqRate(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-[#1B3B2B]/20 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-stone-400">{isBn ? "মালিকের নাম" : "Your Full Name"}</label>
              <input
                type="text"
                value={newEqOwner}
                onChange={(e) => setNewEqOwner(e.target.value)}
                placeholder="যেমন: জিয়াউর রহমান"
                className="w-full bg-white dark:bg-slate-900 border border-[#1B3B2B]/20 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#9A3412] text-white hover:bg-[#ae3b14] text-[11px] font-bold py-2 rounded-xl transition cursor-pointer"
            >
              {isBn ? "শেয়ারিং হাবে যুক্ত করুন" : "Post to Rent Out Pool"}
            </button>
          </form>

          <div className="p-3 bg-white dark:bg-slate-900 border border-[#1B3B2B]/10 rounded-xl space-y-1">
            <span className="text-[9px] font-extrabold uppercase text-[#1B3B2B] dark:text-emerald-400 block">
              💡 {isBn ? "কমিশন শূন্য" : "Zero Commission Policy"}
            </span>
            <p className="text-[9px] text-stone-500 leading-relaxed">
              {isBn 
                ? "এগ্রিভিশন কোনো চার্জ বা কমিশন নেয় না। সরাসরি চাষীদের লাভ নিশ্চিত করে।" 
                : "Rent directly from verified neighbors with 100% payout alignment."}
            </p>
          </div>
        </div>

      </div>

      {/* Booking Dialog Modal Simulation */}
      {selectedEq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCF9F2] text-[#5C4033] dark:bg-slate-950 dark:text-stone-200 p-6 rounded-3xl max-w-sm w-full border-2 border-[#1B3B2B] space-y-5">
            <div>
              <span className="text-[9px] uppercase font-bold font-mono text-[#9A3412]">Machinery Rental Confirmation</span>
              <h3 className="text-base font-black font-display text-stone-800 dark:text-stone-100">
                {isBn ? selectedEq.nameBn : selectedEq.nameEn}
              </h3>
              <p className="text-[10px] text-stone-400 mt-1">Owner: {selectedEq.ownerName} &bull; {selectedEq.location}</p>
            </div>

            <div className="space-y-2 border-t border-b border-[#1B3B2B]/10 py-3 text-xs">
              <div className="flex items-center justify-between">
                <span>{isBn ? "ভাড়া প্রতি দিন:" : "Lease Daily Fee:"}</span>
                <span className="font-bold">৳{selectedEq.ratePerDayTk} Tk</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400 block">{isBn ? "ভাড়ার মেয়াদ (দিন)" : "Lease Duration (Days)"}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rentDays}
                    onChange={(e) => setRentDays(Number(e.target.value))}
                    className="w-full accent-[#1B3B2B]"
                  />
                  <span className="font-extrabold text-stone-800 dark:text-stone-200 w-8 text-right shrink-0">{rentDays} {isBn ? "দিন" : "Days"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between font-extrabold text-sm border-t border-dashed border-stone-200 pt-2 text-[#9A3412]">
                <span>{isBn ? "মোট ভাড়া পরিশোধযোগ্য:" : "Rent Total Payable:"}</span>
                <span>৳{selectedEq.ratePerDayTk * rentDays} Tk</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedEq(null)}
                className="bg-[#FAF7F0] hover:bg-stone-200 border border-stone-200 text-[#5C4033] font-bold text-xs py-2 rounded-xl cursor-pointer"
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>

              <button
                onClick={handleBookingSubmit}
                disabled={isBooked}
                className="bg-[#1B3B2B] hover:bg-[#204935] text-white font-bold text-xs py-2 rounded-xl cursor-pointer"
              >
                {isBooked ? "Processing..." : (isBn ? "নিশ্চিত করুন" : "Confirm Lease")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
