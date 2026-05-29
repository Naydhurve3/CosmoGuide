// CosmoGuide - AI Space Exploration Cockpit
// Created by: Nayan Dhurve (nayandhurve44@gmail.com)
// License: MIT

import React, { useState, useEffect, useRef } from "react";
import { 
  Trophy, Flame, Clock, RefreshCw, Eye, Sparkles, Check, ChevronRight, Award, Shield, Compass, HelpCircle, AlertOctagon, Heart, Zap, Map
} from "lucide-react";

interface BingoSquare {
  id: number;
  text: string;
  done: boolean;
  category: string;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  timeTaken: string;
  rank: number;
}

export default function GamificationCenter() {
  // 1. Cosmic Bingo states
  const [bingoBoard, setBingoBoard] = useState<BingoSquare[]>([]);
  const [bingoAlert, setBingoAlert] = useState<string | null>(null);
  const [badgesEarned, setBadgesEarned] = useState<string[]>([]);

  // 2. Space Streak Loyalty States
  const [streakDays, setStreakDays] = useState(1);
  const [streakClaimedToday, setStreakClaimedToday] = useState(false);
  const [streakMessage, setStreakMessage] = useState("");

  // 3. Timed Trivia Gauntlet States
  const [gameActive, setGameActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [score, setScore] = useState(0);
  const [gauntletLeaderboard, setGauntletLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challengerName, setChallengerName] = useState("Voyager Star");
  const [showScoreForm, setShowScoreForm] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trivia Gauntlet questions database
  const TRIVIA_GAUNTLET_DATA = [
    {
      q: "What is the escape velocity of Earth in kilometers per second?",
      a: ["11.2 km/s", "7.8 km/s", "24.5 km/s", "3.1 km/s"],
      correct: "11.2 km/s",
      fact: "Earth's escape velocity of 11.2 km/s is required to break free of planetary gravitational pull."
    },
    {
      q: "Which Kepler Kepler metric dictates orbital periods relative to major axes?",
      a: ["Kepler's Third Law", "Kepler's First Law", "Hubble Constant", "Law of Equal Areas"],
      correct: "Kepler's Third Law",
      fact: "Kepler's Third Law states the square of a planet's period is proportional to the cube of its semi-major axis."
    },
    {
      q: "What is the approximate density of a typical neutron star in g/cm³?",
      a: ["10^14 g/cm³", "10^5 g/cm³", "1 million g/cm³", "3,000 g/cm³"],
      correct: "10^14 g/cm³",
      fact: "An average neutron star is so compressed that a mere teaspoon of its material would weigh billions of tons!"
    },
    {
      q: "What stellar phenomenon leads to a Type Ia supernova?",
      a: ["White dwarf accretion limit collapse", "Supermassive star core fusion exhaust", "Pulsar coordinate dispersion", "Solar proton weather flare"],
      correct: "White dwarf accretion limit collapse",
      fact: "Type Ia supernovas occur in binary systems when a white dwarf reaches the Chandrasekhar limit of 1.44 solar masses."
    },
    {
      q: "Which solar wave metric tracks geomagnetic activity storm levels?",
      a: ["Kp-index", "Decibel frequency", "Fahrenheit scale", "Kepler orbit radius"],
      correct: "Kp-index",
      fact: "The planetary K-index (Kp) quantifies disturbances in the Earth's magnetic field on a scale from 0 to 9."
    }
  ];

  // 4. Spot the Satellite Citizen science states
  const [satelliteCoords, setSatelliteCoords] = useState<{ x: number; y: number } | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [anomalyScore, setAnomalyScore] = useState(0);
  const SATELLITE_IMG = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"; // Stellar satellite view of Earth surface

  // Target coordinates for anomalies
  const TARGET_ANOMALIES = [
    { name: "Kepler lunar peak shadow", x: 42, y: 35, desc: "A geological crater rim casting structural shadows on surface craters." },
    { name: "Defunct Soviet orbital debris", x: 75, y: 58, desc: "An old spy satellite booster emitting reflective titanium coordinates." },
    { name: "Active SpaceX Starlink packet", x: 18, y: 72, desc: "A pristine solar array panel reflecting stellar radiation flashes." }
  ];

  // Initialize
  useEffect(() => {
    // Sync streak states
    const curStreak = localStorage.getItem("cosmoguide_streak_days");
    if (curStreak) {
      setStreakDays(parseInt(curStreak));
    }
    const claimedStamp = localStorage.getItem("cosmoguide_streak_claimed_date");
    const todayStr = new Date().toDateString();
    if (claimedStamp === todayStr) {
      setStreakClaimedToday(true);
    }

    // Initialize/Sync Bingo Board
    const savedBingo = localStorage.getItem("cosmoguide_bingo_board");
    if (savedBingo) {
      try {
        setBingoBoard(JSON.parse(savedBingo));
      } catch (e) {}
    } else {
      resetBingoBoard();
    }

    // Initialize Gauntlet Leaderboard
    const savedScores = localStorage.getItem("cosmoguide_gauntlet_leader");
    if (savedScores) {
      try {
        setGauntletLeaderboard(JSON.parse(savedScores));
      } catch (e) {}
    } else {
      const defaultLeaders: LeaderboardEntry[] = [
        { name: "Orion_Master", score: 5, timeTaken: "24.1s", rank: 1 },
        { name: "HubbleExpert", score: 4, timeTaken: "32.4s", rank: 2 },
        { name: "SolarMaxFan", score: 3, timeTaken: "18.5s", rank: 3 }
      ];
      setGauntletLeaderboard(defaultLeaders);
      localStorage.setItem("cosmoguide_gauntlet_leader", JSON.stringify(defaultLeaders));
    }

    // Clean timer
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer counter for timed trivia
  useEffect(() => {
    if (gameActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleTimeExhausted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameActive, currentQuestionIdx, timerSeconds]);

  // Construct standard 5x5 bingo
  const resetBingoBoard = () => {
    const rawItems = [
      { text: "Simulate custom planet Kepler orbits", category: "Space mechanics" },
      { text: "Read live geomagnetic solar storm metric", category: "Solar telemetries" },
      { text: "Generate a celestial neural wallpaper", category: "Generative art" },
      { text: "Query AI assistant about black hole entropy", category: "Generative AI" },
      { text: "Configure personalized backyard coordinates", category: "Astronomy tools" },
      { text: "Unmask a TikTok solar hoax debunker", category: "Astronomy verification" },
      { text: "Unveil Hubble photos shot on birth month", category: "Stellar history" },
      { text: "Synthesize density gravity sound hum", category: "Audio synthesizer" },
      { text: "Trigger an orbital threat exit warning", category: "System triggers" },
      { text: "Connect Space ID key credentials", category: "Settings portal" },
      { text: "Evaluate comparative mass parameters", category: "Space mechanics" },
      { text: "Review active ESA payload clocks", category: "Rocket controls" },
      { text: "Pass standard solar trivia challenge", category: "Gamification" },
      { text: "Claim daily celestial streak stamp", category: "Stellar retention" },
      { text: "Adjust Kepler semi-major axis slider", category: "Space mechanics" },
      { text: "Consult astronomical glossary tooltip", category: "Exploration text" },
      { text: "Track current ISS latitude progress", category: "Orbital trackers" },
      { text: "Submit custom backyard log entry", category: "Astronomy tools" },
      { text: "Launch maximum focal mode viewport", category: "Window controls" },
      { text: "Sync GPS latitude settings", category: "Stellar tools" },
      { text: "Identify Starlink satellite target", category: "Citizen science" },
      { text: "Earn Apollo Quantum badge badge", category: "Gamification" },
      { text: "Configure Astrophysicist expert UI level", category: "Settings portal" },
      { text: "Share stargazing stats page to X stream", category: "Community share" },
      { text: "Inspect active sunspots count", category: "Solar telemetries" }
    ];

    const mapped: BingoSquare[] = rawItems.map((item, index) => ({
      id: index,
      text: item.text,
      done: Math.random() > 0.65, // Prefill a few randomly for instant delight
      category: item.category
    }));

    setBingoBoard(mapped);
    localStorage.setItem("cosmoguide_bingo_board", JSON.stringify(mapped));
    setBingoAlert(null);
  };

  // Toggle Bingo State
  const toggleBingoItem = (id: number) => {
    const updated = bingoBoard.map((sq) => {
      if (sq.id === id) return { ...sq, done: !sq.done };
      return sq;
    });
    setBingoBoard(updated);
    localStorage.setItem("cosmoguide_bingo_board", JSON.stringify(updated));

    // Check for new Bingo (a complete row, column or diagonal)
    checkBingoPatterns(updated);
  };

  const checkBingoPatterns = (board: BingoSquare[]) => {
    // Helper to evaluate if index indices are all 'done'
    const isDone = (indices: number[]) => indices.every((idx) => board[idx]?.done);

    let bingoCount = 0;

    // Check 5 Rows
    for (let r = 0; r < 5; r++) {
      const rowInx = [r*5, r*5+1, r*5+2, r*5+3, r*5+4];
      if (isDone(rowInx)) bingoCount++;
    }

    // Check 5 Columns
    for (let c = 0; c < 5; c++) {
      const colInx = [c, c+5, c+10, c+15, c+20];
      if (isDone(colInx)) bingoCount++;
    }

    // Check 2 Diagonals
    if (isDone([0, 6, 12, 18, 24])) bingoCount++;
    if (isDone([4, 8, 12, 16, 20])) bingoCount++;

    if (bingoCount > 0) {
      setBingoAlert(`🎉 CONGRATULATIONS COMMANDER! You achieved ${bingoCount} Cosmic Bingo line alignment(s)!`);
      const newBadges = [...badgesEarned];
      if (!newBadges.includes("Cosmic Alignment Officer")) {
        newBadges.push("Cosmic Alignment Officer");
        setBadgesEarned(newBadges);
        alert("🏆 Badge Unlocked: 'Cosmic Alignment Officer' has been credited to your Space ID Passport!");
      }
    }
  };

  // Claim Daily streak stamps
  const handleClaimStreak = () => {
    if (streakClaimedToday) return;

    const nextStreak = streakDays + 1;
    setStreakDays(nextStreak);
    localStorage.setItem("cosmoguide_streak_days", nextStreak.toString());
    
    const todayStr = new Date().toDateString();
    localStorage.setItem("cosmoguide_streak_claimed_date", todayStr);
    setStreakClaimedToday(true);

    // Provide customized rewarding tiers
    if (nextStreak % 7 === 0) {
      setStreakMessage("🔥 7-DAY STREAK MAXIMUM! AI synthesized custom constellation 'Voyager Nova' registered under your credentials.");
      alert("🌌 Weekly Milestone! Day 7 gives you a premium downloadable Milky Way high-res wallpaper. Click claim below!");
    } else if (nextStreak % 3 === 0) {
      setStreakMessage("⭐ 3-DAY STREAK! Unlocked standard high-res celestial wallpaper.");
    } else {
      setStreakMessage("✓ Daily coordinate synchronizations completed! Your streak tracker increased.");
    }
  };

  // Question gauntlet timer runout
  const handleTimeExhausted = () => {
    clearInterval(timerRef.current!);
    alert("⌛ Time spent! The light speed metric collapsed. Gauntlet Challenge failed!");
    setGameActive(false);
  };

  // Launch timed gauntlet
  const startTriviaGauntlet = () => {
    setGameActive(true);
    setCurrentQuestionIdx(0);
    setScore(0);
    setTimerSeconds(15);
  };

  // Answer selection
  const handleSelectAnswer = (ans: string) => {
    clearInterval(timerRef.current!);
    const currentQ = TRIVIA_GAUNTLET_DATA[currentQuestionIdx];
    
    if (ans === currentQ.correct) {
      setScore((prev) => prev + 1);
      alert(`✓ Correct Answer! ${currentQ.fact}`);
      
      const nextIdx = currentQuestionIdx + 1;
      if (nextIdx < TRIVIA_GAUNTLET_DATA.length) {
        setCurrentQuestionIdx(nextIdx);
        setTimerSeconds(15);
      } else {
        // Complete game success
        alert("🏆 BRILLIANT! You completed the Trivia Gauntlet with all correct answers.");
        setGameActive(false);
        setShowScoreForm(true);
      }
    } else {
      // Wrong answer terminates gauntlet
      alert(`❌ Wrong Answer! Gauntlet collapsed. Correct was: ${currentQ.correct}.\n\nDeep Astronomy: ${currentQ.fact}`);
      setGameActive(false);
    }
  };

  // Submit scorecard leaderboard
  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: LeaderboardEntry = {
      name: challengerName.trim() ||"Cadet Voyager",
      score: score,
      timeTaken: `${(TRIVIA_GAUNTLET_DATA.length * 15 - timerSeconds).toFixed(1)}s`,
      rank: gauntletLeaderboard.length + 1
    };
    
    const updated = [...gauntletLeaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    setGauntletLeaderboard(updated);
    localStorage.setItem("cosmoguide_gauntlet_leader", JSON.stringify(updated));
    setShowScoreForm(false);
  };

  // Spot the satellite citizen science clicks
  const handleSatelliteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setSatelliteCoords({ x: clickX, y: clickY });

    // Look for matching anomalies nearby
    let match = null;
    for (const target of TARGET_ANOMALIES) {
      const distance = Math.sqrt(Math.pow(target.x - clickX, 2) + Math.pow(target.y - clickY, 2));
      if (distance < 8) { // 8% bounding distance radius is hit
        match = target;
        break;
      }
    }

    if (match) {
      setScanResult(`🎯 ANOMALY IDENTIFIED: Found ${match.name}. ${match.desc}`);
      setAnomalyScore((prev) => prev + 10);
      alert(`🛰️ High-res Capture: Verified target signature: ${match.name}! Science data uploaded to ESA.`);
    } else {
      setScanResult("🌌 Faint background space radiation. Coordinate sweep completed without signal spikes.");
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Intro Metrics Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak loyalty card */}
        <div className="p-4 bg-slate-900/40 border border-indigo-500/10 rounded-2xl flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase block tracking-wider">Loyalty Level Tracker</span>
            <h5 className="text-sm font-bold text-white">Space Streak Tracker</h5>
            <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Streak: <strong>{streakDays} Days</strong></span>
            </div>
          </div>
          <button
            onClick={handleClaimStreak}
            disabled={streakClaimedToday}
            className={`p-2 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition ${
              streakClaimedToday
                ? "bg-slate-950 text-slate-500 border border-slate-800"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 animate-bounce cursor-pointer shadow-lg"
            }`}
          >
            {streakClaimedToday ? "Stamped!" : "Stamp Daily"}
          </button>
        </div>

        {/* Dynamic Achievements passport */}
        <div className="p-4 bg-slate-900/40 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase block tracking-wider">Credited Badges</span>
            <h5 className="text-sm font-bold text-white">Stellar Passport Badges</h5>
            <span className="text-xs font-mono text-slate-400">Total: <strong>{badgesEarned.length + 1} Earned</strong></span>
          </div>
          <div className="flex -space-x-1.5 scroll-none">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xs text-indigo-300" title="Apollo Quantum Cadet License">🚀</div>
            {badgesEarned.map((badge, idx) => (
              <div key={idx} className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-xs" title={badge}>🏆</div>
            ))}
          </div>
        </div>

        {/* Citizen Science Highscore */}
        <div className="p-4 bg-slate-900/40 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase block tracking-wider">Citizen Science level</span>
            <h5 className="text-sm font-bold text-white">Anomaly points tracker</h5>
            <span className="text-xs font-mono text-slate-400">Score: <strong>{anomalyScore} AP</strong></span>
          </div>
          <div className="p-2.5 bg-indigo-500/15 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Award className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {streakMessage && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>{streakMessage}</span>
        </div>
      )}

      {/* TWO PRIMARY INTERACTIVE MODULES GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 5x5 COSMIC BINGO GRID */}
        <div className="lg:col-span-7 p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-500/10 pb-3">
            <div className="flex items-center space-x-2.5 text-left">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Cosmic Bingo Alignment</h4>
                <p className="text-[10px] text-slate-400 font-sans">Align activities to complete paths & gain credentials</p>
              </div>
            </div>
            <button
              onClick={resetBingoBoard}
              className="p-1 px-2.25 bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 font-mono text-[9px] uppercase tracking-wider rounded flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reshuffle card</span>
            </button>
          </div>

          {bingoAlert && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold leading-relaxed text-center animate-bounce">
              {bingoAlert}
            </div>
          )}

          {/* Bingo 5x5 board render layout */}
          <div className="grid grid-cols-5 gap-1.5 select-none text-center">
            {bingoBoard.map((sq) => (
              <button
                key={sq.id}
                onClick={() => toggleBingoItem(sq.id)}
                className={`aspect-square p-1 rounded-lg border text-[8px] sm:text-[9.5px] leading-tight font-sans transition-all flex flex-col justify-between items-center text-center cursor-pointer ${
                  sq.done
                    ? "bg-gradient-to-b from-indigo-650 to-indigo-850 text-white border-indigo-400 shadow shadow-indigo-650"
                    : "bg-slate-950/70 border-slate-850 text-slate-400 hover:border-indigo-500/30 hover:text-white"
                }`}
                title={`${sq.text} (Category: ${sq.category})`}
              >
                <span className="font-mono text-[7px] text-indigo-400 font-bold opacity-60 block uppercase truncate w-full">
                  {sq.category.split(" ")[0]}
                </span>
                <span className="font-medium line-clamp-3 block px-0.5">{sq.text}</span>
                <div className="scale-75 mt-0.5">
                  {sq.done ? (
                    <Check className="w-3 h-3 text-emerald-300" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 block" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center">
            Tip: Complete any horizontal row, vertical column, or diagonal line to sync aligned planetary badges.
          </div>
        </div>

        {/* RIGHT COLUMN: Trivia Gauntlet & Spot-the-Satellite anomalies */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. TIMED TRIVIA GAUNTLET */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-505/10 pb-3">
              <div className="flex items-center space-x-2 text-left">
                <Clock className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }} />
                <div>
                  <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Timed Trivia Gauntlet</h4>
                  <p className="text-[10px] text-slate-400">15s velocity countdown limit per query</p>
                </div>
              </div>
              {gameActive && (
                <div className="p-1 px-2 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded font-mono text-xs font-bold leading-none animate-pulse">
                  TIMER: {timerSeconds}s
                </div>
              )}
            </div>

            {!gameActive && !showScoreForm && (
              <div className="space-y-3.5 text-center py-4">
                <p className="text-xs text-slate-400 leading-relaxed text-left">
                  Take the ultimate astrometer test: 5 highly technical astrophysics coordinate questions. A single wrong answer or timing out terminates your spacecraft's navigation!
                </p>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-slate-500 text-left block">Challenger Nickname:</label>
                  <input
                    type="text"
                    value={challengerName}
                    onChange={(e) => setChallengerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2 text-xs text-indigo-150 rounded-lg text-center"
                    placeholder="E.g. OrionCommander"
                  />
                </div>

                <button
                  onClick={startTriviaGauntlet}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-550 transition text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:shadow-indigo-650/40 cursor-pointer"
                >
                  ⚡ Trigger Gauntlet Run ⚡
                </button>
              </div>
            )}

            {gameActive && (
              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-widest font-mono block">
                    Telemetry Query {currentQuestionIdx + 1} of {TRIVIA_GAUNTLET_DATA.length}
                  </span>
                  <p className="text-white font-extrabold text-sm leading-normal">
                    {TRIVIA_GAUNTLET_DATA[currentQuestionIdx].q}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {TRIVIA_GAUNTLET_DATA[currentQuestionIdx].a.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      className="p-2.5 bg-slate-950 border border-slate-850 hover:border-indigo-500 rounded-xl text-left text-xs text-indigo-200 hover:text-white hover:bg-indigo-600/10 transition cursor-pointer"
                    >
                      {idx + 1}. {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showScoreForm && (
              <form onSubmit={handleSubmitScore} className="space-y-3 text-center py-4">
                <Shield className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h5 className="font-bold text-white text-sm">Gauntlet Cleared Synchronously!</h5>
                <p className="text-xs text-slate-400">Score: <strong>{score} / 5</strong> correct answers registered.</p>
                <button
                  type="submit"
                  className="w-full p-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  Post to Live Leaderboard Index
                </button>
              </form>
            )}

            {/* Timed challenge leaderboard */}
            <div className="pt-2 border-t border-slate-900 space-y-2">
              <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider font-mono block text-left">Gauntlet Leaderboards</span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {gauntletLeaderboard.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-950/50 p-2 rounded-xl text-xs border border-slate-900 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-amber-500 font-extrabold">{item.rank}.</span>
                      <span className="font-bold text-white">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400 font-mono text-[10px]">
                      <span>Correct: <strong className="text-emerald-400">{item.score}</strong></span>
                      <span>Time: <strong>{item.timeTaken}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. SPOT THE SATELLITE (Citizen Science anomaly scanner) */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-indigo-500/10 pb-3 text-left">
              <Eye className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Spot the satellite</h4>
                <p className="text-[10px] text-slate-405 text-slate-400">Identify anomalies in Kepler/Sentinel maps</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-left">
              Click on satellite terrain surface photo below to sweep anomaly signatures. Target reflective flares or crater anomalies.
            </p>

            {/* Clickable Satellite Map Image */}
            <div 
              onClick={handleSatelliteClick}
              className="relative rounded-xl overflow-hidden cursor-crosshair border border-indigo-500/15 h-36 border-b-2"
            >
              <img
                src={SATELLITE_IMG}
                alt="Satellite radar surface chart"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-indigo-500/5 select-none pointer-events-none" />

              {/* Target click radar animation */}
              {satelliteCoords && (
                <div 
                  className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-emerald-400 bg-emerald-500/15 rounded-full flex items-center justify-center animate-ping"
                  style={{ left: `${satelliteCoords.x}%`, top: `${satelliteCoords.y}%` }}
                >
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
              )}
            </div>

            {scanResult && (
              <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl text-[11px] leading-relaxed text-left animate-fadeIn font-mono">
                <span className="font-bold text-indigo-400 block mb-0.5">📟 COORDINATES RESULTS:</span>
                <span className="text-slate-300">{scanResult}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span className="uppercase">Precision scan rate: 89.4%</span>
              <span className="text-indigo-400 font-bold">GRID TARGET REFULGENCE ACTIVES</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
