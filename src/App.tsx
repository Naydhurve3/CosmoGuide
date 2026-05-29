// CosmoGuide - AI Space Exploration Cockpit
// Created by: Nayan Dhurve (nayandhurve44@gmail.com)
// License: MIT

import React, { useState, useEffect, useRef } from "react";
import SpaceBackground from "./components/SpaceBackground";
import SolarSystem3D from "./components/SolarSystem3D";
import StarChart from "./components/StarChart";
import ChatPanel from "./components/ChatPanel";
import SpaceDataPanel from "./components/SpaceDataPanel";
import QuizPanel from "./components/QuizPanel";
import ComparePanel from "./components/ComparePanel";

// New Stellar features integrations
import VaultPanel from "./components/VaultPanel";
import AstroVision from "./components/AstroVision";
import CosmicTwinQuiz from "./components/CosmicTwinQuiz";
import BirthdayTimeMachine from "./components/BirthdayTimeMachine";
import MissionControl from "./components/MissionControl";
import CosmicDebunker from "./components/CosmicDebunker";
import SoundscapeGenerator from "./components/SoundscapeGenerator";

// Premium categories integration
import PersonalCosmos from "./components/PersonalCosmos";
import GamificationCenter from "./components/GamificationCenter";
import DeepSpaceToys from "./components/DeepSpaceToys";

import {
  Orbit, Compass, Sparkles, AlertTriangle, Radio, Brain, Scale,
  Key, Image as ImageIcon, HelpCircle, Telescope, Activity, Shield,
  Share2, Twitter, MessageSquare, Download, X, HelpCircle as HelpIcon, ArrowRight, Check, Trophy
} from "lucide-react";

