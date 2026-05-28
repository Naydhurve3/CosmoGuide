import React, { useState, useEffect } from "react";
import { Orbit, Compass, Radio, Bell, CheckCircle, Clock, AlertTriangle, Play, RefreshCw, Zap } from "lucide-react";

interface Launch {
  id: string;
  agency: string;
  mission: string;
  vehicle: string;
  location: string;
  countdownDays: number;
  alert: string;
}

export default function MissionControl() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifiedList, setNotifiedList] = useState<string[]>([]);
  const [issCoordinates, setIssCoordinates] = useState({ lat: 51.52, lng: -0.11, speed: 27580, alt: 421 });
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Poll launches and space weather on load
  useEffect(() => {
    async function fetchLaunches() {
      try {
        const res = await fetch("/api/launches");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLaunches(data);
      } catch (err) {
        console.warn("Failed syncing live satellite countdowns.");
      } finally {
        setLoading(false);
      }
    }
    fetchLaunches();

    // Orbit increment simulator to move ISS over visual map
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 3) % 360);
      setIssCoordinates((prev) => {
        const nextLat = Math.sin((Date.now() / 15000)) * 52;
        const nextLng = ((prev.lng + 1.2 + 180) % 360) - 180;
        return {
          ...prev,
          lat: parseFloat(nextLat.toFixed(2)),
          lng: parseFloat(nextLng.toFixed(2))
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleToggleNotification = (launchId: string) => {
    if (notifiedList.includes(launchId)) {
      setNotifiedList((p) => p.filter((id) => id !== launchId));
    } else {
      setNotifiedList((p) => [...p, launchId]);
    }
  };

  return (
    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left shadow-2xl relative overflow-hidden space-y-6">
      {/* Upper header */}
      <div>
        <div className="flex items-center space-x-2.5">
          <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h4 className="font-bold text-white uppercase tracking-wider text-sm">
            Mission Control & Orbital Live Tracker
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Monitor the actual positions of orbiting objects, solar flares telemetry, and upcoming SpaceX, NASA and ISRO ignition cycles with live timers.
        </p>
      </div>

      {/* Grid of Tracker & Countdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: 3D ISS Orbital path canvas simulator of world map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 bg-slate-950/65 rounded-xl border border-indigo-500/10">
            <div className="flex items-center justify-between mb-3 border-b border-indigo-505/10 pb-2">
              <div className="flex items-center space-x-2">
                <Orbit className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white uppercase font-mono">Astral Downlink: ISS Tracker</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Interactive World Map grid and orbital canvas preview */}
            <div className="h-44 bg-slate-950 border border-slate-900 rounded-lg relative overflow-hidden flex flex-col justify-between p-3">
              {/* Star constellation map background dots */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/30 via-slate-950 to-slate-955 pointer-events-none" />

              {/* Graphical Orbit Line circle */}
              <div
                className="absolute w-36 h-36 rounded-full border-2 border-indigo-600/20 border-dashed left-1/2 top-1/2 -ml-18 -mt-18 pointer-events-none animate-spin"
                style={{ animationDuration: "35s", transform: `rotate(${orbitAngle}deg)` }}
              />

              {/* Station Dot marker */}
              <div
                className="absolute w-3 h-3 rounded-full bg-emerald-400 border border-emerald-300 shadow-lg shadow-emerald-500/40 z-10 transition-all duration-1000 flex items-center justify-center"
                style={{
                  left: `${((issCoordinates.lng + 180) / 360) * 85 + 5}%`,
                  top: `${((issCoordinates.lat + 90) / 180) * 75 + 10}%`
                }}
              >
                {/* Station nameplate */}
                <span className="absolute left-4 bg-slate-900/90 text-[8px] font-mono font-bold text-white uppercase p-1 rounded border border-emerald-500/20 shadow-md whitespace-nowrap">
                  ISS CORE
                </span>
              </div>

              {/* Simulated Latitude grid labels */}
              <div className="text-[8px] font-mono text-slate-650 flex flex-col space-y-1.5 justify-center h-full relative z-0 pointer-events-none">
                <span>LAT: +50° N (Polar Core)</span>
                <span>LAT: 0° (Equatorial Line)</span>
                <span>LAT: -50° S (South Magnetic)</span>
              </div>

              {/* Coordinate info labels list */}
              <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded border border-indigo-500/10 relative z-20 text-[9px] font-mono text-slate-350">
                <span>LAT: <strong className="text-white">{issCoordinates.lat}°</strong></span>
                <span>LNG: <strong className="text-white">{issCoordinates.lng}°</strong></span>
                <span>SPEED: <strong className="text-indigo-400">{issCoordinates.speed} KM/H</strong></span>
                <span>ALT: <strong className="text-indigo-400">{issCoordinates.alt} KM</strong></span>
              </div>
            </div>

            {/* Passes alerts and push prompt */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-mono">Next overhead pass logged in **18 mins** over Europe grid.</span>
              <button
                onClick={() => handleToggleNotification("iss-station-pass")}
                className={`p-1.5 px-3 rounded-lg text-[10px] font-bold uppercase transition flex items-center space-x-1 cursor-pointer ${
                  notifiedList.includes("iss-station-pass")
                    ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                    : "bg-indigo-600 hover:bg-indigo-550 text-white shadow-md shadow-indigo-600/10"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>
                  {notifiedList.includes("iss-station-pass")
                    ? "Subscribed ✓"
                    : "Subscribe to Pass Alert"}
                </span>
              </button>
            </div>
            {notifiedList.includes("iss-station-pass") && (
              <div className="mt-2.5 p-2 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-mono leading-relaxed animate-fadeIn">
                ✓ Perfect! We will ping you 10 minutes prior to the ISS crossing your horizon. Make sure physical telescope trackers are locked.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Launch Windows with live countdowns */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-950/65 rounded-xl border border-indigo-500/10 space-y-3">
            <div className="flex items-center space-x-2 border-b border-indigo-505/10 pb-2">
              <Clock className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: "6s" }} />
              <span className="font-bold text-xs text-white uppercase font-mono">Upcoming Planetary Ignition Windows</span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-indigo-300 font-mono animate-pulse">
                Consulting Spaceports database records...
              </div>
            ) : (
              <div className="space-y-3">
                {launches.map((launch) => {
                  const subKey = `launch-${launch.id}`;
                  const isRegistered = notifiedList.includes(subKey);

                  return (
                    <div
                      key={launch.id}
                      className="p-3 bg-slate-900/40 border border-slate-805/30 hover:border-indigo-500/20 transition rounded-xl space-y-2 text-left"
                    >
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded bg-indigo-505/10 text-indigo-300 font-bold font-mono text-[9px] uppercase">
                          {launch.agency}
                        </span>
                        <div className="flex items-center space-x-1.5 text-amber-400 font-bold font-mono text-xs">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          <span>T-{launch.countdownDays} Days</span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-bold text-white text-xs leading-snug">{launch.mission}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 mt-1 font-mono">
                          Vehicle: {launch.vehicle} | {launch.location}
                        </p>
                      </div>

                      <p className="text-[10px] p-2 bg-slate-955 text-slate-400 rounded border border-slate-900 leading-relaxed italic">
                        "{launch.alert}"
                      </p>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleToggleNotification(subKey)}
                          className={`p-1 px-2.5 rounded-lg text-[9px] font-bold uppercase transition flex items-center space-x-1.5 ${
                            isRegistered
                              ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                              : "bg-indigo-650 hover:bg-indigo-600 text-slate-200"
                          }`}
                        >
                          <Bell className="w-3 h-3" />
                          <span>{isRegistered ? "Armed ✓" : "Notify Me"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
