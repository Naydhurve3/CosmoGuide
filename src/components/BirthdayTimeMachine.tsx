import React, { useState } from "react";
import { Telescope, Calendar, Newspaper, ArrowRight, RefreshCw, Mail, Phone, Sun } from "lucide-react";

export default function BirthdayTimeMachine() {
  const [birthday, setBirthday] = useState("1995-05-14");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    date: string;
    headline: string;
    title: string;
    explanation: string;
    imageUrl: string;
    astrologicalSymbol: string;
  } | null>(null);

  const [emailValue, setEmailValue] = useState("");
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const handleCalculateBirthdaySpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthday) return;
    setLoading(true);
    setResult(null);
    setEmailStatus(null);

    try {
      const res = await fetch("/api/birthday-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: birthday })
      });

      if (!res.ok) throw new Error("Time telemetry error.");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed reading temporal data records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue) return;
    setEmailStatus("preparing");
    setTimeout(() => {
      setEmailStatus("dispatched");
    }, 1200);
  };

  return (
    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left shadow-2xl relative overflow-hidden">
      <div className="flex items-center space-x-2.5 mb-2">
        <Telescope className="w-5 h-5 text-indigo-400 animate-pulse" />
        <h4 className="font-bold text-white uppercase tracking-wider text-sm">
          Stellar "Time Machine" Hubble Gazette
        </h4>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
        Input your exact birthday or historical event date to reveal the majestic cosmic nursery photographed by the Hubble or James Webb telescopes on that day.
      </p>

      {/* Date Select Panel Form */}
      <form onSubmit={handleCalculateBirthdaySpace} className="flex flex-col sm:flex-row gap-3 items-end mb-6 bg-slate-950/40 p-4 rounded-xl border border-indigo-500/5">
        <div className="flex-grow">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Pick Event / Birthday Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-indigo-400 pointer-events-none" />
            <input
              type="date"
              required
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 pl-10 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 transition font-mono cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto p-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-550 border border-indigo-500/20 text-white font-bold text-xs tracking-wider transition uppercase flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-605/20 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Querying archives...</span>
            </>
          ) : (
            <>
              <span>Align Temporal Mirror</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      {/* Retro Newspaper Style result layout block */}
      {result && (
        <div className="p-5 bg-stone-105 border border-stone-300 text-stone-900 rounded-xl space-y-4 animate-fadeIn font-serif shadow-xl bg-[linear-gradient(to_bottom,rgba(255,253,245,1)_0%,rgba(240,238,228,1)_100%)]">
          {/* Header element of Galactic Gazette */}
          <div className="text-center space-y-1.5 border-b-2 border-stone-800 pb-3">
            <h5 className="text-[10px] tracking-widest font-sans uppercase font-bold text-stone-600">
              •• Astronomical Record Daily Bulletin ••
            </h5>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-center text-stone-950 uppercase border-y border-stone-800 py-1.5">
              The Galactic Gazette
            </h3>
            <div className="flex justify-between items-center text-[10px] font-sans font-bold text-stone-600 px-1 pt-1">
              <span>Date Logged: {result.date}</span>
              <span className="italic">Zodiac Core: {result.astrologicalSymbol}</span>
              <span>Price: 5 Light Years</span>
            </div>
          </div>

          {/* Newspaper Main Headline and story */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold uppercase leading-tight text-stone-950 tracking-tight text-left">
              {result.headline}
            </h2>

            {/* Simulated vintage photograph view */}
            <div className="relative border-4 border-double border-stone-800 p-1 bg-stone-950">
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-full h-48 sm:h-56 object-cover filter grayscale-15 brightness-90 contrast-105"
              />
              <div className="p-2 pt-1 font-sans text-[10px] text-stone-300 leading-snug text-left italic">
                Photo captured by Hubble Cosmic Cam mapping {result.title}.
              </div>
            </div>

            {/* Two column newspaper flow stories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] leading-relaxed text-stone-850 text-left pt-1 font-serif">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                Spectacular astronomical evidence was published confirming that on the month range of your birth stellar event, orbiting systems caught a massive energetic event across the distant universe. Experts at CosmoGuide Observatory observed a spectacular discharge of plasma winds.
              </p>
              <p>
                {result.explanation} The core details have been documented and cataloged into permanent satellite files. The cosmic structures verify that your zodiac sign, **{result.astrologicalSymbol}**, experienced standard space weather radiation levels corresponding to your specific date record.
              </p>
            </div>
          </div>

          {/* Download as Wallpaper, Email me this photo fields with instant simulate check */}
          <div className="border-t border-stone-400 pt-3 flex flex-col sm:flex-row justify-between items-center font-sans text-xs gap-3">
            <div className="text-stone-700">
              <span className="font-bold">Dispatch Digital Copy:</span>
            </div>

            <form onSubmit={handleEmailSimulation} className="flex gap-1.5 w-full sm:w-auto">
              <input
                type="email"
                required
                placeholder="stargazer@email.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                className="bg-white border border-stone-400 rounded p-1.5 px-3 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
              <button
                type="submit"
                className="p-1.5 px-3 rounded bg-stone-900 hover:bg-stone-800 text-white font-bold text-[10px] uppercase transition cursor-pointer"
              >
                Simulate Email
              </button>
            </form>

            <a
              href={result.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 px-3.5 rounded border border-stone-800 hover:bg-stone-200 text-stone-900 font-bold text-[10px] uppercase tracking-wide transition flex items-center space-x-1"
            >
              <span>Download Digital Poster</span>
            </a>
          </div>

          {/* Email dispatch alert */}
          {emailStatus === "preparing" && (
            <p className="text-[10px] text-stone-600 font-sans mt-2 animate-pulse text-left">
              Encrypting Galactic poster file into mail carrier packets...
            </p>
          )}
          {emailStatus === "dispatched" && (
            <div className="p-2 border border-emerald-300 text-emerald-800 bg-emerald-50 rounded text-[10px] font-sans text-left mt-2 leading-relaxed">
              <strong>Stellar Delivery:</strong> High resolution copy dispatched successfully to {emailValue}! Ready for your phone layout.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
