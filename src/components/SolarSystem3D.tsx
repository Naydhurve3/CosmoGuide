// CosmoGuide - AI Space Exploration Cockpit
// Created by: Nayan Dhurve (nayandhurve44@gmail.com)
// License: MIT

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Zap, Eye, RotateCcw } from "lucide-react";

interface PlanetDef {
  id: string;
  name: string;
  color: string;
  radius: number; // visual scale size
  orbitRadius: number; // visual axis scale
  speed: number; // orbital angular speeds
  mass: string;
  diameter: string;
  temperature: string;
  gravity: string;
  atmosphere: string;
  fact: string;
}

const PLANETS: PlanetDef[] = [
  {
    id: "mercury",
    name: "Mercury",
    color: "#9ca3af",
    radius: 4,
    orbitRadius: 55,
    speed: 0.04,
    mass: "3.285 × 10^23 kg (0.05x Earth)",
    diameter: "4,879 km",
    temperature: "-173°C to 427°C",
    gravity: "3.7 m/s²",
    atmosphere: "Oxygen, Helium exosphere",
    fact: "Nearest neighbor planet. One Mercury year spans only 88 Earth days."
  },
  {
    id: "venus",
    name: "Venus",
    color: "#fbbf24",
    radius: 7,
    orbitRadius: 80,
    speed: 0.015,
    mass: "4.867 × 10^24 kg (0.8x Earth)",
    diameter: "12,104 km",
    temperature: "462°C (Hottest core greenhouse)",
    gravity: "8.87 m/s²",
    atmosphere: "Thick CO2 (96%), Sulfuric acid",
    fact: "Venus revolves backward! One rotational Venus day is longer than its astronomical year."
  },
  {
    id: "earth",
    name: "Earth",
    color: "#3b82f6",
    radius: 8,
    orbitRadius: 110,
    speed: 0.01,
    mass: "5.972 × 10^24 kg",
    diameter: "12,742 km",
    temperature: "-89°C to 58°C",
    gravity: "9.81 m/s²",
    atmosphere: "Nitrogen (78%), Oxygen (21%)",
    fact: "Our biological home harbor, boasting dynamic magnetic protection systems and oceans."
  },
  {
    id: "mars",
    name: "Mars",
    color: "#ef4444",
    radius: 5,
    orbitRadius: 140,
    speed: 0.008,
    mass: "6.39 × 10^23 kg (0.1x Earth)",
    diameter: "6,779 km",
    temperature: "-143°C to 35°C",
    gravity: "3.72 m/s²",
    atmosphere: "Thin Carbon Dioxide (95%)",
    fact: "The Red Planet hosts Olympus Mons, the tallest planetary volcano (22 km) in our solar system."
  },
  {
    id: "jupiter",
    name: "Jupiter",
    color: "#f59e0b",
    radius: 16,
    orbitRadius: 190,
    speed: 0.004,
    mass: "1.898 × 10^27 kg (318x Earth)",
    diameter: "139,820 km",
    temperature: "-108°C",
    gravity: "24.79 m/s²",
    atmosphere: "Hydrogen (90%), Helium (10%)",
    fact: "Largest gas giant. Its Great Red Spot is a persistent planetary storm wider than Planet Earth."
  },
  {
    id: "saturn",
    name: "Saturn",
    color: "#fef08a",
    radius: 13,
    orbitRadius: 245,
    speed: 0.002,
    mass: "5.683 × 10^26 kg (95x Earth)",
    diameter: "116,460 km",
    temperature: "-139°C",
    gravity: "10.44 m/s²",
    atmosphere: "Hydrogen, Helium traces",
    fact: "Famed for its magnificent orbital ring systems made of millions of ice particles and space rocks."
  },
  {
    id: "uranus",
    name: "Uranus",
    color: "#22d3ee",
    radius: 10,
    orbitRadius: 300,
    speed: 0.001,
    mass: "8.681 × 10^25 kg (14x Earth)",
    diameter: "50,724 km",
    temperature: "-224°C (Coldest atmosphere)",
    gravity: "8.69 m/s²",
    atmosphere: "Hydrogen, Helium, Methane clouds",
    fact: "Uranus spins on a unique 98° vertical axis tilt, causing spectacular polar seasons."
  },
  {
    id: "neptune",
    name: "Neptune",
    color: "#3b82f6",
    radius: 10,
    orbitRadius: 355,
    speed: 0.0007,
    mass: "1.024 × 10^26 kg (17x Earth)",
    diameter: "49,244 km",
    temperature: "-201°C",
    gravity: "11.15 m/s²",
    atmosphere: "Methane gases, Helium, Hydrogen",
    fact: "Supersonic winds tear through the cold methane atmosphere at over 2,100 km/h."
  }
];