type ActiveTab =
  | "orbits"
  | "starchart"
  | "chats"
  | "telemetries"
  | "quiz"
  | "compare"
  | "vault"
  | "astroart"
  | "cosmictwin"
  | "birthday"
  | "mission"
  | "debunker"
  | "ambient"
  | "personalcosmos"
  | "gamification"
  | "deepspace";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("orbits");
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  // Exit event state parameters
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasTriggeredExit, setHasTriggeredExit] = useState(false);

  // Deep dive sidebar drawer
  const [showDeepDiveDrawer, setShowDeepDiveDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  // Dynamic float text depending on local time
  const [floatingBtnText, setFloatingBtnText] = useState("✨ Discover Today's Phenomenon ✨");

  // Premium UI/UX micro-features states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [trailPoints, setTrailPoints] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isNearBroadcaster, setIsNearBroadcaster] = useState(false);
  const [isNearDailyPhenomenon, setIsNearDailyPhenomenon] = useState(false);

  const COSMIC_QUOTES = [
    "“The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.” — Carl Sagan",
    "“Equipped with his five senses, man explores the universe around him and calls the adventure Science.” — Edwin Hubble",
    "“The good thing about science is that it's true whether or not you believe in it.” — Neil deGrasse Tyson",
    "“Somewhere, something incredible is waiting to be known.” — Carl Sagan",
    "“We look at the stars so that we can find our coordinates inside the infinite dark.” — Astronomical Society"
  ];

  // Synthesize custom high-tech radio bloop acoustic feedback offline
  const playRadarPing = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(980, ctx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  // Tracking cursor trail coordinates and proximity detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Trail effects
      setTrailPoints((prev) => {
        const next = [...prev, { x: e.pageX, y: e.pageY, id: Math.random() + Date.now() }];
        if (next.length > 7) next.shift();
        return next;
      });

      // Left Social Broadcaster Proximity: y-center region and within 170px from left
      const isYRegion = Math.abs(e.clientY - window.innerHeight / 3.5) < 240;
      if (e.clientX < 170 && isYRegion) {
        setIsNearBroadcaster(true);
      } else {
        // Only reset if mouse left is completely clear
        if (e.clientX >= 170) {
          setIsNearBroadcaster(false);
        }
      }

      // Bottom Right Daily Phenomenon Proximity: bottom right 280px x 240px
      const fromRightEdge = window.innerWidth - e.clientX;
      const fromBottomEdge = window.innerHeight - e.clientY;
      if (fromRightEdge < 280 && fromBottomEdge < 240) {
        setIsNearDailyPhenomenon(true);
      } else {
        if (fromRightEdge >= 280 || fromBottomEdge >= 240) {
          setIsNearDailyPhenomenon(false);
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Periodic visual quote refresh
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % COSMIC_QUOTES.length);
    }, 15000); // cycle every 15s
    return () => clearInterval(quoteInterval);
  }, []);

  // Load weather and triggers
  useEffect(() => {
    async function loadAlert() {
      try {
        const res = await fetch("/api/weather");
        if (res.ok) {
          const data = await res.json();
          if (data.alertMessage) {
            setSystemAlert(data.alertMessage);
          }
        }
      } catch (err) {
        console.warn("Failed retrieving weather alerts.");
      }
    }
    loadAlert();

    // Set floating prompt text dynamically depending on morning or night slot
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 17) {
      setFloatingBtnText("☀️ Morning: Inspect Solar Flare Activity");
    } else {
      setFloatingBtnText("🌙 Night: Capture Aurora Predictions");
    }

    // Capture exit intent by registering mousemoves
    const handleMouseLeaveViewport = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasTriggeredExit) {
        setShowExitPopup(true);
        setHasTriggeredExit(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeaveViewport);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeaveViewport);
    };
  }, [hasTriggeredExit]);

  const handleDownloadCalendar = () => {
    // Simulated free PDF file download prompt
    alert("🌌 Launching Orbiters downlinks! Downloading CosmoGuide 2025 Cosmic Calendar PDF format perfectly.");
    setShowExitPopup(false);
  };

  const handleShareCosmos = (platform: "twitter" | "reddit" | "whatsapp") => {
    const text = "Discover planetary orbits, track satellite arrays and explore deep-space AI algorithms at CosmoGuide! 🌌🚀 Check out:";
    const url = window.location.href;

    let targetUrl = "";
    if (platform === "twitter") {
      targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    } else if (platform === "reddit") {
      targetUrl = `https://reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    } else {
      targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
    }
    window.open(targetUrl, "_blank");
  };
  const [minimizedWindows, setMinimizedWindows] = useState<ActiveTab[]>([]);
  const [maximizedWindow, setMaximizedWindow] = useState<ActiveTab | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; avatar: string } | null>(null);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");

  // Sync user profile from local storage to personalize cockpit HUD
  useEffect(() => {
    const handleSyncProfile = () => {
      const saved = localStorage.getItem("cosmo_user_profile");
      if (saved) {
        try {
          setUserProfile(JSON.parse(saved));
        } catch (err) {}
      }
    };
    handleSyncProfile();
    // Intercept updates
    window.addEventListener("storage", handleSyncProfile);
    return () => window.removeEventListener("storage", handleSyncProfile);
  }, []);

  const handleLaunch = (tab: ActiveTab) => {
    playRadarPing();
    // Restore window if it was in minimized lists
    setMinimizedWindows((prev) => prev.filter((id) => id !== tab));
    setActiveTab(tab);
  };

  const handleMinimize = (tab: ActiveTab) => {
    playRadarPing();
    if (!minimizedWindows.includes(tab)) {
      setMinimizedWindows((prev) => [...prev, tab]);
    }
    setActiveTab(null);
  };

  const handleMaximizeToggle = (tab: ActiveTab) => {
    playRadarPing();
    if (maximizedWindow === tab) {
      setMaximizedWindow(null);
    } else {
      setMaximizedWindow(tab);
    }
  };

  const handleCloseWindow = (tab: ActiveTab) => {
    playRadarPing();
    setMinimizedWindows((prev) => prev.filter((id) => id !== tab));
    if (activeTab === tab) {
      setActiveTab(null);
    }
    if (maximizedWindow === tab) {
      setMaximizedWindow(null);
    }
  };

  const handleRestore = (tab: ActiveTab) => {
    playRadarPing();
    setMinimizedWindows((prev) => prev.filter((id) => id !== tab));
    setActiveTab(tab);
  };

  const MODULE_METADATA: { id: ActiveTab; name: string; category: string; icon: React.ReactNode; desc: string; banner: string }[] = [
    {
      id: "orbits",
      name: "3D Planetary Kepler Simulator",
      category: "Orbital Mechanics",
      icon: <Orbit className="w-5 h-5" />,
      desc: "Simulate live planetary Kepler physics, gravity curves and speeds on customizable orbits",
      banner: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "starchart",
      name: "Tactical Star Map & coordinates",
      category: "Atmospheric Projection",
      icon: <Compass className="w-5 h-5" />,
      desc: "Plot astronomical coordinate sweeps and celestial alignment trackers",
      banner: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "chats",
      name: "AI Cosmic Assistant Intelligence",
      category: "Generative AI",
      icon: <Sparkles className="w-5 h-5" />,
      desc: "Pose complex heliophysics, Kepler speeds, and galaxy coordinate sweep inquiries",
      banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "mission",
      name: "Observatory Mission tracker",
      category: "Satellites & Stations",
      icon: <Radio className="w-5 h-5" />,
      desc: "Follow ISS live tracks, SpaceX launches, ESA countdowns and satellite parameters",
      banner: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "astroart",
      name: "Astro Vision Neural Wallpaper",
      category: "Generative Art",
      icon: <ImageIcon className="w-5 h-5" />,
      desc: "Synthesize high-resolution celestial nurseries, supernovas and black hole paintings",
      banner: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "quiz",
      name: "Astronomical Knowledge Trivia",
      category: "Gamification",
      icon: <Brain className="w-5 h-5" />,
      desc: "Test your cosmic physics intelligence with multiple-choice trivia arrays",
      banner: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "cosmictwin",
      name: "Adaptive Celestial Twin Matcher",
      category: "Biometric Signatures",
      icon: <Activity className="w-5 h-5" />,
      desc: "Synthesize cognitive parameters to match with an orbiting asteroid, planet or pulsar",
      banner: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "birthday",
      name: "Hubble Observer Time Gazette",
      category: "Historic Archives",
      icon: <Telescope className="w-5 h-5" />,
      desc: "Reveal historic photos snapped by Hubble or James Webb telescopes on your birthday",
      banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "debunker",
      name: "Conspiracy Debunker Registry",
      category: "Scientific Peer-Review",
      icon: <HelpCircle className="w-5 h-5" />,
      desc: "Shatter high-profile TikTok astronomical hoaxes and fake moons using solid logic",
      banner: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "ambient",
      name: "Space Sound Hum Synth",
      category: "Soundscapes Synthesizer",
      icon: <Activity className="w-5 h-5" />,
      desc: "Synthesize micro-frequency stellar sound waves tuned by density and gravity metrics",
      banner: "https://images.unsplash.com/photo-1516339901601-2e1d62dc0c45?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "compare",
      name: "Celestial Scale Matrix",
      category: "Comparative Systems",
      icon: <Scale className="w-5 h-5" />,
      desc: "Evaluate planetary density, atmosphere levels, Kepler speeds and orbital volumes ",
      banner: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "telemetries",
      name: "Heliophysics Space Weather Tracker",
      category: "Solar Telemetry",
      icon: <Radio className="w-5 h-5" />,
      desc: "Monitor solar flare levels and active sunspots to forecast spectacular green auroras",
      banner: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "vault",
      name: "Telemetry Credentials Vault & Profile Settings",
      category: "Identity & Key Services",
      icon: <Key className="w-5 h-5" />,
      desc: "Connect your simulated Space ID, register credentials, view agency passport and configure keys",
      banner: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "personalcosmos",
      name: "Personalized Stellar Cockpit & Night Sky Guide",
      category: "Hyper-Personalization",
      icon: <Compass className="w-5 h-5" />,
      desc: "Track exact rise/set planetary viewing windows under your local GPS coordinates, config interface clearance levels, and log AI observation journals.",
      banner: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "gamification",
      name: "Cosmic Bingo & Speed Gauntlet Challenge",
      category: "Gamification & Badges",
      icon: <Trophy className="w-5 h-5" />,
      desc: "Align daily activities to clear 5x5 Bingo roads, claim glowing loyalty stamp calendars, and defeat timed rapid astrophysics trivia countdowns.",
      banner: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "deepspace",
      name: "Kepler Gravity Simulator & Scale of Universe",
      category: "Interactive Sandbox Tools",
      icon: <Scale className="w-5 h-5" />,
      desc: "Launch custom satellites into live 2D gravity simulators, scroll from atomic proton scales to the observable universe, and scratch facts.",
      banner: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&auto=format&fit=crop&q=60"
    }
  ];

  const filteredModules = MODULE_METADATA.filter(mod =>
    mod.name.toLowerCase().includes(desktopSearchQuery.toLowerCase()) ||
    mod.category.toLowerCase().includes(desktopSearchQuery.toLowerCase()) ||
    mod.desc.toLowerCase().includes(desktopSearchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans select-none overflow-x-hidden pb-12">
      {/* Parallax Cosmic Background Particle System */}
      <SpaceBackground />

      {/* Floating active solar threat warning ticker */}
      {systemAlert && (
        <div className="relative z-35 w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-semibold py-2 px-4 shadow-md text-xs sm:text-sm flex items-center justify-center space-x-2 animate-fadeIn border-b border-indigo-500/10">
          <AlertTriangle className="w-4 h-4 animate-bounce flex-shrink-0" />
          <span className="tracking-wide text-center">
            <strong>Solar Max Alert:</strong> {systemAlert}
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-6 flex-grow flex flex-col">
        {/* Header Navbar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl shadow-2xl mb-6">
          <div className="flex items-center space-x-3.5 text-left cursor-pointer" onClick={() => setActiveTab(null)}>
            <div className="p-2.5 bg-indigo-600/20 rounded-xl border border-indigo-500/40 shadow-lg shadow-indigo-500/20 animate-spin" style={{ animationDuration: "14s" }}>
              <Orbit className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white font-display tracking-widest uppercase flex items-center gap-1.5">
                Cosmo<span className="text-indigo-400">Guide</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 tracking-wide font-mono mt-0.5">
                Interactive Portal & Window Desk System • Active Status
              </p>
              <p className="text-[9px] text-indigo-500/60 font-mono mt-0.5 tracking-wider">
                Created by <span className="text-indigo-400 font-semibold">Nayan Dhurve</span>
              </p>
            </div>
          </div>

          {/* Quick core telemetry details */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-3 bg-slate-950/40 border border-slate-800 p-2 px-3 rounded-xl text-[10px] sm:text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sat Handshake Sync</span>
              <span className="text-indigo-500/40">|</span>
              <span className="text-indigo-350 font-bold uppercase">
                {userProfile ? userProfile.name.split(" ")[0] : "Cadet"}
              </span>
            </div>

            {/* Audio Toggle Indicator button */}
            <button
              onClick={() => {
                const nextVal = !soundEnabled;
                setSoundEnabled(nextVal);
                if (nextVal) {
                  setTimeout(() => {
                    try {
                      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                      if (AudioCtx) {
                        const ctx = new AudioCtx();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = "sine";
                        osc.frequency.setValueAtTime(600, ctx.currentTime);
                        gain.gain.setValueAtTime(0.04, ctx.currentTime);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.1);
                      }
                    } catch (e) {}
                  }, 50);
                }
              }}
              className="p-2 px-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 text-[11px] font-bold text-indigo-300 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Toggle synthetic audio acoustic feedback clicks"
            >
              <span>{soundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF"}</span>
            </button>

            {/* Config credentials shortcut button */}
            <button
              onClick={() => handleLaunch("vault")}
              className={`p-2 px-3 rounded-xl border text-[11px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center space-x-1.5 hover:scale-105 active:scale-95 cursor-pointer ${
                activeTab === "vault"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/35"
                  : "bg-slate-950/50 border-slate-800 text-indigo-300 hover:border-indigo-500/40 hover:text-white"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Settings Portal</span>
            </button>
          </div>
        </header>

        {/* Dynamic System HUD indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-13 gap-2 mb-6 p-2 rounded-xl bg-slate-950/35 border border-indigo-500/10 backdrop-blur-md">
          {MODULE_METADATA.map((mod) => {
            const isWindowActive = activeTab === mod.id;
            const isWindowMinimized = minimizedWindows.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => handleLaunch(mod.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-250 cursor-pointer relative ${
                  isWindowActive
                    ? "bg-gradient-to-b from-indigo-700 to-indigo-800 text-white border-b-2 border-indigo-400 shadow-md scale-105"
                    : isWindowMinimized
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/50 hover:border hover:border-slate-800"
                }`}
              >
                <div className="mb-1 text-center scale-90">{mod.icon}</div>
                <span className="text-[9px] font-bold uppercase tracking-wider block text-center truncate w-full max-w-[70px]">
                  {mod.id === "cosmictwin" ? "Twin" : mod.id === "telemetries" ? "Weather" : mod.id === "starchart" ? "Stars" : mod.id === "astroart" ? "AI Vision" : mod.name.split(" ")[0]}
                </span>
                {/* Visual state dots inside small selectors */}
                {isWindowActive && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
                {isWindowMinimized && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab views router controller */}
        <main className="flex-grow flex flex-col justify-center relative min-h-[460px]">
          
          {/* 1. USER DESKTOP COCKPIT GREETING PANEL (Presented when activeTab is null) */}
          {activeTab === null && (
            <div className="w-full animate-fadeIn mb-6 text-left space-y-6">
              
              {/* Cockpit Status Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 rounded-2xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-indigo-400/5 pointer-events-none">
                  <Orbit className="w-48 h-48 animate-pulse" />
                </div>
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 p-1 px-3.5 rounded-lg text-indigo-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase w-fit">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    <span>ORBITAL STATION ACTIVE READY</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-bold font-display text-white tracking-tight leading-tight">
                    Welcome to the Cockpit, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 font-extrabold">{userProfile ? userProfile.name : "Stargazer Cadet"}</span>!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                    CosmoGuide provides full-scope real-time interactive Kepler solar simulations, generative space neural art engines, direct star trackers and automated heliophysics alerts.
                  </p>
                </div>

                <div className="md:col-span-4 p-4.5 bg-slate-950/80 rounded-xl border border-indigo-500/10 font-mono text-[11px] text-slate-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">User Clearance</span>
                    <span className="text-amber-400 font-extrabold text-[10px] tracking-wide uppercase px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/25 rounded">Commander Class</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Observatory Key Status</span>
                    <span className="text-emerald-400 font-bold">LINK SYNCED </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Observatory clock</span>
                    <span className="text-indigo-300 font-bold">UTC: {new Date().toISOString().substring(11, 19)}</span>
                  </div>
                </div>
              </div>

              {/* Module Search and Filtering Matrix */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-900/20 p-4 rounded-xl border border-indigo-500/5 backdrop-blur-md">
                <div className="relative w-full sm:max-w-md">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 scale-90">🔍</span>
                  <input
                    type="text"
                    placeholder="Search systems (e.g. Orbits, AI, Weather, Quiz)..."
                    value={desktopSearchQuery}
                    onChange={(e) => setDesktopSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 hover:border-indigo-500/25 focus:border-indigo-500/50 rounded-xl p-2.5 pl-10 text-xs text-indigo-150 focus:outline-none transition-all placeholder:text-slate-500"
                  />
                  {desktopSearchQuery && (
                    <button
                      onClick={() => setDesktopSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-bold text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500">
                  <span>Displaying <strong>{filteredModules.length}</strong> modules</span>
                </div>
              </div>

              {/* Grid bento gallery listing of modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredModules.map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => handleLaunch(mod.id)}
                    className="group bg-slate-900/40 hover:bg-slate-900/75 border border-indigo-500/10 hover:border-indigo-500/30 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Image header with smooth dark gradients overlay */}
                      <div className="h-28 relative overflow-hidden">
                        <img
                          src={mod.banner}
                          alt={mod.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/10" />
                        <span className="absolute top-3 left-3 bg-slate-950/85 border border-indigo-500/20 text-indigo-300 font-bold uppercase tracking-widest font-mono text-[8px] p-1 px-2.5 rounded-lg">
                          {mod.category}
                        </span>
                      </div>

                      {/* Info and action */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 px-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md scale-95 flex-shrink-0">
                            {mod.icon}
                          </div>
                          <h4 className="font-extrabold text-white text-sm sm:text-base tracking-wide group-hover:text-indigo-300 transition">
                            {mod.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans text-left">
                          {mod.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunch(mod.id);
                        }}
                        className="w-full py-2 bg-indigo-600/10 border border-indigo-500/25 rounded-xl text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition duration-250 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-md group-hover:shadow-indigo-650/40"
                      >
                        <span>Launch System Interface</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. THE MODULAR POPUP WINDOW SHELL (Presented when activeTab is selected and not minimized) */}
          {activeTab !== null && (
            <div
              className={`transition-all duration-300 flex flex-col ${
                maximizedWindow === activeTab
                  ? "fixed inset-0 sm:inset-4 z-40 bg-slate-950/98 p-6 rounded-3xl border border-indigo-500/35 overflow-y-auto flex flex-col backdrop-blur-3xl shadow-[0_0_80px_rgba(99,102,241,0.35)] animate-scaleUp"
                  : "w-full relative bg-slate-900/60 border border-indigo-500/20 shadow-2xl rounded-2xl p-5 backdrop-blur-2xl animate-fadeIn"
              }`}
            >
              {/* System window header console */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/10 pb-4 mb-5 text-left">
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 bg-indigo-600/15 rounded-xl border border-indigo-500/30 text-indigo-400">
                    {MODULE_METADATA.find((m) => m.id === activeTab)?.icon}
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 font-mono">
                      {MODULE_METADATA.find((m) => m.id === activeTab)?.category} • Telemetry Hub
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {MODULE_METADATA.find((m) => m.id === activeTab)?.name}
                    </h3>
                  </div>
                </div>

                {/* Tactical Window Action Controllers */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="hidden md:inline-flex items-center space-x-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 p-1 px-2.5 border border-emerald-500/20 rounded-lg animate-pulse mr-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>LINK SYNC_SECURE</span>
                  </span>

                  {/* MINIMIZE WINDOW ACTION */}
                  <button
                    onClick={() => handleMinimize(activeTab)}
                    className="p-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-500 hover:text-amber-400 transition cursor-pointer flex items-center space-x-1"
                    title="Minimize window to bottom Stellar Dock"
                  >
                    <span className="font-extrabold text-sm">-</span>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Minimize</span>
                  </button>

                  {/* MAXIMIZE / COCKPIT EXPAND BUTTON */}
                  <button
                    onClick={() => handleMaximizeToggle(activeTab)}
                    className="p-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-350 transition cursor-pointer flex items-center space-x-1"
                    title={maximizedWindow === activeTab ? "Restore normal panel size" : "Maximize view to fullscreen focus"}
                  >
                    <span className="font-bold text-xs">⤢</span>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                      {maximizedWindow === activeTab ? "Restore View" : "Maximize Focus"}
                    </span>
                  </button>

                  {/* CLOSE APP BUTTON */}
                  <button
                    onClick={() => handleCloseWindow(activeTab)}
                    className="p-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-rose-500 hover:text-rose-450 transition cursor-pointer flex items-center space-x-1"
                    title="Close core session"
                  >
                    <span className="font-extrabold text-sm">×</span>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Close</span>
                  </button>
                </div>
              </div>

              {/* Integrated active tab window child views router */}
              <div className="w-full relative">
                {activeTab === "orbits" && (
                  <div className="w-full animate-fadeIn">
                    <SolarSystem3D />
                  </div>
                )}

                {activeTab === "starchart" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <StarChart />
                  </div>
                )}

                {activeTab === "chats" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <ChatPanel />
                  </div>
                )}

                {activeTab === "telemetries" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <SpaceDataPanel />
                  </div>
                )}

                {activeTab === "quiz" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <QuizPanel />
                  </div>
                )}

                {activeTab === "compare" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <ComparePanel />
                  </div>
                )}

                {activeTab === "vault" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <VaultPanel />
                  </div>
                )}

                {activeTab === "astroart" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <AstroVision />
                  </div>
                )}

                {activeTab === "cosmictwin" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <CosmicTwinQuiz />
                  </div>
                )}

                {activeTab === "birthday" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <BirthdayTimeMachine />
                  </div>
                )}

                {activeTab === "mission" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <MissionControl />
                  </div>
                )}

                {activeTab === "debunker" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <CosmicDebunker />
                  </div>
                )}

                {activeTab === "ambient" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <SoundscapeGenerator />
                  </div>
                )}

                {activeTab === "personalcosmos" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <PersonalCosmos />
                  </div>
                )}

                {activeTab === "gamification" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <GamificationCenter />
                  </div>
                )}

                {activeTab === "deepspace" && (
                  <div className="w-full animate-fadeIn mb-2">
                    <DeepSpaceToys />
                  </div>
                )}
              </div>
            </div>
          )}

        </main>

        {/* Elegant Rotating Astro Quote Footer with Interactive Glossary Tooltips */}
        <footer className="mt-10 mb-8 border-t border-indigo-500/10 pt-5 text-center max-w-3xl mx-auto space-y-4 px-4 relative z-20">
          <div className="flex justify-center items-center gap-2 text-[10px] text-indigo-400 font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>COSMIC GAZETTE BROADCASTER QUOTE</span>
            <button
              onClick={() => {
                playRadarPing();
                setQuoteIdx((prev) => (prev + 1) % COSMIC_QUOTES.length);
              }}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/30 text-[9px] hover:text-indigo-300 transition cursor-pointer flex items-center space-x-1"
              title="Cycle quote manually"
            >
              <span>Rotate ↻</span>
            </button>
          </div>
          
          <div className="min-h-[35px] flex items-center justify-center px-4">
            <p className="text-xs sm:text-sm text-slate-400 italic font-sans leading-relaxed tracking-wide select-text">
              {COSMIC_QUOTES[quoteIdx]}
            </p>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
            Engineered with precise planetary Kepler metrics and heliophysics telemetry arrays. Hover over high-tech terms:{" "}
            <span 
              className="border-b border-dashed border-indigo-400 cursor-help text-indigo-300 hover:text-white transition relative group bubble-help"
              title="Kepler Orbits: Relating to Johannes Kepler's three laws of planetary motion, governing theoretical elliptical loops and acceleration variables around deep gravity anchors."
            >
              Kepler orbits
            </span>,{" "}
            <span 
              className="border-b border-dashed border-indigo-400 cursor-help text-indigo-300 hover:text-white transition relative group bubble-help"
              title="Heliophysics: The science of analyzing solar structures, solar flares, geomagnetic storms, active sunspots, and cosmic wind impacts on Earth's magnetosphere."
            >
              Heliophysics
            </span>, and{" "}
            <span 
              className="border-b border-dashed border-indigo-400 cursor-help text-indigo-300 hover:text-white transition relative group bubble-help"
              title="Astronomical sweep: Scanning celestial coordinate grids (declination/right ascension) to plot orbiting vectors and coordinate sweep arrays."
            >
              coordinate sweeps
            </span>.
          </p>
        </footer>
      </div>

      {/* Floating Cursor Comet Trail Particles */}
      {trailPoints.map((pt, idx) => (
        <div
          key={pt.id}
          className="absolute pointer-events-none rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 z-55 transition-opacity"
          style={{
            left: pt.x - 3,
            top: pt.y - 3,
            width: `${(idx + 1) * 1.5}px`,
            height: `${(idx + 1) * 1.5}px`,
            opacity: (idx + 1) / 10,
            boxShadow: "0 0 8px rgba(99,102,241,0.5)",
            transform: "translate3d(0, 0, 0)"
          }}
        />
      ))}

      {/* 3. REAL-TIME STELLAR MINIMIZE DOCK (Holds minimized window icons at the bottom center of viewport) */}
      {minimizedWindows.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-45 flex items-center bg-slate-900/85 backdrop-blur-3xl px-5 py-3 rounded-2xl border border-indigo-550/20 shadow-[0_0_35px_rgba(99,102,241,0.25)] space-x-3.5 max-w-[90vw] overflow-x-auto select-none transition-all animate-fadeIn">
          <div className="flex items-center space-x-2 border-r border-indigo-500/25 pr-3 mr-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Dock ({minimizedWindows.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {minimizedWindows.map((twId) => {
              const meta = MODULE_METADATA.find((m) => m.id === twId);
              if (!meta) return null;
              return (
                <button
                  key={twId}
                  onClick={() => handleRestore(twId)}
                  className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-indigo-650 border border-slate-850 hover:border-indigo-400 text-indigo-300 hover:text-white transition-all duration-300 transform hover:scale-115 active:scale-95 flex items-center space-x-2 shadow-lg relative font-medium text-xs cursor-pointer focus:outline-none group/dock"
                  title={`Restore ${meta.name} interface`}
                >
                  <span className="text-center inline-block">{meta.icon}</span>
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold max-w-[110px] truncate block">
                    {meta.name.split(" ")[0]}
                  </span>

                  {/* Pulsing state marker indicator */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-slate-900 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping absolute" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FLOATING SOCIAL SHARE ACTIONS WIDGET (LEFT MARGIN EDGE - PROXIMITY & TOUCH POPUP) */}
      <div 
        onClick={() => setIsNearBroadcaster(!isNearBroadcaster)}
        onMouseEnter={() => setIsNearBroadcaster(true)}
        className={`fixed left-0 top-1/3 z-40 transition-all duration-300 transform flex items-center ${
          isNearBroadcaster ? "translate-x-0" : "translate-x-[-70%] sm:translate-x-[-78%]"
        }`}
      >
        <div className="flex items-center bg-slate-900/90 border-r border-y border-indigo-500/20 backdrop-blur-md rounded-r-2xl p-2.5 shadow-2xl space-x-2">
          {/* Collapsed mini indicator shown when near is false */}
          <div className={`p-1 text-indigo-400 flex flex-col items-center cursor-pointer ${isNearBroadcaster ? "hidden" : "block animate-pulse"}`}>
            <Radio className="w-4 h-4 text-indigo-400" />
            <span className="text-[7px] font-mono font-bold tracking-widest text-indigo-300 rotate-90 uppercase mt-4 block whitespace-nowrap">SHARE</span>
          </div>

          {/* Full expanded broadcaster elements */}
          <div className={`flex flex-col items-center space-y-3 ${isNearBroadcaster ? "flex" : "hidden"}`}>
            <span className="text-[9px] font-bold text-indigo-400 font-mono rotate-90 my-2 tracking-widest block uppercase whitespace-nowrap">
              Broadcaster
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShareCosmos("twitter");
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-950 transition cursor-pointer"
              title="Share on Twitter / X"
            >
              <Twitter className="w-4 h-4 fill-current text-indigo-300 hover:text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShareCosmos("reddit");
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-950 transition cursor-pointer"
              title="Share on Reddit Space group"
            >
              <HelpIcon className="w-4 h-4 text-rose-450 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING GLOWING ACTION BUTTON (BOTTOM RIGHT CORNER - PROXIMITY & TOUCH POPUP) */}
      <div 
        onClick={() => setIsNearDailyPhenomenon(!isNearDailyPhenomenon)}
        className={`fixed bottom-6 right-6 z-45 transition-all duration-300 transform ${
          isNearDailyPhenomenon ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-1 opacity-90 sm:opacity-60"
        }`}
      >
        {!isNearDailyPhenomenon ? (
          <button 
            type="button"
            className="p-3 bg-slate-950/90 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-full shadow-2xl flex items-center justify-center space-x-1.5 hover:scale-110 active:scale-95 transition cursor-pointer"
            title="Expand Daily Space Forecast (Touch or Move Near)"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono hidden sm:inline-block">Forecast</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDrawerLoading(true);
              setShowDeepDiveDrawer(true);
              setTimeout(() => setDrawerLoading(false), 900);
            }}
            className="p-3.5 px-5 bg-gradient-to-r from-indigo-650 via-purple-600 to-pink-650 text-white font-bold text-xs tracking-wider rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.35)] border border-indigo-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-bounce text-amber-300" />
            <span>{floatingBtnText}</span>
          </button>
        )}
      </div>

      {/* DEEP DIVE RIGHT SIDE DRAWER PANEL WRAP */}
      {showDeepDiveDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-955/80 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          {/* Close trigger overlay area */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setShowDeepDiveDrawer(false)} />

          {/* Drawer core layout */}
          <div className="relative w-full max-w-md bg-slate-950 border-l border-indigo-500/20 shadow-2xl h-full flex flex-col justify-between p-6 overflow-y-auto animate-fadeIn text-left">
            <div className="space-y-6">
              {/* Drawer Header metrics */}
              <div className="flex items-center justify-between border-b border-indigo-505/10 pb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-white uppercase text-sm tracking-wider">Daily Stellar Phenomenon</h4>
                </div>
                <button
                  onClick={() => setShowDeepDiveDrawer(false)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {drawerLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-indigo-400 space-y-2">
                  <Orbit className="w-8 h-8 animate-spin" />
                  <span className="font-mono text-xs animate-pulse">Syncing deep solar forecast telemetry...</span>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-xl overflow-hidden border border-indigo-500/10 shadow-lg relative h-40">
                    <img
                      src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800"
                      alt="Solar cycle"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 text-[8px] font-mono text-amber-400 font-bold uppercase p-1 px-2.5 bg-slate-900/90 rounded border border-amber-500/10">
                      Geomagnetic active
                    </span>
                  </div>

                  <div className="space-y-2 font-sans text-xs text-slate-400 leading-relaxed">
                    <span className="font-bold text-white text-base block mb-1">Aurora Borealis Visibility Expansion Forecast</span>
                    <p>
                      According to Space Weather prediction parameters, recent M-class solar flares trigger rich proton storms colliding with Earth magnetic envelopes tonight.
                    </p>
                    <p>
                      High probability (&gt;80%) of spectacular green/magenta light curtains displays tonight visible spanning mid and northern latitudes of Europe and America. Look north around local midnight!
                    </p>
                  </div>

                  {/* Daily Stellar tips list */}
                  <div className="p-4.5 bg-indigo-505/5 border border-indigo-500/10 rounded-xl space-y-2 text-xs">
                    <span className="font-bold text-indigo-300 block">Stargazing Tip of the Night:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-310">
                      <li>Use standard non-optical 10x50 field binoculars to map Jupiter's moons.</li>
                      <li>Allow human eye rods to dark-adapt for 20 minutes before spotting constellations.</li>
                      <li>Aim mirrors to 45° elevation to safely counter atmospheric scattering variables.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Newsletter form */}
            <div className="pt-6 border-t border-slate-900 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                Subscribe to Kepler Launch alerts
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Receive orbital launch notifications and solar weather warnings direct to your inbox format.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNewsletterStatus("sending");
                  setTimeout(() => setNewsletterStatus("done"), 1100);
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="stargazer@voyager.net"
                  required
                  className="flex-grow bg-slate-950 border border-slate-850 p-2 text-xs text-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs"
                >
                  Join Feed
                </button>
              </form>

              {newsletterStatus === "sending" && <span className="text-[9px] text-slate-500 animate-pulse block">Connecting to Mailgun...</span>}
              {newsletterStatus === "done" && <span className="text-[9px] text-emerald-400 block font-semibold leading-none">✓ Done! Welcome aboard CosmoGuide observatory team.</span>}
            </div>
          </div>
        </div>
      )}

      {/* Footer — Creator Watermark */}
      <footer className="mt-auto pt-6 pb-4 text-center border-t border-indigo-500/5">
        <p className="text-[10px] text-indigo-500/40 font-mono tracking-wider">
          CosmoGuide — Created by <span className="text-indigo-400/60 font-semibold">Nayan Dhurve</span>
          <span className="mx-1.5 text-indigo-500/20">|</span>
          <a href="mailto:nayandhurve44@gmail.com" className="text-indigo-400/40 hover:text-indigo-300/60 transition">
            nayandhurve44@gmail.com
          </a>
        </p>
        <p className="text-[8px] text-indigo-500/20 font-mono mt-0.5">
          MIT License — Built with React, TypeScript & Express
        </p>
        </footer>

      {/* INTENT-EXIT POPUP MODAL (Reduce Bounce Rate) */}
      {showExitPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-indigo-500/20 rounded-2xl p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <Telescope className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />

            <div>
              <h4 className="font-extrabold text-white text-base">Wait! Don't drift off. 🌌</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Save our free **2025 high-resolution Cosmic Stargazing Calendar (PDF)** featuring critical meteor showers, rocket launch tracks, and eclipse schedules. No email registration required.
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowExitPopup(false)}
                className="flex-grow p-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs font-semibold hover:text-white hover:bg-slate-950/40 transition cursor-pointer"
              >
                Let Me Escape
              </button>
              <button
                onClick={handleDownloadCalendar}
                className="flex-grow p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs tracking-wide transition flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Claim Free PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
