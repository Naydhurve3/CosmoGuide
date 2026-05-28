import React, { useState, useEffect, useRef } from "react";
import { Compass, MapPin, RefreshCw, Star } from "lucide-react";

interface SeedStar {
  name: string;
  constellation: string;
  ra: number; // Right Ascension (0 to 24 hours)
  dec: number; // Declination (-90 to +90 degrees)
  magnitude: number; // Brighter stars have lower values
  color: string;
}

// 12 key bright stars for beautiful star charting
const DEEP_SPACE_STARS: SeedStar[] = [
  { name: "Polaris", constellation: "Ursa Minor", ra: 2.5, dec: 89.2, magnitude: 1.9, color: "#ffffff" },
  { name: "Sirius", constellation: "Canis Major", ra: 6.7, dec: -16.7, magnitude: -1.4, color: "#9baeef" },
  { name: "Betelgeuse", constellation: "Orion", ra: 5.9, dec: 7.4, magnitude: 0.5, color: "#fca5a5" },
  { name: "Rigel", constellation: "Orion", ra: 5.2, dec: -8.2, magnitude: 0.1, color: "#93c5fd" },
  { name: "Vega", constellation: "Lyra", ra: 18.6, dec: 38.8, magnitude: 0.0, color: "#ffffff" },
  { name: "Altair", constellation: "Aquila", ra: 19.8, dec: 8.9, magnitude: 0.8, color: "#bae6fd" },
  { name: "Deneb", constellation: "Cygnus", ra: 20.7, dec: 45.3, magnitude: 1.2, color: "#e0f2fe" },
  { name: "Capella", constellation: "Auriga", ra: 5.3, dec: 46.0, magnitude: 0.1, color: "#fef08a" },
  { name: "Arcturus", constellation: "Boötes", ra: 14.3, dec: 19.2, magnitude: -0.1, color: "#fed7aa" },
  { name: "Aldebaran", constellation: "Taurus", ra: 4.6, dec: 16.5, magnitude: 0.8, color: "#fdba74" },
  { name: "Antares", constellation: "Scorpius", ra: 16.5, dec: -26.4, magnitude: 1.0, color: "#fca5a5" },
  { name: "Spica", constellation: "Virgo", ra: 13.4, dec: -11.2, magnitude: 1.0, color: "#bae6fd" }
];

// Major constellation drawing links (between index numbers above)
const CONSTELLATIONS = [
  { name: "Summer Triangle", links: ["Vega", "Altair", "Deneb"] },
  { name: "Orion's Light", links: ["Betelgeuse", "Rigel"] },
  { name: "S Winter Arc", links: ["Sirius", "Capella", "Aldebaran"] }
];