export default function SolarSystem3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States for interactive controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);
  const [showOrbits, setShowOrbits] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetDef | null>(null);

  // Viewport projection parameters
  const [zoom, setZoom] = useState(1.0);
  const [tilt, setTilt] = useState(0.4); // Tilt aspect ratio factor (Y stretching)
  const [rotation, setRotation] = useState(0); // rotation offset angle

  // Tracks mouse movements
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  // Angles of current orbits
  const angles = useRef<Record<string, number>>({
    mercury: Math.random() * Math.PI * 2,
    venus: Math.random() * Math.PI * 2,
    earth: Math.random() * Math.PI * 2,
    mars: Math.random() * Math.PI * 2,
    jupiter: Math.random() * Math.PI * 2,
    saturn: Math.random() * Math.PI * 2,
    uranus: Math.random() * Math.PI * 2,
    neptune: Math.random() * Math.PI * 2,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMouse.current.x;
    const deltaY = e.clientY - previousMouse.current.y;

    setRotation((p) => p + deltaX * 0.005);
    setTilt((p) => Math.max(0.1, Math.min(1.0, p - deltaY * 0.003)));

    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Handle zooming using wheels
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.4, Math.min(2.5, z - e.deltaY * 0.001)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (!canvas) return;
        const entry = entries[0];
        if (entry) {
          const entryWidth = entry.contentRect.width;
          width = canvas.width = entryWidth;
        }
      });
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Orbit System center sun aura
      const sunGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        35 * zoom
      );
      sunGrad.addColorStop(0, "rgba(253, 224, 71, 1)"); // Hot glowing yellow
      sunGrad.addColorStop(0.3, "rgba(234, 179, 8, 0.4)");
      sunGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Inner intense core of Sun
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 16 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Sort planet components based on virtual Z layers for high fidelity occlusion (z-depth sorting)
      const renderList = PLANETS.map((planet) => {
        // Compute position
        const currentAngle = angles.current[planet.id];

        // 3D coordinates based on planetary orbital rotation
        const relativeX = planet.orbitRadius * Math.cos(currentAngle);
        const relativeY = planet.orbitRadius * Math.sin(currentAngle) * tilt;

        // Apply visual tilt-rotation rotations
        const rotX = relativeX * Math.cos(rotation) - relativeY * Math.sin(rotation);
        const rotY = relativeX * Math.sin(rotation) + relativeY * Math.cos(rotation);

        // Project directly on workspace width heights
        const screenX = centerX + rotX * zoom;
        const screenY = centerY + rotY * zoom;

        // Perspective depth factors (closer planets look bigger!)
        const scaleFact = 1.0 + (rotY / 400);

        return {
          planet,
          screenX,
          screenY,
          depth: rotY, // Large depth means closer to front (since positive rotY tilts forward)
          visualRadius: Math.max(1.8, planet.radius * zoom * scaleFact),
        };
      });

      // Draw Ellipse orbits pathways (drawn underneath planets)
      if (showOrbits) {
        PLANETS.forEach((planet) => {
          ctx.strokeStyle = "rgba(129, 140, 248, 0.16)"; // faint indigo rings
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(
            centerX,
            centerY,
            planet.orbitRadius * zoom,
            planet.orbitRadius * tilt * zoom,
            rotation,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        });
      }

      // Sort planets by depth (farthest first, closest last)
      const sortedPlanets = [...renderList].sort((a, b) => a.depth - b.depth);

      sortedPlanets.forEach(({ planet, screenX, screenY, visualRadius }) => {
        // Radial gradients for gorgeous celestial sphericity shadows
        const planetGrad = ctx.createRadialGradient(
          screenX - visualRadius * 0.2,
          screenY - visualRadius * 0.2,
          0,
          screenX,
          screenY,
          visualRadius
        );
        planetGrad.addColorStop(0, "#ffffff");
        planetGrad.addColorStop(0.2, planet.color);
        planetGrad.addColorStop(1, "rgb(15,10,25)"); // Dark cosmos edge shadow

        // Apply glowing shadow ring for Saturn
        if (planet.id === "saturn") {
          ctx.strokeStyle = "rgba(217, 119, 6, 0.45)"; // Saturn's asteroid ring
          ctx.lineWidth = 4 * zoom;
          ctx.beginPath();
          ctx.ellipse(
            screenX,
            screenY,
            visualRadius * 1.9,
            visualRadius * 0.6,
            0.3,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }

        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(screenX, screenY, visualRadius, 0, Math.PI * 2);
        ctx.fill();

        // Planet text overlays on hovering
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(planet.name, screenX, screenY - visualRadius - 4);

        // Update angles slowly if playing
        if (isPlaying) {
          angles.current[planet.id] += planet.speed * speedMultiplier;
        }
      });

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, speedMultiplier, showOrbits, zoom, tilt, rotation]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Detect which planet is clicked
    let clicked: PlanetDef | null = null;
    let minDistance = 25; // Click radius sensitivity threshold

    PLANETS.forEach((planet) => {
      const currentAngle = angles.current[planet.id];
      const relativeX = planet.orbitRadius * Math.cos(currentAngle);
      const relativeY = planet.orbitRadius * Math.sin(currentAngle) * tilt;

      const rotX = relativeX * Math.cos(rotation) - relativeY * Math.sin(rotation);
      const rotY = relativeX * Math.sin(rotation) + relativeY * Math.cos(rotation);

      const screenX = centerX + rotX * zoom;
      const screenY = centerY + rotY * zoom;

      const distance = Math.hypot(clickX - screenX, clickY - screenY);
      if (distance < minDistance) {
        clicked = planet;
        minDistance = distance;
      }
    });

    if (clicked) {
      setSelectedPlanet(clicked);
    }
  };

  const resetCamera = () => {
    setZoom(1.0);
    setTilt(0.4);
    setRotation(0);
    setSpeedMultiplier(1.5);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col w-full h-full text-indigo-100 bg-slate-900/60 rounded-2xl border border-indigo-500/20 backdrop-blur-xl overflow-hidden shadow-2xl transition duration-500 hover:border-indigo-500/40"
    >
      {/* Simulation Header controls */}
      <div className="flex flex-wrap items-center justify-between p-4 space-y-2 sm:space-y-0 border-b border-indigo-500/10 bg-slate-950/30">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="font-semibold text-white tracking-wide">
            Orbits Mechanics Simulator (Interactive 3D)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
              isPlaying
                ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            {isPlaying ? "Pause Orbits" : "Resume Orbits"}
          </button>
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              showOrbits
                ? "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            Orbits: {showOrbits ? "On" : "Off"}
          </button>
          <button
            onClick={resetCamera}
            className="p-1 px-2.5 rounded-lg text-xs border border-slate-700 hover:border-slate-500 bg-slate-800 text-slate-300 transition"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative flex-grow">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
          className="block w-full cursor-grab active:cursor-grabbing"
          title="Drag to Rotate & Tilt System. Scroll to Zoom. Click any Planet."
        />

        {/* Floating guidance overlay */}
        <div className="absolute bottom-3 left-3 flex flex-col space-y-1 p-2.5 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-800 text-[10px] sm:text-xs text-indigo-300/80 pointer-events-none select-none">
          <div>🖱 Click & Drag to Orbit Camera</div>
          <div>📜 Mouse Scroll Wheel to Zoom System</div>
          <div>🪐 Click on any Planet Sphere for details</div>
        </div>

        {/* Speed Controls and Scales */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-500/10">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] uppercase font-bold text-slate-400">Warp Speed:</span>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-xs font-mono font-bold text-indigo-300">
            {speedMultiplier.toFixed(1)}x
          </span>
        </div>
      </div>

      {/* Glassmorphism Planet details popup */}
      {selectedPlanet && (
        <div className="p-4 border-t border-indigo-500/10 bg-slate-950/65 backdrop-blur-lg animate-fadeIn duration-300 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5">
              <span
                className="w-4 h-4 rounded-full border border-white/20 shadow-lg"
                style={{ backgroundColor: selectedPlanet.color }}
              />
              <h4 className="text-lg font-bold text-white tracking-wide">
                Celestial Identity: {selectedPlanet.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded border border-slate-800 hover:border-slate-600 bg-slate-900 transition"
            >
              Close Details
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/40 p-3 rounded-xl border border-indigo-500/5 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Physical Mass:</span>
              <span className="font-mono font-bold text-indigo-200">{selectedPlanet.mass}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Diameter Size:</span>
              <span className="font-mono font-bold text-indigo-200">{selectedPlanet.diameter}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Temperature:</span>
              <span className="font-mono font-bold text-indigo-200">{selectedPlanet.temperature}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Atmosphere Type:</span>
              <span className="font-mono font-bold text-indigo-200">{selectedPlanet.atmosphere}</span>
            </div>
          </div>
          <div className="mt-2.5 px-1">
            <p className="text-sm text-slate-300 italic">
              " {selectedPlanet.fact} "
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
