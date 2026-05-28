import React, { useState, useEffect, useRef } from "react";
import { 
  Compass, MapPin, Calendar, Clock, Sparkles, BookOpen, Clock3, Download, Award, ChevronRight, Eye, Settings, Heart, AlertCircle, Plus, Trash
} from "lucide-react";

interface LogEntry {
  id: string;
  date: string;
  text: string;
  intensity: string;
  celestialTarget: string;
}

export default function PersonalCosmos() {
  // Coordinate / Night Sky parameters
  const [gpsLoading, setGpsLoading] = useState(false);
  const [city, setCity] = useState("Vandenberg Space Station");
  const [coords, setCoords] = useState({ lat: "34.74", lng: "-120.57" });
  const [nightSkyData, setNightSkyData] = useState({
    sunset: "19:54 PST",
    sunrise: "05:32 PST",
    viewWindows: [
      { body: "Saturn", time: "21:47 PM", visibility: "Excellent (Ring tilt is optimal)", priority: "High" },
      { body: "Jupiter", time: "23:20 PM", visibility: "Very Good (Greate Red Spot visible)", priority: "Medium" },
      { body: "Venus", time: "05:01 AM", visibility: "Fair (Low in eastern skies)", priority: "Low" },
      { body: "Mars", time: "02:15 AM", visibility: "Excellent (High brightness level)", priority: "High" }
    ],
    constellations: ["Ursa Major (The Big Dipper)", "Cassiopeia (The Queen)", "Orion (The Hunter)", "Lyra (The Lyre)"]
  });

  // Cosmic Journal states
  const [journalText, setJournalText] = useState("");
  const [celestialTarget, setCelestialTarget] = useState("Saturn Rings");
  const [intensity, setIntensity] = useState("Clear Space");
  const [savedLogs, setSavedLogs] = useState<LogEntry[]>([]);
  const [aiInsight, setAiInsight] = useState("");

  // Timeline States
  const [birthDate, setBirthDate] = useState("2001-05-15");
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  // Experience level (Adaptive UI)
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "enthusiast" | "astrophysicist">("enthusiast");

  // Load state and synced parameters
  useEffect(() => {
    // Sync current level
    const lvl = localStorage.getItem("cosmo_user_level") as any;
    if (lvl) setExperienceLevel(lvl);

    // Sync journal logs list
    const logs = localStorage.getItem("cosmoguide_journal_entries");
    if (logs) {
      try {
        setSavedLogs(JSON.parse(logs));
      } catch (err) {}
    } else {
      const initialLogs: LogEntry[] = [
        {
          id: "log-1",
          date: "May 25, 2026",
          text: "Spotted glowing green auroral ribbons overhead using low dark adapt filters. Solar storm storm active.",
          intensity: "Specular Brightness",
          celestialTarget: "Stellar North Oval"
        },
        {
          id: "log-2",
          date: "May 27, 2026",
          text: "Tracked ISS orbital transit arc perfectly crossing through the Orion's Belt coordinates vector.",
          intensity: "Crisp Precision",
          celestialTarget: "Space Station Beta"
        }
      ];
      setSavedLogs(initialLogs);
      localStorage.setItem("cosmoguide_journal_entries", JSON.stringify(initialLogs));
    }

    // Daily Insight Generation
    generateDailyInsight();
  }, []);

  const generateDailyInsight = () => {
    const insights = [
      "Your alignment star, Antares, anchors the stellar heart of Scorpio tonight, glowing with amber nuclear fire.",
      "The ISS floats exactly 418 kilometers above your head over the coming hours—visible as a fast moving point of light.",
      "Jupiter completes its current coordinate arc retrograde, inviting crystal telescope observations of its Galilean Jovian moons.",
      "Cosmic dust particles from the Halley Comet trail collide with our upper ionosphere today, sparking faint shooting stars."
    ];
    const randomIndex = Math.floor(Math.random() * insights.length);
    setAiInsight(insights[randomIndex]);
  };

  // Simulate Geo Fill
  const handleGPSDetect = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setCoords({ lat: "40.71", lng: "-74.00" });
      setCity("New York Observatory Terminal");
      setNightSkyData({
        sunset: "20:12 EST",
        sunrise: "05:21 EST",
        viewWindows: [
          { body: "Saturn", time: "22:15 PM", visibility: "Excellent Visibility", priority: "High" },
          { body: "Jupiter", time: "00:05 AM", visibility: "Outstanding Brightness", priority: "High" },
          { body: "Venus", time: "04:30 AM", visibility: "Medium Horizon", priority: "Low" },
          { body: "Mars", time: "01:10 AM", visibility: "Good Red Aspect", priority: "Medium" }
        ],
        constellations: ["Big Dipper", "Cygnus (Swan)", "Boötes", "Corona Borealis"]
      });
      setGpsLoading(false);
    }, 1000);
  };

  // Handle Journal Save
  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    const newLog: LogEntry = {
      id: "log-" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      text: journalText,
      intensity: intensity,
      celestialTarget: celestialTarget
    };

    const updated = [newLog, ...savedLogs];
    setSavedLogs(updated);
    localStorage.setItem("cosmoguide_journal_entries", JSON.stringify(updated));
    setJournalText("");
    alert("🌌 Cosmic Observation added and synced securely dynamically to local vault!");
  };

  // Delete Log
  const handleDeleteLog = (id: string) => {
    const filtered = savedLogs.filter(entry => entry.id !== id);
    setSavedLogs(filtered);
    localStorage.setItem("cosmoguide_journal_entries", JSON.stringify(filtered));
  };

  // Handle Birth Calculation
  const calculateTimeline = () => {
    if (!birthDate) return;
    const birthYear = parseInt(birthDate.substring(0, 4));
    
    // Create custom history relative back to the year
    const events = [
      {
        year: birthYear,
        desc: "The light particles exiting star Betelgeuse in the hunter Orion's shoulder started traveling towards your eyes.",
        fun: `On your date, the Hubble Space Telescope snapped coordinates of the Eagle Nebula nursery pillars.`
      },
      {
        year: birthYear + 5,
        desc: "Your 5th Birthday: The New Horizons deep probe initiated launching towards state Pluto at 58,000 km/h.",
        fun: "Cassini spacecraft sent the historic Saturn Rings raw high-resolution wave transmissions back to Earth."
      },
      {
        year: birthYear + 10,
        desc: "Your 10th Birthday: NASA's Kepler Space Telescope finalized its coordinates, finding first Earth-sized exoplanets orbiting distant suns.",
        fun: "Astronomers mapped full Cosmic Microwave Background maps confirming gravity clusters structure."
      },
      {
        year: birthYear + 18,
        desc: "Your 18th Birthday: Humanity captured the first real event-horizon image of the M87 supermassive Black Hole cluster.",
        fun: "Light from nearby Alpha Centauri solar system that left when you finished high school arrived at Earth telescopes."
      },
      {
        year: "Universe scale",
        desc: `Since you took your first breath, you have traveled approximately ${( (new Date().getFullYear() - birthYear) * 940).toLocaleString()} million kilometers aboard planetary vessel Earth rotating the Sun!`,
        fun: "The galaxy cluster you belong to expanded by multiple light years."
      }
    ];
    setTimelineEvents(events);
    setShowTimeline(true);
  };

  // Update Experience level
  const handleLevelChange = (lvl: "beginner" | "enthusiast" | "astrophysicist") => {
    setExperienceLevel(lvl);
    localStorage.setItem("cosmo_user_level", lvl);
    // Raise artificial storage event for global syncing
    window.dispatchEvent(new Event("storage"));
  };

  // Canvas Image Downloading for Cosmic timeline
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Drawing a super polished image card for story/wallpaper size!
    ctx.fillStyle = "#030712"; // Deep space black base
    ctx.fillRect(0, 0, 400, 600);

    // Nebula glow background
    const gradient = ctx.createRadialGradient(200, 300, 50, 200, 300, 300);
    gradient.addColorStop(0, "rgba(79, 70, 229, 0.2)"); // Indigo
    gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.05)"); // Blue
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 600);

    // Stars representation dots
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 60; i++) {
      const rx = Math.random() * 400;
      const ry = Math.random() * 600;
      const rSize = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Grid lines for tactical star chart aspect
    ctx.strokeStyle = "rgba(99, 102, 241, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 20; i < 400; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 600); ctx.stroke();
    }
    for (let j = 20; j < 600; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(400, j); ctx.stroke();
    }

    // Branding Title text
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("COSMOGUIDE OBSERVER STATIONS", 200, 40);

    ctx.fillStyle = "#6366f1";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("MY COSMIC CHRONOMETRY", 200, 75);

    // Border Frame outline
    ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 370, 570);

    // Profile Details
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px sans-serif";
    ctx.fillText(`Cadet Coordinates: Space Birth Year ${birthDate.substring(0, 4)}`, 200, 115);

    // Milestones text representation list
    ctx.fillStyle = "#94a3b8";
    ctx.font = "italic 11px sans-serif";
    ctx.fillText("Key Historical Space Epochs crossed since birth:", 200, 150);

    let currY = 190;
    timelineEvents.slice(0, 4).forEach((evt, idx) => {
      ctx.fillStyle = "#fbbf24"; // gold year
      ctx.font = "bold 12px monospace";
      ctx.fillText(`YEAR EQUIVALENT ${evt.year}`, 200, currY);

      ctx.fillStyle = "#ffffff";
      ctx.font = "11px sans-serif";
      // Split description text to fit in smaller widths
      const text = evt.desc.substring(0, 58) + "...";
      ctx.fillText(text, 200, currY + 18);
      currY += 50;
    });

    // Stats calculations block
    ctx.fillStyle = "#10b981"; // green accent
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("Total solar voyage metrics:", 200, 420);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "11px monospace";
    const years = new Date().getFullYear() - parseInt(birthDate.substring(0, 4));
    ctx.fillText(`Voyage distance: ~${(years * 940).toLocaleString()} million km`, 200, 445);
    ctx.fillText("System Clearance: Commander Level", 200, 465);

    // Footer signature brand watermark
    ctx.fillStyle = "rgba(99, 102, 241, 0.6)";
    ctx.font = "bold 9px monospace";
    ctx.fillText("Verify digital credentials at osmoguide.io/passport", 200, 555);

    // Save of the Canvas layer
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `cosmic_chronometry_card_${birthDate.substring(0,4)}.png`;
    link.href = url;
    link.click();
    alert("🌠 Cosmic chronometry card successfully saved to system storage!");
  };

  return (
    <div className="space-y-6 text-left">
      {/* Tab intro status */}
      <div className="p-4 bg-indigo-650/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-indigo-400 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono text-indigo-300 font-extrabold uppercase tracking-wider block">Cognitive Sync Active</span>
            <h4 className="text-sm font-bold text-white">Stellar Personal Portal Engine</h4>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-950/60 p-1 px-3 border border-slate-800 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{experienceLevel} Status</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Night Sky Dashboard (GPS/Observation) & Adaptive Levels Settings */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. MY NIGHT SKY DASHBOARD */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <Compass className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">My Night Sky tracker</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Location & Planet Viewing Optimizer</span>
                </div>
              </div>
              <button
                onClick={handleGPSDetect}
                disabled={gpsLoading}
                className="p-1.5 px-3 bg-indigo-600/20 border border-indigo-500/35 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] tracking-wider uppercase font-extrabold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{gpsLoading ? "Retrieving GPS..." : "Auto Geolocation Info"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[9px] uppercase font-bold text-indigo-300 font-mono">Observing coordinates</span>
                <p className="text-xs font-black text-white">{city}</p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                  <span>Lat: <strong>{coords.lat}</strong></span>
                  <span>|</span>
                  <span>Lng: <strong>{coords.lng}</strong></span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 text-xs">
                <span className="text-[9px] uppercase font-bold text-amber-400 font-mono block">Twilight transitions today</span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Sun Departure (Sunset):</span>
                  <span className="font-mono font-bold text-white">{nightSkyData.sunset}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Horizon Return (Sunrise):</span>
                  <span className="font-mono font-bold text-white">{nightSkyData.sunrise}</span>
                </div>
              </div>
            </div>

            {/* Planet tracking windows */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Best Viewing Windows (Tonight)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {nightSkyData.viewWindows.map((win, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950/30 border border-indigo-500/5 hover:border-indigo-500/20 rounded-xl flex items-center justify-between transition text-xs">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${win.priority === "High" ? "bg-rose-400" : win.priority === "Medium" ? "bg-amber-400" : "bg-indigo-400"}`} />
                        <span className="font-bold text-white text-xs">{win.body}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{win.visibility}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 rounded font-bold">{win.time}</span>
                      <button 
                        onClick={() => alert(`🚨 Alarm tracking synchronized! CosmoGuide will trigger a browser alert when ${win.body} aligns in your local coordinates sector.`)}
                        className="text-[9px] text-emerald-400 font-semibold block mt-1 hover:underline cursor-pointer"
                      >
                        Set Alert Target
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constellations overhead */}
            <div className="p-3 bg-indigo-600/5 border border-indigo-500/10 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-indigo-300 tracking-wider font-mono block">Directly Overhead Right now:</span>
              <div className="flex flex-wrap gap-2">
                {nightSkyData.constellations.map((con, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-950 px-2.5 py-1 rounded-full border border-slate-850 text-slate-300 font-mono hover:text-white transition">
                    ★ {con}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. ADAPTIVE EXPERIENTIAL INTELLIGENCE SELECTOR */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center space-x-2.5">
              <Settings className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Adaptive Space Interface level</h4>
                <p className="text-[10px] text-slate-400">Specify your astronomical clarity level to customize glossary data</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => handleLevelChange("beginner")}
                className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  experienceLevel === "beginner"
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                    : "bg-slate-950/60 border-slate-850 text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider block">Explorer</span>
                <span className="text-[8px] opacity-75 max-w-[80px] leading-tight block">Simple labels, basic facts</span>
              </button>

              <button
                onClick={() => handleLevelChange("enthusiast")}
                className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  experienceLevel === "enthusiast"
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                    : "bg-slate-950/60 border-slate-850 text-slate-400 hover:text-white"
                }`}
              >
                <Clock3 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider block">Enthusiast</span>
                <span className="text-[8px] opacity-75 max-w-[80px] leading-tight block">Deep mechanics & logs</span>
              </button>

              <button
                onClick={() => handleLevelChange("astrophysicist")}
                className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  experienceLevel === "astrophysicist"
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                    : "bg-slate-950/60 border-slate-850 text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider block">Astrophysicist</span>
                <span className="text-[8px] opacity-75 max-w-[80px] leading-tight block">Orbital codes, solar telemetry maps</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950/50 rounded-xl border border-indigo-500/10 text-[11px] leading-relaxed text-slate-400">
              {experienceLevel === "beginner" && (
                <span><strong>Friendly Mode:</strong> CosmoGuide keeps articles approachable. Key abbreviations automatically underline to show clear tooltips explaining complex words.</span>
              )}
              {experienceLevel === "enthusiast" && (
                <span><strong>Observatory Mode:</strong> Integrates planetary density calculations, live constellation rise grids and Kepler parameters. Standard setting for active backyard stargazers.</span>
              )}
              {experienceLevel === "astrophysicist" && (
                <span><strong>Theoretical Mode:</strong> Unlocks raw solar flare particle telemetry sweeps, exoplanet classification indexes and raw orbital integration metrics. Explanations use rigorous physical vocabulary.</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Cosmic Journal & Birth Chronometry Timeline */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 3. AI COSMIC JOURNAL AND LOG ENTRY */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-indigo-500/10 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Daily AI Cosmic Journal</h4>
                <p className="text-[10px] text-slate-400">Record observations & inspect synchronized celestial logs</p>
              </div>
            </div>

            {/* Static Morning AI Daily Digest */}
            <div className="p-3.5 bg-gradient-to-r from-indigo-950/60 to-slate-950 border border-indigo-550/30 rounded-xl space-y-1 relative overflow-hidden">
              <div className="absolute -top-3 -right-3 text-indigo-400/10 font-bold pointer-events-none text-6xl">AI</div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-300 font-mono block">Personalized Daily Log:</span>
              <p className="text-xs text-indigo-100 italic leading-relaxed text-left">
                "{aiInsight}"
              </p>
            </div>

            {/* Input Log Observation Form */}
            <form onSubmit={handleAddJournal} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">Log New Coordinate Observation:</label>
                <textarea
                  required
                  rows={2}
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Record what your coordinates showed tonight (e.g., 'Spotted fuzzy cloud cluster near Cassiopeia...')"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 hover:border-indigo-500/20 rounded-xl p-2.5 text-xs text-indigo-150 focus:outline-none transition placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-slate-400 block">Celestials Target:</label>
                  <input
                    type="text"
                    required
                    value={celestialTarget}
                    onChange={(e) => setCelestialTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2 text-xs text-indigo-150 focus:outline-none focus:border-indigo-500 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-slate-400 block">Visual Intensity:</label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2 text-xs text-indigo-150 focus:outline-none focus:border-indigo-500 rounded-lg font-mono"
                  >
                    <option value="Specular Brightness">Specular Brightness</option>
                    <option value="Crisp Precision">Crisp Precision</option>
                    <option value="Faint Diffuse Cloud">Faint Diffuse Cloud</option>
                    <option value="Atmospheric Distortions">Atmospheric Distortions</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-550 active:scale-95 transition text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Safeguard Log Observation</span>
              </button>
            </form>

            {/* List of observations entries */}
            <div className="space-y-2 mt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Saved Observational Ledger ({savedLogs.length})</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {savedLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-950/55 rounded-xl border border-slate-900 space-y-1 relative group text-xs text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-slate-500 font-bold">{log.date}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9.5px] uppercase font-mono text-indigo-400 px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded font-semibold">{log.celestialTarget}</span>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          title="Purge observation log"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-300 font-sans leading-relaxed">{log.text}</p>
                    <div className="text-[9px] text-slate-500 font-mono">Intensity Parameter: <strong>{log.intensity}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. MY BIRTH TO PRESENT COSMIC CHRONOMETRY TIMELINE */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-indigo-500/10 pb-3">
              <Calendar className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Cosmic Timeline Generator</h4>
                <p className="text-[10px] text-slate-400 font-sans">Convert your Earth birth date into real universe milestones</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-850 p-2.5 text-xs text-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono uppercase"
              />
              <button
                onClick={calculateTimeline}
                className="p-2.5 px-4 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg active:scale-95 transition flex items-center space-x-1 flex-shrink-0"
              >
                <span>Process Chronology</span>
              </button>
            </div>

            {showTimeline && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-l-2 border-indigo-500/30 pl-4 space-y-3">
                  {timelineEvents.map((evt, idx) => (
                    <div key={idx} className="relative space-y-0.5 text-left text-xs">
                      {/* Node circle dot */}
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-indigo-400 rounded-full border-2 border-slate-950 shadow-md animate-pulse" />
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        🛰️ Epoch: {evt.year}
                      </span>
                      <p className="text-white font-bold leading-tight">{evt.desc}</p>
                      <p className="text-slate-405 italic text-[11px] font-sans leading-normal text-slate-400">
                        {evt.fun}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Secret export canvas wrapper */}
                <canvas ref={canvasRef} width={400} height={600} className="hidden" />

                <button
                  onClick={handleDownloadCard}
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 active:scale-98 transition text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download My Cosmic Timeline Card</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
