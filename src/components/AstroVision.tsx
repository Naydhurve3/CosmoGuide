import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, Heart, Download, RefreshCw, Zap } from "lucide-react";

export default function AstroVision() {
  const [prompt, setPrompt] = useState("");
  const [styleTag, setStyleTag] = useState("Nebula Glow");
  const [loading, setLoading] = useState(false);
  const [activeArt, setActiveArt] = useState<{
    prompt: string;
    imageUrl: string;
    title: string;
    metadata: string;
  } | null>(null);

  const [gallery, setGallery] = useState([
    {
      id: "gal-1",
      title: "Obsidian Void Singularity",
      prompt: "A supermassive rotating black hole swallowing a glowing neon blue spiral nebula starfield, event horizon bending light, 8k hyperrealistic",
      imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=60",
      likes: 420
    },
    {
      id: "gal-2",
      title: "Chrono-Stellar Nursery",
      prompt: "Infrared stellar nursery inside Orion constellation cloud of dust with planetary rings and infant stars, deep telescope capture",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
      likes: 312
    },
    {
      id: "gal-3",
      title: "Lagrange Quantum Gravity",
      prompt: "Three burning binary stars interacting through a beautiful radioactive solar wind filament, mathematical stellar canvas",
      imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60",
      likes: 219
    },
    {
      id: "gal-4",
      title: "Centaurus Magnetar Flare",
      prompt: "Super strong electromagnetic field bursting out of a magnetar core, relativistic jets rendering intense violet gamma rays, cosmos wallpaper",
      imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60",
      likes: 562
    }
  ]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      // Fetch custom or simulated generated image matching prompt
      const res = await fetch("/api/astro-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `${prompt} (${styleTag} style)` })
      });

      if (!res.ok) throw new Error("Stellar vision processor failed.");
      const data = await res.json();

      setActiveArt({
        prompt: prompt,
        imageUrl: data.imageUrl,
        title: data.title,
        metadata: data.technicalMetadata
      });

      // Insert into local gallery list!
      setGallery((prev) => [
        {
          id: `new-art-${Date.now()}`,
          title: data.title,
          prompt: prompt,
          imageUrl: data.imageUrl,
          likes: 1
        },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed generating Astro-Vision imagery coordinates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = (style: string) => {
    setStyleTag(style);
  };

  const incrementLikes = (id: string) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  return (
    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left shadow-2xl relative">
      <div className="flex items-center space-x-2.5 mb-2">
        <ImageIcon className="w-5 h-5 text-indigo-400" />
        <h4 className="font-bold text-white uppercase tracking-wider text-sm">
          Astro-Vision • AI Space Generator
        </h4>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
        Transpile astrophysics prompts and conceptual theories directly into immersive high-fidelity celestial wall art grids using neural image projection.
      </p>

      {/* Main Generator Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side Inputs Form */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                Neural Art Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A black hole eating a glowing radioactive rainbow nebula, hyperrealistic, volumetric cosmic dust, 8K wallpaper..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
              />
            </div>

            {/* Micro-style tags list */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                Stellar Aesthetics Style Matrix
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["Nebula Glow", "Infrared Deepspace", "Hyperspatial Warp", "James Webb 8K", "Retro Planetarium", "Saturating Flare"].map((sty) => (
                  <button
                    key={sty}
                    onClick={() => selectStyle(sty)}
                    className={`p-1.5 px-3 rounded-lg text-[10px] font-semibold transition ${
                      styleTag === sty
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-950/45 border border-slate-800 text-slate-450 hover:text-indigo-200 hover:border-indigo-500/30"
                    }`}
                  >
                    {sty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateImage}
            disabled={!prompt.trim() || loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 border border-indigo-400/20 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs tracking-wider transition uppercase flex items-center justify-center space-x-2 shadow-lg shadow-indigo-605/20 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Deep Quantum Render...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Compile Astro-Vision Wall Art</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side Visual Projection Canvas */}
        <div className="lg:col-span-6 flex flex-col justify-center bg-slate-950/60 p-3.5 rounded-2xl border border-indigo-500/10 min-h-[250px] relative overflow-hidden group">
          {activeArt ? (
            <div className="space-y-3">
              {/* Image Frame with Tilt simulated glowing cover */}
              <div className="relative rounded-xl overflow-hidden border border-indigo-500/20 shadow-2xl transition duration-500 transform hover:scale-101">
                <img
                  src={activeArt.imageUrl}
                  alt={activeArt.title}
                  className="w-full h-44 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-transparent to-transparent opacity-60" />
                <a
                  href={activeArt.imageUrl}
                  download={activeArt.title}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-indigo-600/90 text-white hover:bg-indigo-550 transition shadow-md flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold">1080P Wallpaper</span>
                </a>
              </div>

              {/* Informative overlay details */}
              <div className="text-left font-mono">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">{activeArt.title}</h5>
                <p className="text-[10px] text-indigo-300 mt-0.5 mt-1">Prompt: "{activeArt.prompt}"</p>
                <div className="flex items-center space-x-2 mt-2 pt-1.5 border-t border-slate-900 text-[9px] text-slate-500">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>{activeArt.metadata}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
              <div className="p-3 bg-indigo-500/5 rounded-full border border-indigo-500/20 text-indigo-400 animate-pulse">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-xs text-slate-300 block">Stellar Projection Standby</span>
                <span className="text-[10px] text-slate-500 max-w-[200px] mt-1 block">Input your concept prompt on the left to fire the neural plasma grid.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Showcase of the Day */}
      <div className="mt-8 pt-6 border-t border-indigo-500/10">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="w-4 h-4 text-rose-500" />
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Astral Masterpiece Gallery of the Day
          </h5>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="p-2.5 bg-slate-950/45 border border-slate-900 rounded-xl space-y-2 hover:border-indigo-500/20 transition-all duration-305 group cursor-pointer"
              onClick={() =>
                setActiveArt({
                  prompt: item.prompt,
                  imageUrl: item.imageUrl,
                  title: item.title,
                  metadata: "Dimensions: 1024x1024 | Platform: CosmoGen-v2"
                })
              }
            >
              <div className="relative rounded-lg overflow-hidden h-24">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute top-1.5 left-1.5 p-1 bg-slate-950/80 rounded-lg text-[9px] font-mono text-slate-400">
                  Showcase
                </div>
              </div>

              <div>
                <span className="font-bold text-[11px] text-white block truncate mb-0.5">{item.title}</span>
                <span className="text-[10px] text-slate-400 block truncate italic">"{item.prompt}"</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    incrementLikes(item.id);
                  }}
                  className="flex items-center space-x-1 hover:text-rose-455 transition text-rose-400 font-mono text-[10px]"
                >
                  <Heart className="w-3 h-3 fill-rose-505" />
                  <span>{item.likes}</span>
                </button>
                <span className="text-[9px] font-mono text-indigo-400 block">Deploy wallpaper</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