export default function StarChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // User spatial location overrides
  const [lat, setLat] = useState(21.1); // Default latitude (Nagpur, India area matching user documentation)
  const [lng, setLng] = useState(79.1); // Default longitude
  const [hourAngleOffset, setHourAngleOffset] = useState(0); // Rotates sky slowly
  const [hoveredStar, setHoveredStar] = useState<SeedStar | null>(null);

  const calculateStarPosition = (
    star: SeedStar,
    latitude: number,
    longitude: number,
    timeOffset: number,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    // Simplified celestial mapping equations:
    // Right Ascension (RA) converts to local hour angle (LHA) based on longitude and hourly rotations
    const localSiderialTime = (longitude / 15 + timeOffset) % 24;
    const hourAngle = ((localSiderialTime - star.ra) * 15 * Math.PI) / 180;

    const latRad = (latitude * Math.PI) / 180;
    const decRad = (star.dec * Math.PI) / 180;

    // Altitude: Sin(Alt) = Sin(Dec)*Sin(Lat) + Cos(Dec)*Cos(Lat)*Cos(HA)
    const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(hourAngle);
    const altitude = Math.asin(sinAlt); // Radian angle above horizon (-PI/2 to +PI/2)

    // Azimuth: Cos(Az) = (Sin(Dec) - Sin(Alt)*Sin(Lat)) / (Cos(Alt)*Cos(Lat))
    const cosAlt = Math.cos(altitude);
    const cosAz = (Math.sin(decRad) - sinAlt * Math.sin(latRad)) / (cosAlt * Math.cos(latRad));
    let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz)));

    if (Math.sin(hourAngle) > 0) {
      azimuth = Math.PI * 2 - azimuth;
    }

    // Project coordinates onto a 2D polar projection map
    // Zenith (directly overhead, altitude = PI/2) is mapped to the exact polar center
    // Horizon (altitude = 0) is mapped to the outer ring. Stars below the horizon (altitude < 0) are hidden
    const isVisible = altitude >= -0.05; // allow slightly below-horizon stars for transition aesthetic

    // Distance from center correlates with Zenith angle (PI/2 - altitude)
    const polarDistance = (1.0 - altitude / (Math.PI / 2)) * radius;

    const x = centerX + polarDistance * Math.sin(azimuth);
    const y = centerY - polarDistance * Math.cos(azimuth);

    return { x, y, isVisible, altitudeDeg: (altitude * 180) / Math.PI, azimuthDeg: (azimuth * 180) / Math.PI };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let size = Math.min(canvas.parentElement?.clientWidth || 360, 400);
    const canvasSize = size;
    canvas.width = canvas.height = canvasSize;

    const drawSky = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const plotRadius = (canvasSize / 2) * 0.85;

      // 1. Draw Stargazing sky circle container (glass sphere outline)
      ctx.fillStyle = "rgba(10, 10, 25, 0.75)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, plotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Soft circular gradient grid lines
      ctx.strokeStyle = "rgba(129, 140, 248, 0.16)";
      ctx.lineWidth = 1;

      // Draw concentric rings for altitude elevation coordinates (30°, 60° elevation)
      ctx.beginPath();
      ctx.arc(centerX, centerY, plotRadius * 0.33, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, plotRadius * 0.66, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, plotRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw cardinal crossing axes (N-S, W-E directions)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - plotRadius);
      ctx.lineTo(centerX, centerY + plotRadius);
      ctx.moveTo(centerX - plotRadius, centerY);
      ctx.lineTo(centerX + plotRadius, centerY);
      ctx.stroke();

      // Outer cardinal text tags
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 11px JetBrains Mono, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("N", centerX, centerY - plotRadius - 10);
      ctx.fillText("S", centerX, centerY + plotRadius + 10);
      ctx.fillText("E", centerX + plotRadius + 12, centerY);
      ctx.fillText("W", centerX - plotRadius - 12, centerY);

      // 2. Pre-calculate star coordinate projections
      const starPositions: Record<string, { x: number; y: number; isVisible: boolean }> = {};
      DEEP_SPACE_STARS.forEach((star) => {
        const { x, y, isVisible } = calculateStarPosition(
          star,
          lat,
          lng,
          hourAngleOffset,
          centerX,
          centerY,
          plotRadius
        );
        starPositions[star.name] = { x, y, isVisible };
      });

      // 3. Connect constellation joints with glowing line strokes
      ctx.strokeStyle = "rgba(99, 102, 241, 0.28)"; // vibrant neon purple link lines
      ctx.lineWidth = 1.0;
      CONSTELLATIONS.forEach((constellation) => {
        ctx.beginPath();
        let activePoint = false;
        constellation.links.forEach((starName, idx) => {
          const pt = starPositions[starName];
          if (pt && pt.isVisible) {
            if (!activePoint) {
              ctx.moveTo(pt.x, pt.y);
              activePoint = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        });
        ctx.stroke();
      });

      // 4. Draw stellar cores with relative brightness magnitude radii
      DEEP_SPACE_STARS.forEach((star) => {
        const pt = starPositions[star.name];
        if (!pt || !pt.isVisible) return;

        // Size correlates inverse to magnitude scale: Brighter star = lower magnitude
        const dotSize = Math.max(1.8, (4 - star.magnitude) * 1.5);

        // draw localized stellar coronas
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, dotSize, 0, Math.PI * 2);
        ctx.fill();

        // draw stellar text tags
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.font = "9px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(` ${star.name}`, pt.x + dotSize + 1, pt.y);
      });
    };

    drawSky();

    // Small automated siderial drifts over time to keep scene dynamically turning
    const interval = setInterval(() => {
      setHourAngleOffset((h) => (h + 0.005) % 24);
    }, 100);

    return () => clearInterval(interval);
  }, [lat, lng, hourAngleOffset]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const plotRadius = (canvas.width / 2) * 0.85;

    let nearest: SeedStar | null = null;
    let minDist = 14;

    DEEP_SPACE_STARS.forEach((star) => {
      const { x, y, isVisible } = calculateStarPosition(
        star,
        lat,
        lng,
        hourAngleOffset,
        centerX,
        centerY,
        plotRadius
      );
      if (isVisible) {
        const dist = Math.hypot(cursorX - x, cursorY - y);
        if (dist < minDist) {
          nearest = star;
          minDist = dist;
        }
      }
    });

    setHoveredStar(nearest);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md">
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          className="rounded-full bg-slate-950/20 shadow-inner border border-indigo-500/10 hover:border-indigo-500/30 cursor-crosshair transition duration-500"
          title="Hover over major stars to view cosmic indexes"
        />
        {hoveredStar && (
          <div className="mt-3 p-2 bg-indigo-950/80 border border-indigo-500/30 rounded-xl max-w-[280px] text-xs text-indigo-200">
            <div className="flex items-center space-x-1 font-bold text-white mb-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{hoveredStar.name}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Constellation: {hoveredStar.constellation}
            </div>
            <div className="grid grid-cols-2 gap-x-2 mt-1 font-mono text-[10px]">
              <div>RA Index: {hoveredStar.ra}h</div>
              <div>Declination: {hoveredStar.dec}°</div>
              <div className="col-span-2 text-indigo-300">Mag: {hoveredStar.magnitude}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 text-left w-full">
        <div className="flex items-center space-x-2 mb-3">
          <Compass className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }} />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Realtime starry star charts
          </h4>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Computes local constellational trajectories. Zenith represents your absolute overhead crown, and the peripheral boundaries map your local physical horizons. Modifying coordinates below will instantly recalculate orbital projections.
        </p>

        <div className="space-y-3 p-3 rounded-xl bg-slate-950/30 border border-indigo-500/5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Latitude Coordinates
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="-90"
                  max="90"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 px-3 pl-8 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Longitude Coordinates
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="-180"
                  max="180"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 px-3 pl-8 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setLat(21.1);
              setLng(79.1);
              setHourAngleOffset(0);
            }}
            className="flex items-center justify-center w-full py-1.5 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 test hover:border-indigo-500/40 text-xs font-semibold tracking-wide transition duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Recalculate Zenith Center
          </button>
        </div>
      </div>
    </div>
  );
}
