import React, { useState, useEffect, useRef } from "react";
import { 
  Sliders, Activity, Compass, Scale, Sparkles, RefreshCw, Trash, Info, HelpCircle, AlertTriangle, Eye, Award
} from "lucide-react";

interface UniverseScaleItem {
  exponent: number;
  name: string;
  desc: string;
  illustration: string;
  metric: string;
}

export default function DeepSpaceToys() {
  // 1. Scale of the Universe states
  const [scaleVal, setScaleVal] = useState(0); // Slider value mapping index inside UNIVERSE_SCALE
  const UNIVERSE_SCALE: UniverseScaleItem[] = [
    { exponent: -15, name: "Proton & Quantum Foam", desc: "Flickering quantum foam fluctuating spacetime at absolute Planck scale limits.", metric: "10^-15 m", illustration: "⚛️" },
    { exponent: -10, name: "Hydrogen Atom Shell", desc: "A singular electron cloud shell envelope orbiting a proton nucleus.", metric: "10^-10 m", illustration: "🧬" },
    { exponent: -6, name: "Human Red Blood Cell", desc: "Densely packed hemoglobin cell delivering biological oxygen inputs.", metric: "10^-6 m", illustration: "🩸" },
    { exponent: 0, name: "Observatory Commander (Human)", desc: "Backyard backyard stargazing voyager reflecting on cosmic dimensions.", metric: "1 ^0 m", illustration: "👩‍🚀" },
    { exponent: 3, name: "Vandenberg Launch Facility", desc: "Rocket orbital countdown pad propelling heavy boosters into space.", metric: "10^3 m", illustration: "🚀" },
    { exponent: 7, name: "Planet Earth Vessel", desc: "Water-bearing atmospheric biosphere cruising orbital lanes around the Sun.", metric: "1.27 * 10^7 m", illustration: "🌍" },
    { exponent: 9, name: "Stellar Orbit of the Moon", desc: "Gravitational lunar lock path looping the Earth every 27.3 days.", metric: "3.84 * 10^8 m", illustration: "🌙" },
    { exponent: 12, name: "Solar System Boundaries", desc: "Stellar envelope enclosing 8 planets inside coordinates bounds.", metric: "10^12 m", illustration: "☀️" },
    { exponent: 16, name: "Crab Nebula Nursery", desc: "The glowing remnant cloud of a supernova observed in 1054 CE.", metric: "10^16 m", illustration: "🌌" },
    { exponent: 21, name: "Milky Way Galaxy Spiral", desc: "Rotating stellar disk holding 200 billion star furnaces and suns.", metric: "10^21 m", illustration: "🌀" },
    { exponent: 26, name: "Observable Universe Bounds", desc: "The absolute coordinates envelope reachable by electromagnetic wave radiations.", metric: "10^26 m", illustration: "🔮" }
  ];

  // 2. Gravity Simulator Physics Canvas states
  const simCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [trailEnabled, setTrailEnabled] = useState(true);
  const [gravityStatus, setGravityStatus] = useState("Operational");
  
  // Physics parameters
  const mousePressPos = useRef<{ x: number; y: number } | null>(null);
  const curMousePos = useRef<{ x: number; y: number } | null>(null);
  const starPos = useRef({ x: 250, y: 150 });
  const [planetCount, setPlanetCount] = useState(1);

  // Simple state arrays for planets
  // x, y, vx, vy, trail: {x,y}[]
  const planets = useRef<any[]>([
    { x: 250, y: 60, vx: 2.8, vy: 0, color: "#cbd5e1", trail: [] }
  ]);

  // 3. Light Travel Time Calculator States
  const [selectedDestination, setSelectedDestination] = useState("Alpha Centauri");
  const [lightContextResult, setLightContextResult] = useState<any | null>(null);

  const LIGHT_DESTINATIONS = [
    { name: "Moon", time: "1.3 seconds", value: "1.3s", ly: "0.00000004 ly", epoch: "That is less than the time it takes for a human heart to beat once." },
    { name: "Mars (Average)", time: "12.5 minutes", value: "12.5m", ly: "0.000024 ly", epoch: "The light departed when you first opened this browser tab session." },
    { name: "Alpha Centauri", time: "4.3 years", value: "4.3 years", ly: "4.3 ly", epoch: "That light departed when first prototypes of AI coding assistants were programmed." },
    { name: "Crab Nebula", time: "6,500 years", value: "6,500 years", ly: "6,500 ly", epoch: "Mesopotamian scientists in history invented agricultural wheel designs when this light left its supernova!" },
    { name: "Betelgeuse Star", time: "640 years", value: "640 years", ly: "640 ly", epoch: "This light left its nuclear mass shell source during the Black Death pandemic of Europe." },
    { name: "Andromeda Galaxy", time: "2.5 million years", value: "2.5M years", ly: "2.5M ly", epoch: "This light started traveling when earliest hominid Homo Habilis began tool crafting." }
  ];

  // 4. "What If" Scenario Generator States
  const [selectedWhatIf, setSelectedWhatIf] = useState("What if Moon twice as close?");
  const WHAT_IF_SCENARIOS: { [key: string]: { title: string; fact: string; effects: string[] } } = {
    "What if Moon twice as close?": {
      title: "Double Proximity Lunar Orbit",
      fact: "Gravitational tides follow an inverse-cube law relationship.",
      effects: [
        "Tidal amplitudes multiply by 8 times, flooding major coastal cities daily.",
        "Geomagnetic friction accelerates Earth rotation slowdown, shortening days.",
        "Lunar sky dimensions appear twice as massive, triggering eclipse surges."
      ]
    },
    "What if Earth had rings?": {
      title: "Saturnian Equatorial Ring Arc",
      fact: "Dust particles form orbits matching Roche Limit distances.",
      effects: [
        "Glorious white silica rings trace paths spanning our clear twilight horizon.",
        "Massive shadow cast cuts sunlight levels, triggering extreme winter chills.",
        "Satellite telemetry networks suffer collisions with micro-meteorite arrays."
      ]
    },
    "What if Jupiter was a red dwarf?": {
      title: "Binary Stellar Jovian System",
      fact: "Jupiter would require 80 times more mass to spark hydrogen fusion.",
      effects: [
         "Earth experiences unstable elliptical orbits drifting between binary sun orbits.",
         "Jupiter glows with faint red thermal infrared radiation visible in skies.",
         "Stellar flares sweep radioactive ions destroying ozone grids."
      ]
    },
    "What if solar flare wipes sat nets?": {
      title: "Geomagnetic Carrington Class Threat",
      fact: "An X-class flare hits direct magnetosphere grid points.",
      effects: [
        "Global power grid nodes collapse under high ground currents.",
        "Spectacular active auroras turn dark skies green down to Mexico.",
        "Satellite handshakes break, reverting navigation back to compass mechanics."
      ]
    }
  };

  // 5. Scratch-Off fact canvas interaction states
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [scratchFact, setScratchFact] = useState("Stardust Fact: Almost every atom in your body (iron, calcium) was forged inside the cores of dying stars billions of years ago.");

  // Gravity SIM physics loop
  useEffect(() => {
    let animId: number;

    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale coordinates for crisp view
    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = 300;

    starPos.current = { x: canvas.width / 2, y: canvas.height / 2 };

    const updatePhysics = () => {
      if (!isSimRunning) return;

      const G = 0.5; // Newton's gravity constant relative metric
      const M = 2200; // Star Mass core weight

      planets.current.forEach((planet, index) => {
        // Calculate coordinate distance
        const dx = starPos.current.x - planet.x;
        const dy = starPos.current.y - planet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 15) {
          // Crash behavior
          setGravityStatus(`Planet collided into central Star!`);
          planets.current[index] = {
            x: starPos.current.x + (Math.random() > 0.5 ? 90 : -90),
            y: starPos.current.y + 20,
            vx: 0,
            vy: 2.9,
            color: index === 0 ? "#cbd5e1" : "#f472b6",
            trail: []
          };
          return;
        }

        if (dist > 600) {
          // Escape velocity behavior
          setGravityStatus(`Voyager escaped gravity well limits!`);
          planet.x = starPos.current.x - 100;
          planet.y = starPos.current.y - 120;
          planet.vx = 2.4;
          planet.vy = -1.1;
          planet.trail = [];
          return;
        }

        // Force: F = G * M * m / r^2
        // Accel: a = F / m = G * m / r^2
        const accel = (G * M) / (dist * dist);
        const ax = accel * (dx / dist);
        const ay = accel * (dy / dist);

        // Verlet velocity integrate
        planet.vx += ax;
        planet.vy += ay;
        planet.x += planet.vx;
        planet.y += planet.vy;

        // Trail registry
        if (trailEnabled) {
          planet.trail.push({ x: planet.x, y: planet.y });
          if (planet.trail.length > 70) planet.trail.shift();
        } else {
          planet.trail = [];
        }
      });
      setGravityStatus("Stable Elliptical orbit achieved");
    };

    const drawSim = () => {
      ctx.fillStyle = "#030712"; // dark system base
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Star draw glows
      const glow = ctx.createRadialGradient(starPos.current.x, starPos.current.y, 4, starPos.current.x, starPos.current.y, 25);
      glow.addColorStop(0, "#fbbf24"); // yellow core
      glow.addColorStop(0.3, "rgba(249, 115, 22, 0.6)"); // orange
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(starPos.current.x, starPos.current.y, 25, 0, Math.PI * 2);
      ctx.fill();

      // Core point
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(starPos.current.x, starPos.current.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Orbit Draw trail
      planets.current.forEach((planet) => {
        if (planet.trail.length > 1) {
          ctx.strokeStyle = planet.color === "#f472b6" ? "rgba(244, 114, 182, 0.45)" : "rgba(129, 140, 248, 0.45)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(planet.trail[0].x, planet.trail[0].y);
          for (let i = 1; i < planet.trail.length; i++) {
            ctx.lineTo(planet.trail[i].x, planet.trail[i].y);
          }
          ctx.stroke();
        }

        // Draw planet
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Planet label tags
        ctx.fillStyle = "#94a3b8";
        ctx.font = "8px monospace";
        ctx.fillText(`PLANET ${planet.color === "#f472b6" ? "BETA" : "ALPHA"}`, planet.x + 8, planet.y + 4);
      });

      // Draw active slingshot vector line
      if (mousePressPos.current && curMousePos.current) {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mousePressPos.current.x, mousePressPos.current.y);
        ctx.lineTo(curMousePos.current.x, curMousePos.current.y);
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(mousePressPos.current.x, mousePressPos.current.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const runLoop = () => {
      updatePhysics();
      drawSim();
      animId = requestAnimationFrame(runLoop);
    };

    runLoop();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isSimRunning, trailEnabled]);

  // Handle calculator trigger
  useEffect(() => {
    const found = LIGHT_DESTINATIONS.find(d => d.name === selectedDestination);
    if (found) {
      setLightContextResult(found);
    }
  }, [selectedDestination]);

  // Initialize Scratch-Off facts canvas layer
  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 420;
    canvas.height = 80;

    // Draw opaque metallic overlay fact cover
    ctx.fillStyle = "#1e1b4b"; // deep indigo scratch cover
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("🎨 CLICK & DRAG CURSOR TO SCRATCH OUT SECRET", 210, 45);

    // Randomize facts underlying
    const facts = [
      "Stardust Fact: Almost all iron in your blood cells was forged inside supernova collapses!",
      "Voyager fact: Signal clocks are so far out they take 22 hours to downlink telemetry.",
      "Venus fact: It rotates back-wards relative to other solar companions.",
      "Black hole fact: Time clocks completely stop relative to outer stargazers at the threshold event horizon."
    ];
    setScratchFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  // Slingshot click and launch
  const handleSimMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    mousePressPos.current = { x: px, y: py };
    curMousePos.current = { x: px, y: py };
  };

  const handleSimMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mousePressPos.current) return;
    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    curMousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleSimMouseUp = () => {
    if (!mousePressPos.current || !curMousePos.current) return;

    // Calculate pull back vector speed acceleration scale
    const dx = mousePressPos.current.x - curMousePos.current.x;
    const dy = mousePressPos.current.y - curMousePos.current.y;

    // vx/vy scale speeds limits
    const vx = dx * 0.045;
    const vy = dy * 0.045;

    const nextPlanet = {
      x: mousePressPos.current.x,
      y: mousePressPos.current.y,
      vx: vx,
      vy: vy,
      color: "#f472b6", // pink color for custom lanzado planets
      trail: []
    };

    planets.current.push(nextPlanet);
    setPlanetCount(planets.current.length);
    mousePressPos.current = null;
    curMousePos.current = null;
    alert("🚀 Planet launched into stellar orbit lane! Tracking physics stability.");
  };

  const clearSandbox = () => {
    planets.current = [];
    setPlanetCount(0);
    setGravityStatus("Sandbox cleared. Add new planets!");
  };

  // Scratch facts trigger
  const handleScratchAction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear transparent circular paths on metallic overlay
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Track total percentage scraped (simple index state trigger limit)
    setScratchPercentage((prev) => Math.min(prev + 2.5, 100));
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Educational Toys Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Scale of Universe & Physics SIM Sandbox */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. SCALE OF THE UNIVERSE INTERACTIVE SCROLL */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-indigo-500/10 pb-3">
              <Scale className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Scale of the Universe scroll</h4>
                <p className="text-[10px] text-slate-400 font-mono">Zoom from atomic quarks up to Laniakea galaxy threads</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Zoom input range */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Micro Physics (10^-15m)</span>
                  <span className="font-mono text-indigo-400 font-bold px-2 py-0.5 bg-indigo-500/10 rounded">
                    Active Zoom Exponent: {UNIVERSE_SCALE[scaleVal].metric}
                  </span>
                  <span>Macro Galaxies (10^26m)</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={UNIVERSE_SCALE.length - 1}
                  step={1}
                  value={scaleVal}
                  onChange={(e) => setScaleVal(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-950 rounded-lg h-2 cursor-pointer mt-1"
                />
              </div>

              {/* Informative Step display card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950/80 p-4 rounded-xl border border-indigo-501/10 relative overflow-hidden transition duration-300">
                <div className="md:col-span-2 text-center text-4xl p-2 select-none">
                  {UNIVERSE_SCALE[scaleVal].illustration}
                </div>
                <div className="md:col-span-10 space-y-1 text-left">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-[10.5px] uppercase bg-indigo-500/10 text-indigo-300 rounded font-bold px-1.5 py-0.5">
                      {UNIVERSE_SCALE[scaleVal].name}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-400 text-[11px] font-bold">{UNIVERSE_SCALE[scaleVal].metric}</span>
                  </div>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans text-slate-300">
                    {UNIVERSE_SCALE[scaleVal].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. GRAVITY SIMULATOR PHYSICS CANVAS */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-indigo-505/10 pb-3 gap-2">
              <div className="flex items-center space-x-2 text-left">
                <Activity className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Stellar Gravity Orbit sandbox</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Slingshot particles into live elliptical loops</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimRunning(!isSimRunning)}
                  className="p-1 px-2.25 bg-slate-950 border border-slate-850 text-[10px] font-bold uppercase text-indigo-300 hover:text-white rounded cursor-pointer"
                >
                  {isSimRunning ? "Freeze Clock" : "Resume Loops"}
                </button>
                <button
                  onClick={clearSandbox}
                  className="p-1 px-2.25 bg-slate-950 border border-slate-850 text-[10px] font-bold uppercase text-rose-400 hover:text-white rounded cursor-pointer"
                >
                  <Trash className="w-3" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-left">
              Instructions: **Click and drag/pull backward inside base coordinates box** like a slingshot arrow vector to launch custom planet Beta. Orbits align relative to gravity pulls.
            </p>

            {/* Interactive Physics Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-951 shadow-inner select-none">
              <canvas
                ref={simCanvasRef}
                onMouseDown={handleSimMouseDown}
                onMouseMove={handleSimMouseMove}
                onMouseUp={handleSimMouseUp}
                className="w-full bg-slate-955 cursor-crosshair border-b border-indigo-500/10 block hover:shadow-[inset_0_0_15px_rgba(99,102,241,0.2)]"
              />

              <div className="absolute top-2 left-2 p-1.5 px-3 rounded-lg bg-slate-950/85 border border-slate-800 text-[9.5px] font-mono text-slate-400 flex items-center space-x-2 select-none pointer-events-none text-left">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Gravity Status: <strong>{gravityStatus}</strong></span>
              </div>

              <div className="absolute bottom-2 right-2 p-1 px-2 rounded-lg bg-slate-950/80 text-[8.5px] font-mono text-slate-500 pointer-events-none">
                Active Planets orbiting: {planetCount}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-550 text-slate-500 gap-1.5 w-full text-center sm:text-left">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={trailEnabled}
                  onChange={(e) => setTrailEnabled(e.target.checked)}
                  id="trail_togg"
                  className="rounded bg-slate-950 accent-indigo-500"
                />
                <label htmlFor="trail_togg" className="cursor-pointer">Enable Kepler Orbit Draw Trail</label>
              </div>
              <span className="uppercase">Net Space mass: 2.2 * 10^30 kg</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Light Travel Calculator, What If Scenarios, Scratch card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 3. LIGHT TRAVEL TIME CALCULATOR */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-indigo-500/10 pb-3">
              <Compass className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Light Travel Time Calculator</h4>
                <p className="text-[10px] text-slate-400 font-mono">Historical milestones matched to wave velocities</p>
              </div>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-[9.5px] uppercase font-bold text-slate-400 font-mono block">Select Coordinate Destination:</label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 text-xs text-indigo-150 focus:outline-none focus:border-indigo-500 rounded-xl font-mono cursor-pointer"
                >
                  {LIGHT_DESTINATIONS.map((dest, idx) => (
                    <option key={idx} value={dest.name}>{dest.name} ({dest.ly})</option>
                  ))}
                </select>
              </div>

              {lightContextResult && (
                <div className="p-4 bg-slate-955/80 border border-slate-900 rounded-xl space-y-3 animate-fadeIn text-left">
                  <div className="grid grid-cols-2 gap-2 text-center border-b border-slate-900 pb-2.5 font-mono">
                    <div className="bg-slate-950 p-2 rounded-lg">
                      <span className="text-[8px] text-indigo-400 block uppercase font-bold">Light Wave Delay</span>
                      <span className="font-bold text-white text-sm">{lightContextResult.time}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg">
                      <span className="text-[8px] text-indigo-400 block uppercase font-bold">Absolute ly metric</span>
                      <span className="font-bold text-white text-sm">{lightContextResult.ly}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] text-amber-400 uppercase font-bold tracking-widest font-mono block">Earth Historical Correlation:</span>
                    <p className="text-[11.5px] leading-relaxed font-serif italic text-slate-300">
                      "{lightContextResult.epoch}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. "WHAT IF" SCENARIO GENERATOR */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-indigo-500/10 pb-3">
              <Info className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">\"What If?\" Scenario Analyzer</h4>
                <p className="text-[10px] text-slate-450 text-slate-400">Extreme astronomical simulation modeler</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[9.5px] text-slate-400 font-mono block uppercase font-bold">Select theoretical phenomenon:</label>
                <select
                  value={selectedWhatIf}
                  onChange={(e) => setSelectedWhatIf(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 text-xs text-indigo-150 focus:outline-none focus:border-indigo-500 rounded-xl cursor-pointer"
                >
                  {Object.keys(WHAT_IF_SCENARIOS).map((key, idx) => (
                    <option key={idx} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              {WHAT_IF_SCENARIOS[selectedWhatIf] && (
                <div className="p-3.5 bg-indigo-550/5 border border-indigo-500/10 rounded-xl space-y-2.5 animate-fadeIn text-left">
                  <div>
                    <span className="text-[8px] uppercase font-bold text-indigo-305 tracking-widest font-mono text-indigo-300 block">System Simulation</span>
                    <h5 className="font-extrabold text-white text-sm">{WHAT_IF_SCENARIOS[selectedWhatIf].title}</h5>
                    <span className="text-[10px] italic text-slate-450 text-slate-500 font-mono mt-0.5">{WHAT_IF_SCENARIOS[selectedWhatIf].fact}</span>
                  </div>

                  <div className="space-y-1.5 border-t border-indigo-500/10 pt-2 text-[11px] leading-relaxed">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] font-mono">Predicted Ecological Effects:</span>
                    <ul className="space-y-1 text-slate-300">
                      {WHAT_IF_SCENARIOS[selectedWhatIf].effects.map((eff, index) => (
                        <li key={index} className="flex items-start space-x-1.5">
                          <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">•</span>
                          <span>{eff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. SCRATCH-OFF FACT REVEAL WIDGET */}
          <div className="p-5 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-indigo-505/10 pb-3 text-left">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: "14s" }} />
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Interactive Scratch-off Fact</h4>
                <p className="text-[10px] text-slate-400">Scratch the card surface to reveal direct stardust context</p>
              </div>
            </div>

            {/* Canvas layer with relative placement fact container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-900 h-20 bg-slate-950 border-b-2 flex items-center justify-center p-4">
              {/* Underlying real fact */}
              <div className="absolute inset-0 flex items-center justify-center text-center p-3 font-semibold text-[10.5px] leading-relaxed text-indigo-150 z-0">
                {scratchFact}
              </div>

              {/* Canvas scratchable cover mask */}
              <canvas
                ref={scratchCanvasRef}
                onMouseMove={handleScratchAction}
                className="absolute inset-0 z-10 w-full h-full cursor-pointer bg-transparent block"
              />
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span>Scrape amount: <strong>{scratchPercentage.toFixed(0)}%</strong></span>
              <button 
                onClick={() => {
                  setScratchPercentage(0);
                  const canvas = scratchCanvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.fillStyle = "#1e1b4b";
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      ctx.fillStyle = "#94a3b8";
                      ctx.font = "bold 13px monospace";
                      ctx.textAlign = "center";
                      ctx.fillText("🎨 CLICK & DRAG CURSOR TO SCRATCH OUT SECRET", 210, 45);
                    }
                  }
                }}
                className="text-indigo-400 hover:underline hover:text-white cursor-pointer"
              >
                Reset cover overlay
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
