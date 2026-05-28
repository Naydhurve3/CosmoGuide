import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sliders, Activity, Sparkles, RefreshCw, Star } from "lucide-react";

export default function SoundscapeGenerator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [density, setDensity] = useState(55);
  const [gravity, setGravity] = useState(30);
  const [temperature, setTemperature] = useState(70);
  const [preset, setPreset] = useState("Viber of Jupiter");

  const [oscillators, setOscillators] = useState<number[]>([12, 24, 18, 32, 10, 42, 12, 28, 16, 22]);

  // Audio nodes references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  // Animate the visualizer bars in active playback
  useEffect(() => {
    let frameId: number;
    if (isPlaying) {
      const animateBars = () => {
        setOscillators((prev) =>
          prev.map(() => Math.floor(Math.random() * 45) + 5)
        );
        frameId = requestAnimationFrame(animateBars);
      };
      frameId = requestAnimationFrame(animateBars);
    } else {
      setOscillators([12, 24, 18, 32, 10, 42, 12, 28, 16, 22]);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  // Update oscillators on slider change to dynamically shift sound pitches
  useEffect(() => {
    if (isPlaying && oscRef.current && osc2Ref.current && gainRef.current) {
      // Calculate active base frequency from temperature and gravity
      const baseFreq = 80 + (temperature * 1.5) + (gravity * 0.8);
      oscRef.current.frequency.setValueAtTime(baseFreq, audioCtxRef.current!.currentTime);
      osc2Ref.current.frequency.setValueAtTime(baseFreq * 1.5, audioCtxRef.current!.currentTime);

      // Adjust gain based on Density slider
      const targetGain = (density / 100) * 0.15;
      gainRef.current.gain.setValueAtTime(targetGain, audioCtxRef.current!.currentTime);
    }
  }, [density, gravity, temperature, isPlaying]);

  const handleToggleSoundscape = () => {
    if (isPlaying) {
      // Turn off nodes
      try {
        if (oscRef.current) oscRef.current.stop();
        if (osc2Ref.current) osc2Ref.current.stop();
      } catch (err) {}
      setIsPlaying(false);
    } else {
      // Start Web Audio API Context
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtxClass();
        audioCtxRef.current = ctx;

        // Gain controller
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime((density / 100) * 0.1, ctx.currentTime);
        gainRef.current = gainNode;

        const baseFreq = 80 + (temperature * 1.5) + (gravity * 0.8);

        // Core low bass oscillator
        const oscNode1 = ctx.createOscillator();
        oscNode1.type = "sine";
        oscNode1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        oscNode1.connect(gainNode);
        oscRef.current = oscNode1;

        // Outer space high harmony carrier
        const oscNode2 = ctx.createOscillator();
        oscNode2.type = "triangle";
        oscNode2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);
        oscNode2.connect(gainNode);
        osc2Ref.current = oscNode2;

        gainNode.connect(ctx.destination);

        oscNode1.start();
        oscNode2.start();
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio API offline or restricted in frame.", err);
        // Fallback visual simulated play
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Safe cleanup
      try {
        if (oscRef.current) oscRef.current.stop();
        if (osc2Ref.current) osc2Ref.current.stop();
      } catch (err) {}
    };
  }, []);

  const selectPreset = (pre: string) => {
    setPreset(pre);
    if (pre === "Viber of Jupiter") {
      setDensity(45);
      setGravity(85);
      setTemperature(20);
    } else if (pre === "Black Hole Halo") {
      setDensity(90);
      setGravity(95);
      setTemperature(90);
    } else {
      // Nebula Breeze
      setDensity(30);
      setGravity(10);
      setTemperature(40);
    }
  };

  return (
    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left shadow-2xl relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2.5">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h4 className="font-bold text-white uppercase tracking-wider text-sm">
            Ambient Space Soundscape Synth
          </h4>
        </div>
        <span className="p-1 px-2.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px] font-mono font-bold uppercase tracking-wide">
          Web Audio Synth
        </span>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
        Adjust density friction coefficients, surface core temperatures, and planetary gravitational constants to synthesize custom high-resonance stellar hums inside your browser.
      </p>

      {/* Control Sliders Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          {/* Presets Toggle buttons */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-indigo-500/10 text-[10px]">
            {["Viber of Jupiter", "Black Hole Halo", "Nebula Breeze"].map((preOpt) => (
              <button
                key={preOpt}
                onClick={() => selectPreset(preOpt)}
                className={`flex-grow p-1.5 px-2.5 rounded-lg font-bold transition text-center ${
                  preset === preOpt
                    ? "bg-indigo-650 text-white font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {preOpt}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {/* Density */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                <span>Core Density Factor</span>
                <span className="font-mono text-indigo-300">{density}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={density}
                onChange={(e) => setDensity(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Gravity */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                <span>Gravitational field constant (g)</span>
                <span className="font-mono text-indigo-300">{gravity} m/s²</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gravity}
                onChange={(e) => setGravity(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Temperature */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                <span>Equivalent Temperature range</span>
                <span className="font-mono text-indigo-300">{temperature * 12}K</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Oscillating visualizer box */}
        <div className="bg-slate-955/70 p-4.5 rounded-2xl border border-indigo-500/10 flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <span className="font-mono text-[9px] text-slate-500 uppercase">Active Harmonic Oscillations</span>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[9px]">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-slate-650"}`} />
              <span>{isPlaying ? "ACTIVE SIGNAL" : "MUTED"}</span>
            </div>
          </div>

          {/* Graphical waveform bars */}
          <div className="h-16 flex items-end justify-center space-x-1.5 z-10">
            {oscillators.map((val, idx) => (
              <div
                key={idx}
                className="w-2 rounded-t bg-indigo-500/80 transition-all duration-150"
                style={{ height: `${val}%`, backgroundColor: isPlaying ? `rgba(99, 102, 241, ${val / 50 + 0.2})` : "rgba(71, 85, 105, 0.4)" }}
              />
            ))}
          </div>

          <button
            onClick={handleToggleSoundscape}
            className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase transition tracking-wider flex items-center justify-center space-x-2 z-10 cursor-pointer ${
              isPlaying
                ? "bg-rose-600 hover:bg-rose-550 text-white"
                : "bg-indigo-600 hover:bg-indigo-550 text-white shadow-lg shadow-indigo-650/15"
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Mute Synthesizer</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Trigger Space Hum synth</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
