// CosmoGuide - AI Space Exploration Cockpit
// Created by: Nayan Dhurve (nayandhurve44@gmail.com)
// License: MIT

import React, { useState, useEffect } from "react";
import { SpaceNewsItem, AsteroidItem, SpaceWeatherParam } from "../types";
import { AlertCircle, ShieldAlert, Radio, Globe, Calendar, Flame, Activity, Zap } from "lucide-react";

export default function SpaceDataPanel() {
  const [news, setNews] = useState<SpaceNewsItem[]>([]);
  const [asteroids, setAsteroids] = useState<AsteroidItem[]>([]);
  const [weather, setWeather] = useState<SpaceWeatherParam | null>(null);
  const [activeNews, setActiveNews] = useState<SpaceNewsItem | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsRes, astRes, weaRes] = await Promise.all([
          fetch("/api/news"),
          fetch("/api/asteroids"),
          fetch("/api/weather")
        ]);

        const newsData = await newsRes.json();
        const astData = await astRes.json();
        const weaData = await weaRes.json();

        setNews(newsData);
        setAsteroids(astData);
        setWeather(weaData);
      } catch (err) {
        console.error("Failed loading space telemetry data boards.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-indigo-400">
        <Activity className="w-10 h-10 animate-spin mb-3" />
        <span className="font-mono text-sm animate-pulse">Synchronizing astronomical telemetries...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. NOAA Magnetosphere Space Weather Widget */}
      <div className="md:col-span-1 flex flex-col p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left">
        <div className="flex items-center space-x-2.5 mb-4">
          <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          <h4 className="font-bold text-white uppercase tracking-wider text-sm">
            NOAA space weather forecast
          </h4>
        </div>

        {weather && (
          <div className="space-y-4">
            {/* Warning Alert Banner */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-2.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{weather.alertMessage}</span>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-indigo-500/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Geomagnetic Kp</span>
                <span className="font-mono text-xl font-bold text-indigo-300">{weather.kpIndex}</span>
                <span className="text-[9px] text-amber-400 block mt-0.5">Active Storm G3</span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-indigo-500/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Solar Wind Velocity</span>
                <span className="font-mono text-xl font-bold text-indigo-300">{weather.solarWindSpeed}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">km per second</span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-indigo-500/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Plasma Density</span>
                <span className="font-mono text-xl font-bold text-indigo-300">{weather.solarWindDensity}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">protons/cm³</span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-indigo-500/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Aurora Probability</span>
                <span className="font-mono text-xl font-bold text-emerald-400">{weather.auroraProbability}%</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">Extremely High</span>
              </div>
            </div>

            {/* Aurora progress bar */}
            <div className="bg-slate-950/20 p-3.5 rounded-xl border border-indigo-500/5">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">Aurora Oval Sight Potential:</span>
                <span className="font-mono text-emerald-400 font-bold">{weather.auroraProbability}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-1000"
                  style={{ width: `${weather.auroraProbability}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. NASA Asteroid Close Approach Warning Board */}
      <div className="md:col-span-1 flex flex-col p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left">
        <div className="flex items-center space-x-2.5 mb-4">
          <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />
          <h4 className="font-bold text-white uppercase tracking-wider text-sm">
            Asteroid close approach warn
          </h4>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
          {asteroids.map((ast) => (
            <div
              key={ast.id}
              className={`p-3 rounded-xl border relative transition-all duration-300 ${
                ast.isPotentiallyHazardous
                  ? "bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/30"
                  : "bg-slate-950/30 hover:bg-slate-950/55 border-slate-800/60"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-xs tracking-wide">{ast.name}</span>
                {ast.isPotentiallyHazardous && (
                  <span className="p-0.5 px-2 rounded bg-rose-600 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse">
                    Hazardous
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[10px] text-slate-400 leading-relaxed">
                <div>Approach Date: <span className="text-white block mt-0.5">{ast.closeApproachDate}</span></div>
                <div>Velocity: <span className="text-white block mt-0.5">{ast.velocityKph.toLocaleString()} km/h</span></div>
                <div>Miss distance: <span className="text-indigo-400 block mt-0.5">{ast.missDistanceAu} AU</span></div>
                <div>Diameter sizes: <span className="text-white block mt-0.5">{ast.estimatedDiameterMinM}m - {ast.estimatedDiameterMaxM}m</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Celestial Discoveries News Feed */}
      <div className="md:col-span-1 flex flex-col p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left">
        <div className="flex items-center space-x-2.5 mb-4">
          <Radio className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} />
          <h4 className="font-bold text-white uppercase tracking-wider text-sm">
            Space discover news alerts
          </h4>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
          {news.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveNews(item)}
              className="p-3 bg-slate-950/30 hover:bg-slate-950/60 border border-slate-800 hover:border-indigo-500/20 rounded-xl transition-all duration-300 cursor-pointer flex space-x-3 group"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800 relative bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt="Discovery thumbnail"
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex-grow flex flex-col justify-between">
                <h5 className="font-bold text-xs text-indigo-100 group-hover:text-indigo-400 transition leading-snug mb-1">
                  {item.title.substring(0, 52)}...
                </h5>
                <div className="flex items-center justify-between text-[9px] text-slate-500">
                  <span className="flex items-center"><Globe className="w-3 h-3 mr-1" /> {item.source}</span>
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {item.publishedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Microdetails Popup modal logic for News */}
      {activeNews && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn text-left">
          <div className="bg-slate-900/90 border border-indigo-500/20 p-6 rounded-2xl max-w-lg w-full relative shadow-2xl backdrop-blur-xl">
            <h4 className="text-lg font-bold text-white mb-2 leading-snug">
              {activeNews.title}
            </h4>

            {activeNews.imageUrl && (
              <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800 mb-4 bg-slate-950">
                <img
                  src={activeNews.imageUrl}
                  alt="Discovery"
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-mono">
              <span>Source: <strong className="text-indigo-400">{activeNews.source}</strong></span>
              <span>Published: {activeNews.publishedDate}</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              {activeNews.summary}
            </p>

            <div className="flex space-x-3">
              {activeNews.url && (
                <a
                  href={activeNews.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-grow py-2 px-4 text-center rounded-xl bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-xs tracking-wider transition duration-300 inline-block bg-indigo-600"
                >
                  Visit Official Agency Portal
                </a>
              )}
              <button
                onClick={() => setActiveNews(null)}
                className="py-2 px-5 px rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold tracking-wide transition duration-300"
              >
                Close Discovery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
