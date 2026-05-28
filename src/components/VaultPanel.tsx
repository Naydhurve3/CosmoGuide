import React, { useState, useEffect, useRef } from "react";
import { Key, Shield, User, LogIn, LogOut, CheckCircle2, AlertTriangle, Cpu, RefreshCw, Star, Upload, MapPin, Mail, X, Plus, Eye, Check } from "lucide-react";

export interface ProviderConfig {
  key: string;
  model: string;
  isUnlocked: boolean;
  status: "idle" | "testing" | "active" | "error";
  testLogs?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  avatar: string;
}

export default function VaultPanel() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile Form States
  const [typedName, setTypedName] = useState("");
  const [typedEmail, setTypedEmail] = useState("");
  const [typedAddress, setTypedAddress] = useState("");
  const [typedAvatar, setTypedAvatar] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // API configuration popup states
  const [showApiKeysPopup, setShowApiKeysPopup] = useState(false);
  const [activeProviderKey, setActiveProviderKey] = useState<string>("google");
  const [activeProvider, setActiveProvider] = useState<string>("google");

  const [providers, setProviders] = useState<Record<string, ProviderConfig>>({
    google: { key: "", model: "gemini-3.5-flash", isUnlocked: false, status: "idle" },
    groq: { key: "", model: "llama-3.3-70b-versatile", isUnlocked: false, status: "idle" },
    openrouter: { key: "", model: "google/gemini-2.1-pro-preview:free", isUnlocked: false, status: "idle" },
    anthropic: { key: "", model: "claude-3-5-sonnet-20241022", isUnlocked: false, status: "idle" },
    nvidia: { key: "", model: "meta/llama-3.1-405b-instruct", isUnlocked: false, status: "idle" },
    together: { key: "", model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", isUnlocked: false, status: "idle" },
    deepseek: { key: "", model: "deepseek-chat", isUnlocked: false, status: "idle" },
    mistral: { key: "", model: "open-mistral-7b", isUnlocked: false, status: "idle" },
    cohere: { key: "", model: "command-r-plus", isUnlocked: false, status: "idle" },
    perplexity: { key: "", model: "sonar-reasoning", isUnlocked: false, status: "idle" },
    huggingface: { key: "", model: "meta-llama/Llama-3.1-8B-Instruct", isUnlocked: false, status: "idle" }
  });

  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [fetchedModels, setFetchedModels] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Batch Model Scanning States
  const [scanResults, setScanResults] = useState<any[] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // Default preset avatars
  const AVATAR_PRESETS = [
    {
      name: "Astronaut Cadet",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    {
      name: "Solar Physicist",
      url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
    },
    {
      name: "Nebula AI Pilot",
      url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
    }
  ];

  const loadModelsForProvider = async (prov: string, apiKey: string) => {
    setIsLoadingModels(true);
    try {
      const url = `/api/models?provider=${prov}&apiKey=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.models)) {
          setFetchedModels(data.models);
          const currentModel = providers[prov]?.model;
          const found = data.models.find((m: any) => m.id === currentModel);
          if (!found && data.models.length > 0) {
            handleModelChange(prov, data.models[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Error loading models:", err);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Load profile & key vault configurations from persistent storage upon startup
  useEffect(() => {
    const savedProfile = localStorage.getItem("cosmo_user_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
        setTypedName(parsed.name || "");
        setTypedEmail(parsed.email || "");
        setTypedAddress(parsed.address || "");
        setTypedAvatar(parsed.avatar || "");
      } catch (err) {
        console.warn("Error parsing profile");
      }
    } else {
      // Default initial profile
      const fallbackProfile: UserProfile = {
        name: "Stargazer Done",
        email: "wprojectdone@gmail.com",
        address: "Earth Base Gamma Sector 12, Geneva Space Base",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      };
      setUserProfile(fallbackProfile);
      setTypedName(fallbackProfile.name);
      setTypedEmail(fallbackProfile.email);
      setTypedAddress(fallbackProfile.address);
      setTypedAvatar(fallbackProfile.avatar);
    }

    const savedKeys = localStorage.getItem("cosmo_key_vault");
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        const filled = {
          google: { key: "", model: "gemini-3.5-flash", isUnlocked: false, status: "idle" },
          groq: { key: "", model: "llama-3.3-70b-versatile", isUnlocked: false, status: "idle" },
          openrouter: { key: "", model: "google/gemini-2.1-pro-preview:free", isUnlocked: false, status: "idle" },
          anthropic: { key: "", model: "claude-3-5-sonnet-20241022", isUnlocked: false, status: "idle" },
          nvidia: { key: "", model: "meta/llama-3.1-405b-instruct", isUnlocked: false, status: "idle" },
          together: { key: "", model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", isUnlocked: false, status: "idle" },
          deepseek: { key: "", model: "deepseek-chat", isUnlocked: false, status: "idle" },
          mistral: { key: "", model: "open-mistral-7b", isUnlocked: false, status: "idle" },
          cohere: { key: "", model: "command-r-plus", isUnlocked: false, status: "idle" },
          perplexity: { key: "", model: "sonar-reasoning", isUnlocked: false, status: "idle" },
          huggingface: { key: "", model: "meta-llama/Llama-3.1-8B-Instruct", isUnlocked: false, status: "idle" }
        };
        Object.keys(filled).forEach((pk) => {
          if (parsedKeys[pk]) {
            (filled as any)[pk] = parsedKeys[pk];
          }
        });
        setProviders(filled);
      } catch (err) {
        console.warn("Vault recovery diagnostics completed.", err);
      }
    }

    const savedActive = localStorage.getItem("cosmo_active_provider");
    if (savedActive) {
      setActiveProvider(savedActive);
    }
  }, []);

  // Sync models list on active key change or field changes
  useEffect(() => {
    const activeKeyVal = providers[activeProviderKey]?.key || "";
    loadModelsForProvider(activeProviderKey, activeKeyVal);
  }, [activeProviderKey, providers[activeProviderKey]?.key]);

  const saveVault = (updated: any) => {
    setProviders(updated);
    localStorage.setItem("cosmo_key_vault", JSON.stringify(updated));
  };

  const handleSetActiveProvider = (prov: string) => {
    setActiveProvider(prov);
    localStorage.setItem("cosmo_active_provider", prov);
    window.dispatchEvent(new Event("storage"));
  };

  // Profile preservation logic
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedName || !typedEmail) return;

    const updatedProfile: UserProfile = {
      name: typedName,
      email: typedEmail,
      address: typedAddress || "Undisclosed Interstellar Quarters",
      avatar: typedAvatar || AVATAR_PRESETS[0].url
    };

    setUserProfile(updatedProfile);
    localStorage.setItem("cosmo_user_profile", JSON.stringify(updatedProfile));
    setIsEditingProfile(false);

    // Sync state changes back to App.tsx immediately via storage coordinate event
    window.dispatchEvent(new Event("storage"));
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem("cosmo_user_profile");
    setTypedName("");
    setTypedEmail("");
    setTypedAddress("");
    setTypedAvatar("");
    window.dispatchEvent(new Event("storage"));
  };

  // Convert uploaded image file to high precision base64 offline string
  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setTypedAvatar(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const selectLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleKeyChange = (prov: string, keyVal: string) => {
    const fresh = { ...providers };
    if (!fresh[prov]) {
      fresh[prov] = { key: "", model: "", isUnlocked: false, status: "idle" };
    }
    fresh[prov].key = keyVal;
    if (keyVal) {
      fresh[prov].isUnlocked = true;
    } else {
      fresh[prov].isUnlocked = false;
      fresh[prov].status = "idle";
    }
    saveVault(fresh);
  };

  const handleModelChange = (prov: string, modelVal: string) => {
    const fresh = { ...providers };
    if (!fresh[prov]) {
      fresh[prov] = { key: "", model: "", isUnlocked: false, status: "idle" };
    }
    fresh[prov].model = modelVal;
    saveVault(fresh);
  };

  const testProviderConnectivity = async (prov: string) => {
    const target = providers[prov];
    if (!target || !target.key) return;

    setTestingProvider(prov);
    const freshStart = { ...providers };
    freshStart[prov].status = "testing";
    saveVault(freshStart);

    try {
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: prov,
          apiKey: target.key,
          model: target.model
        })
      });

      const data = await res.json();
      const freshEnd = { ...providers };

      if (res.ok && data.success) {
        freshEnd[prov].status = "active";
        freshEnd[prov].testLogs = data.message || "Satellite link synchronized perfectly.";
      } else {
        freshEnd[prov].status = "error";
        freshEnd[prov].testLogs = data.error || "Connection handshake failed.";
      }
      saveVault(freshEnd);
    } catch (err: any) {
      const freshEnd = { ...providers };
      freshEnd[prov].status = "error";
      freshEnd[prov].testLogs = err.message || "Network timeout connecting to satellite server.";
      saveVault(freshEnd);
    } finally {
      setTestingProvider(null);
    }
  };

  const scanModelsForProvider = async (prov: string) => {
    const target = providers[prov];
    if (!target || !target.key) return;

    setIsScanning(true);
    setScanResults(null);
    setScanError(null);

    try {
      const res = await fetch("/api/test-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: prov,
          apiKey: target.key
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error returned status ${res.status}`);
      }

      const data = await res.json();
      setScanResults(data.models || []);
    } catch (err: any) {
      console.error("Batch scanning failed:", err);
      setScanError(err.message || "Failed running batch test scan.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900/40 border border-indigo-500/15 backdrop-blur-md rounded-2xl text-left shadow-2xl relative overflow-hidden">
      {/* Decorative background logo */}
      <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-400 pointer-events-none">
        <Shield className="w-48 h-48" />
      </div>

      <div className="border-b border-indigo-500/10 pb-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <User className="w-5 h-5 text-indigo-400" />
          <h4 className="font-bold text-white uppercase tracking-wider text-sm">
            Observatory Station Profile & Key Hub
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Rearrange coordinates, construct digital Space Passport files, and declare key variables safely in the local system.
        </p>
      </div>

      {/* CORE PROFILE INTERFACE - STYLISH AND FLEXIBLE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE PROFILE STATUS / PASSPORT CARD VIEW */}
        <div className="md:col-span-5 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
            Station ID Passport Scan
          </span>

          {userProfile && !isEditingProfile ? (
            <div className="relative bg-gradient-to-b from-indigo-950/40 to-slate-950/85 border border-indigo-500/25 rounded-2xl p-5 shadow-inner overflow-hidden flex flex-col space-y-4 animate-scaleUp">
              {/* Grid scanning lines layout decoration */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-indigo-500/30 animate-pulse" />
              <div className="absolute inset-y-0 right-0 w-[1px] bg-indigo-500/10" />

              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-16 h-16 rounded-xl border border-indigo-450/45 object-cover shadow-lg shadow-indigo-500/10"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = AVATAR_PRESETS[0].url;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 border border-slate-900 rounded-full p-0.5" title="Transmitting clearance">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>

                <div>
                  <h5 className="font-mono text-white font-extrabold text-sm sm:text-base tracking-wide uppercase truncate max-w-[170px]">{userProfile.name}</h5>
                  <span className="text-[9px] font-mono tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                    COSMIC COMMANDER Class
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-indigo-505/10 pt-3 text-[11px] font-mono text-slate-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate" title={userProfile.email}>
                    {userProfile.email}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug text-slate-300">
                    {userProfile.address}
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setTypedName(userProfile.name);
                    setTypedEmail(userProfile.email);
                    setTypedAddress(userProfile.address);
                    setTypedAvatar(userProfile.avatar);
                    setIsEditingProfile(true);
                  }}
                  className="flex-grow py-2 bg-indigo-650/20 hover:bg-indigo-650 border border-indigo-505/20 text-indigo-300 hover:text-white rounded-lg text-[10px] font-bold uppercase transition block"
                >
                  Configure Identity
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 text-rose-400 hover:text-rose-350 rounded-lg text-[10px] uppercase transition font-bold"
                  title="Purge ID Offline"
                >
                  Purge ID
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-450 space-y-2 animate-pulse">
              <User className="w-9 h-9 text-slate-600 mx-auto" />
              <div className="text-xs font-semibold text-slate-400">No Observatory Space ID</div>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                No local station identifier files detected. Complete coordinates registration block on the right list to issue one.
              </p>
              {isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="mt-2 text-[10px] px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded hover:text-white transition"
                >
                  Discard Changes
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILED PROFILE CONSOLE ENVELOPE (FORM / EDITING ACTIVE) */}
        <div className="md:col-span-7 bg-slate-950/25 border border-indigo-500/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest block">
              Observatory Credentials Form
            </span>
            {userProfile && !isEditingProfile && (
              <span className="text-[9px] font-mono text-emerald-400 flex items-center space-x-1 font-semibold block">
                <Check className="w-3 h-3" />
                <span>Synchronized Offline</span>
              </span>
            )}
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Commander Name Override
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="e.g. Commander Sarah Done"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 pl-9 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500/50 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Stargazer Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={typedEmail}
                    onChange={(e) => setTypedEmail(e.target.value)}
                    placeholder="e.g. stargazer@voyager.net"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 pl-9 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500/50 transition font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Physical Living Sector Earth Address & Coordinates
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={typedAddress}
                  onChange={(e) => setTypedAddress(e.target.value)}
                  placeholder="e.g. Living Quarters 14, Base Gamma Sector, Switzerland"
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 pl-9 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500/50 transition"
                />
              </div>
            </div>

            {/* INTEGRATED DRAG AND DROP PROFILE IMAGE UPLOADER */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 font-sans">
                Station Avatar Photograph (Real Upload File or URL)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-8">
                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition duration-300 relative ${dragActive
                        ? "border-indigo-550 bg-indigo-500/10"
                        : "border-slate-800 hover:border-indigo-500/30 bg-slate-950/50 hover:bg-slate-950/80"
                      }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={selectLocalFile}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-indigo-400 mx-auto mb-1 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold block">
                      Drag & drop image here or click
                    </span>
                    <span className="text-[8px] text-slate-500 block uppercase font-mono mt-0.5">
                      Accepts PNG, JPG, GIF up to 2MB as Base64 string
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <span className="text-[8px] text-slate-500 uppercase font-mono mb-1.5">Avatar Preview</span>
                  <img
                    src={typedAvatar || AVATAR_PRESETS[0].url}
                    alt="Active choice"
                    className="w-12 h-12 rounded-lg border border-indigo-500/20 object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = AVATAR_PRESETS[0].url;
                    }}
                  />
                </div>
              </div>

              {/* Paste URL option or presets options */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={typedAvatar}
                    onChange={(e) => setTypedAvatar(e.target.value)}
                    placeholder="Alternatively, paste profile picture URL directly here..."
                    className="w-full bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500/30 font-mono"
                  />
                  {typedAvatar && (
                    <button
                      type="button"
                      onClick={() => setTypedAvatar("")}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Preset Avatar Fast Quick Click Option Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] text-slate-500 font-bold mr-1 uppercase">Presets:</span>
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setTypedAvatar(p.url)}
                      className={`text-[9px] font-semibold py-1 px-2.5 rounded border transition cursor-pointer flex items-center space-x-1 ${typedAvatar === p.url
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-slate-700"
                        }`}
                    >
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 border border-indigo-400/20 text-white font-bold text-xs uppercase tracking-wider transition rounded-xl flex items-center justify-center space-x-2 shadow-lg cursor-pointer hover:shadow-indigo-650/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Save & Refresh Cockpit Profile ID</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* COMPACT & MINIMALIST API ENDPOINT CONFIGURATOR POPUP */}
      <div className="p-4 bg-slate-950/60 border border-slate-800/40 rounded-xl mt-6 space-y-4">
        {/* Hub header status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-4.5 h-4.5 text-indigo-400" />
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Planetary API Endpoint Systems</h5>
              <p className="text-[10px] text-slate-500 font-mono">Configure custom models & verify satellite links</p>
            </div>
          </div>

          {/* Small Trigger Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowApiKeysPopup(!showApiKeysPopup)}
              className={`p-2 px-3.5 rounded-xl text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer flex items-center space-x-1.5 border ${showApiKeysPopup
                  ? "bg-indigo-600 border-indigo-550 text-white shadow-lg"
                  : "bg-slate-900 border-indigo-500/15 text-indigo-300 hover:bg-slate-855 hover:text-white"
                }`}
            >
              <span>{showApiKeysPopup ? "Hide Key Editor ✖" : "Configure Keys ⚙️"}</span>
            </button>
          </div>
        </div>

        {/* Micro-scale Box Hover / Touch Popup */}
        {showApiKeysPopup && (
          <div className="bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-4 shadow-xl space-y-4 font-sans animate-scaleUp">
            <div className="flex items-center justify-between border-b border-indigo-500/15 pb-2">
              <div className="flex items-center space-x-1.5 text-indigo-400 font-bold font-mono">
                <Key className="w-3.5 h-3.5 rotate-45" />
                <span className="uppercase text-[9px] tracking-widest text-[#93c5fd]">SDK Credentials Block</span>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeysPopup(false)}
                className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-900 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Step 1: Provider selection */}
              <div>
                <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">
                  1. API Provider
                </label>
                <select
                  value={activeProviderKey}
                  onChange={(e) => setActiveProviderKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-indigo-200 cursor-pointer focus:outline-none focus:border-indigo-500/40"
                >
                  <option value="google">Google Gemini Services</option>
                  <option value="groq">Groq LPU Array</option>
                  <option value="openrouter">OpenRouter Gateway</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="nvidia">NVIDIA NIM Cluster</option>
                  <option value="together">Together AI</option>
                  <option value="deepseek">DeepSeek AI</option>
                  <option value="mistral">Mistral AI</option>
                  <option value="cohere">Cohere Chat</option>
                  <option value="perplexity">Perplexity Sonar</option>
                  <option value="huggingface">Hugging Face hub</option>
                </select>
              </div>

              {/* Step 2: Add API Key */}
              <div>
                <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">
                  2. Secret API key
                </label>
                <input
                  type="password"
                  value={providers[activeProviderKey]?.key || ""}
                  onChange={(e) => handleKeyChange(activeProviderKey, e.target.value)}
                  placeholder={`Paste ${activeProviderKey.toUpperCase()} key here...`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-505"
                />
              </div>

              {/* Step 3: Model Selector */}
              <div>
                <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">
                  3. Dynamic Model List
                </label>
                {isLoadingModels ? (
                  <div className="flex items-center space-x-1.5 py-1.5 text-[9px] text-slate-400 font-mono">
                    <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                    <span>Fetching catalog...</span>
                  </div>
                ) : (
                  <select
                    value={providers[activeProviderKey]?.model || ""}
                    onChange={(e) => handleModelChange(activeProviderKey, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white cursor-pointer focus:outline-none focus:border-indigo-500/45 font-mono"
                  >
                    {fetchedModels.length > 0 ? (
                      fetchedModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))
                    ) : (
                      <option value="">Default dynamic choice</option>
                    )}
                  </select>
                )}
              </div>
            </div>

            {/* Batch scan trigger block */}
            <div className="border-t border-indigo-500/10 pt-3 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h6 className="text-[10px] uppercase font-bold text-[#93c5fd] font-mono leading-tight">Advanced Diagnostics Hub</h6>
                <p className="text-[9px] text-slate-500 leading-normal">Scan available system models & query free vs paid configurations</p>
              </div>

              <button
                type="button"
                onClick={() => scanModelsForProvider(activeProviderKey)}
                disabled={!providers[activeProviderKey]?.key || isScanning}
                className="py-1.5 px-3 rounded bg-indigo-550 hover:bg-indigo-600 disabled:opacity-50 disabled:bg-slate-900 text-white font-bold text-[9px] uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
                title={!providers[activeProviderKey]?.key ? "Please configure an API key first" : "Scan available models on this network"}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                    <span>Diagnostics Scanning...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3 h-3 text-indigo-300" />
                    <span>Scan Available Models</span>
                  </>
                )}
              </button>
            </div>

            {/* Scan Results Panel */}
            {isScanning && (
              <div className="p-3 bg-slate-900/60 border border-indigo-500/10 rounded-xl space-y-2 animate-pulse text-center">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400 mx-auto" />
                <p className="text-[10px] font-mono text-slate-400">Testing provider parameters and catalog configurations. Please hold connection...</p>
              </div>
            )}

            {scanError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-300 font-mono">
                ⚠️ Scan Error: {scanError}
              </div>
            )}

            {scanResults && (
              <div className="p-3 bg-slate-900/60 border border-indigo-500/25 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2">
                  <span className="text-[10px] font-bold text-white font-mono uppercase tracking-wide">
                    Scan Report: {scanResults.length} tested • {scanResults.filter(r => r.working).length} working ({scanResults.filter(r => r.working && r.isFree).length} free)
                  </span>
                  <button
                    type="button"
                    onClick={() => setScanResults(null)}
                    className="text-[9px] text-[#f43f5e] hover:text-rose-400 uppercase font-bold font-mono transition cursor-pointer"
                  >
                    Clear Report
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {scanResults.length === 0 ? (
                    <p className="text-[10px] text-slate-500 text-center font-mono py-4">No model listings returned for this key/provider.</p>
                  ) : (
                    scanResults
                      .slice()
                      .sort((a, b) => {
                        // Sort: working free first, then working paid, then failed
                        if (a.working && !b.working) return -1;
                        if (!a.working && b.working) return 1;
                        if (a.working && b.working) {
                          if (a.isFree && !b.isFree) return -1;
                          if (!a.isFree && b.isFree) return 1;
                        }
                        return 0;
                      })
                      .map((result) => (
                        <div
                          key={result.id}
                          className={`p-2 rounded-lg border flex items-center justify-between gap-3 transition-colors ${result.working
                              ? "bg-slate-950/40 border-slate-800/40 hover:border-indigo-500/30"
                              : "bg-rose-950/5 border-rose-950/20"
                            }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${result.working ? "bg-emerald-450" : "bg-rose-450"}`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-bold text-white font-mono truncate">{result.name}</span>
                                {result.working && (
                                  <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${result.isFree
                                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                    }`}>
                                    {result.isFree ? "Free" : "Paid"}
                                  </span>
                                )}
                              </div>
                              <span className="text-[8px] text-slate-500 font-mono block truncate">{result.id}</span>
                              {!result.working && result.error && (
                                <span className="text-[8px] text-rose-300/85 font-mono block truncate" title={result.error}>
                                  Reason: {result.error}
                                </span>
                              )}
                            </div>
                          </div>

                          {result.working && (
                            <button
                              type="button"
                              onClick={() => {
                                handleModelChange(activeProviderKey, result.id);
                                setScanResults(null);
                              }}
                              className="px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-550 text-[#93c5fd] hover:text-white font-bold text-[8px] uppercase transition cursor-pointer shrink-0"
                            >
                              Select
                            </button>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Verification and Link Logs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => testProviderConnectivity(activeProviderKey)}
                disabled={!providers[activeProviderKey]?.key || testingProvider !== null}
                className="py-2 px-4 rounded bg-indigo-650 hover:bg-indigo-600 disabled:bg-slate-900 disabled:text-slate-600 text-white font-bold text-[10px] uppercase font-mono transition flex items-center justify-center cursor-pointer"
              >
                {testingProvider === activeProviderKey ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  "Test Connection Key"
                )}
              </button>

              <div className="text-[10px] font-mono text-slate-400">
                Connection Status:{" "}
                <span
                  className={`font-semibold ${providers[activeProviderKey]?.status === "active"
                      ? "text-emerald-400"
                      : providers[activeProviderKey]?.status === "error"
                        ? "text-rose-400"
                        : "text-amber-400"
                    }`}
                >
                  {(providers[activeProviderKey]?.status || "idle").toUpperCase()}
                </span>
              </div>
            </div>

            {providers[activeProviderKey]?.testLogs && (
              <p className="text-[9px] font-mono p-2.5 bg-slate-900 text-indigo-300 border border-slate-850 rounded max-h-24 overflow-y-auto leading-normal">
                {providers[activeProviderKey].testLogs}
              </p>
            )}
          </div>
        )}

        {/* Active Provider Selector Grid */}
        <div className="space-y-2 pt-2 border-t border-indigo-500/10">
          <label className="block text-[10px] uppercase tracking-wide font-bold text-slate-450 font-mono">
            Active Satellite Transmitter Hub
          </label>
          <p className="text-[10px] text-slate-400">
            Click on a configured provider below to set it as active. Your CosmoGuide advanced chat will direct all telemetry queries through its systems.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
            {Object.keys(providers).map((provKey) => {
              const hasKey = providers[provKey]?.key?.trim().length > 0;
              const isActive = activeProvider === provKey;
              const status = providers[provKey]?.status || "idle";

              return (
                <div
                  key={provKey}
                  onClick={() => {
                    setActiveProviderKey(provKey);
                    setShowApiKeysPopup(true);
                  }}
                  className={`p-2 rounded-xl text-[10px] font-mono border transition-all duration-200 cursor-pointer flex flex-col justify-between items-start ${isActive
                      ? "bg-indigo-600/30 border-indigo-400 text-white ring-1 ring-indigo-500/40"
                      : hasKey
                        ? "bg-slate-900/60 border-indigo-500/20 text-indigo-300 hover:border-indigo-500/40"
                        : "bg-slate-950/20 border-slate-900 text-slate-500 hover:border-slate-800"
                    }`}
                  title={`Configure settings for ${provKey}`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="uppercase font-bold tracking-tight truncate">{provKey}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  <div className="w-full flex items-center justify-between text-[8px] mt-1.5 text-slate-400">
                    <span className={hasKey ? "text-[#93c5fd]" : "text-slate-600"}>
                      {hasKey ? "Configured" : "Unset"}
                    </span>

                    {hasKey && !isActive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetActiveProvider(provKey);
                        }}
                        className="px-1 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/50 text-[8px] text-indigo-300 transition-all font-bold font-sans uppercase"
                      >
                        Set Active
                      </button>
                    )}

                    {isActive && (
                      <span className="text-emerald-400 font-bold text-[8px] uppercase font-sans">
                        ONLINE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {activeProvider ? (
            <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-505/5 text-[10px] text-emerald-300 font-mono flex items-center justify-between">
              <span>🛰️ Dynamic Telemetry Channel: <strong className="uppercase text-[#a7f3d0]">{activeProvider}</strong> ({providers[activeProvider]?.model || "default model"})</span>
              <span className="text-[8px] font-bold uppercase bg-emerald-505/20 text-[#a7f3d0] px-2 py-0.5 rounded animation-pulse">Connected</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-505/5 text-[10px] text-rose-300 font-mono flex items-center space-x-2">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-450" />
              <span>Transmissions severed. No active satellite provider configured. Please insert key in hub controls.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
