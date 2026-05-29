// CosmoGuide - AI Space Exploration Cockpit
// Created by: Nayan Dhurve (nayandhurve44@gmail.com)
// License: MIT

import React, { useState, useEffect } from "react";
import { CelestialBody } from "../types";
import { Scale, ChevronRight, Minimize } from "lucide-react";

export default function ComparePanel() {
  const [registry, setRegistry] = useState<CelestialBody[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"planet" | "star" | "galaxy">("planet");
  const [bodyLeftId, setBodyLeftId] = useState("");
  const [bodyRightId, setBodyRightId] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegistry() {
      try {
        const res = await fetch("/api/compare");
        if (!res.ok) throw new Error("Cosmic register linking anomaly.");
        const data = await res.json();
        setRegistry(data);

        // Prepopulate matching category items safely
        const filtered = data.filter((item: CelestialBody) => item.category === "planet");
        if (filtered.length >= 2) {
          setBodyLeftId(filtered[0].id);
          setBodyRightId(filtered[1].id);
        }
      } catch (err) {
        console.error("Failed downloading physical celestial database registries.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRegistry();
  }, []);

  const handleCategoryChange = (cat: "planet" | "star" | "galaxy") => {
    setSelectedCategory(cat);
    const filtered = registry.filter((item) => item.category === cat);
    if (filtered.length >= 2) {
      setBodyLeftId(filtered[0].id);
      setBodyRightId(filtered[1].id);
    } else if (filtered.length === 1) {
      setBodyLeftId(filtered[0].id);
      setBodyRightId(filtered[0].id);
    }
  };

  const bodyLeft = registry.find((item) => item.id === bodyLeftId);
  const bodyRight = registry.find((item) => item.id === bodyRightId);

  const filteredItems = registry.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-indigo-400">
        <Scale className="w-8 h-8 animate-spin mb-2" />
        <span className="font-mono text-xs animate-pulse">Querying physical celestial databases...</span>
      </div>
    );
  }

  return (
    <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left shadow-2xl">
      <div className="flex items-center space-x-2.5 mb-4">
        <Scale className="w-5 h-5 text-indigo-400 animate-pulse" />
        <h4 className="font-bold text-white uppercase tracking-wider text-sm">
          Planetary Comparative Matrix
        </h4>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Evaluate structural mass indicators, physical diameters, atmospheric profiles, and stellar distances side-by-side using cataloged database registers.
      </p>

      {/* Category Toggles */}
      <div className="flex bg-slate-950/60 p-1 rounded-xl border border-indigo-500/15 mb-5 max-w-sm text-xs">
        {(["planet", "star", "galaxy"] as const).map((catOpt) => (
          <button
            key={catOpt}
            onClick={() => handleCategoryChange(catOpt)}
            className={`flex-grow p-1.5 px-3 rounded-lg font-medium transition capitalized text-center ${
              selectedCategory === catOpt
                ? "bg-indigo-600 font-bold text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {catOpt}s
          </button>
        ))}
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Reference Object Left
          </label>
          <select
            value={bodyLeftId}
            onChange={(e) => setBodyLeftId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 px-3 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
          >
            {filteredItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Reference Object Right
          </label>
          <select
            value={bodyRightId}
            onChange={(e) => setBodyRightId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 px-3 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
          >
            {filteredItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-side Comparative comparison matrix layout */}
      {bodyLeft && bodyRight && (
        <div className="grid grid-cols-2 gap-6 bg-slate-950/20 p-4 rounded-2xl border border-indigo-500/5 animate-fadeIn">
          {/* Left Entity Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-indigo-500/10 pb-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: bodyLeft.color }} />
              <h5 className="font-bold text-white text-base">{bodyLeft.name}</h5>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Stellar Mass</span>
                <span className="font-mono text-xs font-semibold text-white block">{bodyLeft.mass}</span>
              </div>
              <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Physical Diameter</span>
                <span className="font-mono text-xs font-semibold text-white block">{bodyLeft.diameter}</span>
              </div>
              <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Atmosphere Type</span>
                <span className="font-mono text-xs font-semibold text-white block">
                  {bodyLeft.atmosphere || "None / Solid core vacuum"}
                </span>
              </div>
              <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Temperature</span>
                <span className="font-mono text-xs font-semibold text-white block">{bodyLeft.temperature}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 leading-relaxed">
              "{bodyLeft.fact}"
            </p>
          </div>

          {/* Right Entity Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-indigo-500/10 pb-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: bodyRight.color }} />
              <h5 className="font-bold text-white text-base">{bodyRight.name}</h5>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Stellar Mass</span>
                <span className="font-mono text-xs font-semibold text-white block">{bodyRight.mass}</span>
              </div>
              <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Physical Diameter</span>
                <span className="font-mono text-xs font-semibold text-white block">{bodyRight.diameter}</span>
              </div>
              <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Atmosphere Type</span>
                <span className="font-mono text-xs font-semibold text-white block">
                  {bodyRight.atmosphere || "None / Solid core vacuum"}
                </span>
              </div>
              <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Temperature</span>
                <span className="font-mono text-xs font-semibold text-white block">{bodyRight.temperature}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 leading-relaxed">
              "{bodyRight.fact}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
