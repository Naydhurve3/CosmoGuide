// CosmoGuide - AI Space Exploration Cockpit
// Created by: Nayan Dhurve (nayandhurve44@gmail.com)
// License: MIT

import React, { useState, useRef, useEffect } from "react";
import { Message, AssistantConfig } from "../types";
import { Send, Sparkles, Volume2, VolumeX, Copy, Check, Info, Trash2 } from "lucide-react";

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: "### 🌌 Greetings, Star Voyager!\n\nI am **CosmoGuide**, your AI-powered space knowledge companion. I can trace planetary orbits, compile real-time star charts, monitor asteroid trajectories, and break down complex astrophysics topics.\n\nChoose an **Assistant Style** on the selector above and ask me anything about the universe!",
      timestamp: new Date().toLocaleTimeString(),
      sources: ["CosmoGuide Core Satellite Core"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [style, setStyle] = useState<"Simple" | "Balanced" | "Expert">("Balanced");
  const [isTyping, setIsTyping] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState("google");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const chatScrollEndRef = useRef<HTMLDivElement | null>(null);

  // Sync active communication provider from storage hub dynamically
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("cosmo_active_provider");
      if (saved) {
        setActiveProvider(saved);
      }
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Auto scroll to latest chats
  useEffect(() => {
    chatScrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue.trim();
    if (!textToSend || isTyping) return;

    if (!customText) {
      setInputValue("");
    }

    // Add user message
    const userMessage: Message = {
      id: `m-usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((p) => [...p, userMessage]);
    setIsTyping(true);

    try {
      // Safely load active key configurations from secure localStorage to link user models
      let customProvidersObj = null;
      try {
        const savedKeysStr = localStorage.getItem("cosmo_key_vault");
        if (savedKeysStr) {
          customProvidersObj = JSON.parse(savedKeysStr);
        }
      } catch (err) { }

      const currentProvider = localStorage.getItem("cosmo_active_provider") || "google";

      const response = await fetch("/api/chat-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          style,
          customProviders: customProvidersObj,
          activeProvider: currentProvider
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Stellar proxy communication failure.");
      }

      const data = await response.json();

      setIsTyping(false);
      setIsDemoMode(data.mode === "demo");
      setMessages((p) => [
        ...p,
        {
          id: `m-model-${Date.now()}`,
          role: "model",
          content: data.content,
          timestamp: new Date().toLocaleTimeString(),
          sources: data.sources || ["Deep space telemetries"]
        }
      ]);
    } catch (err: any) {
      setIsTyping(false);
      setMessages((p) => [
        ...p,
        {
          id: `m-err-${Date.now()}`,
          role: "model",
          content: `### ❌ Communications Glitch\n\nFailed to establish connection with our planetary computing satellite core: \n\n*${err.message || "Unknown anomaly"}*.\n\nPlease verify that your server is active or update your API key in AI Studio.`,
          timestamp: new Date().toLocaleTimeString(),
          sources: ["System telemetry diagnostics"]
        }
      ]);
    }
  };

  // Text-To-Speech audio player using Browser Web API
  const handleTTS = (msgId: string, text: string) => {
    if (currentlyPlaying === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlyPlaying(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown characters before playing
    const cleanText = text
      .replace(/[#*`_-]/g, "")
      .replace(/\[\d+\]/g, ""); // strip citations

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;

    utterance.onend = () => {
      setCurrentlyPlaying(null);
    };

    utterance.onerror = () => {
      setCurrentlyPlaying(null);
    };

    setCurrentlyPlaying(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup synthesis on components unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleCopy = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const clearHistory = () => {
    if (window.confirm("Verify: Clear cosmos chat communications history?")) {
      setMessages([
        {
          id: "welcome",
          role: "model",
          content: "System wiped. Ready to receive fresh telemetry inputs.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  // Helper sample prompts
  const samplePrompts = [
    { title: "Define Black Holes", query: "Can you explain how black holes warp spacetime and what happens at the event horizon?" },
    { title: "Artemis Lunar Base", query: "What are the core technical landing challenges in NASA's Artemis lunar South Pole mission?" },
    { title: "Gravitational Lensing", query: "Explain the phenomenon of gravitational lensing and how astronomers use it to map dark matter." }
  ];

  return (
    <div className="flex flex-col h-[580px] bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
      {/* Configuration Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-indigo-500/10 bg-slate-950/20">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-white tracking-wide">Cosmic AI Core</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-indigo-550/25 text-[#a7f3d0] border border-indigo-500/30 flex items-center gap-1 font-extrabold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeProvider}</span>
          </span>
          {isDemoMode && (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-extrabold tracking-wider">
              <span>DEMO</span>
            </span>
          )}
        </div>

        {/* Dynamic style selector */}
        <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-indigo-500/10 text-xs">
          {(["Simple", "Balanced", "Expert"] as const).map((styleOpt) => (
            <button
              key={styleOpt}
              onClick={() => setStyle(styleOpt)}
              className={`p-1.5 px-3 rounded-lg font-medium transition-all duration-300 ${style === styleOpt
                ? "bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
                }`}
            >
              {styleOpt}
            </button>
          ))}
        </div>

        <button
          onClick={clearHistory}
          className="p-1.5 rounded-lg border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all text-xs flex items-center"
          title="Clear communications log"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 text-left">
        {/* Demo mode banner */}
        {isDemoMode && (
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start space-x-2.5 text-xs text-amber-300/90 leading-relaxed">
            <span className="flex-shrink-0 mt-0.5">🎭</span>
            <div>
              <strong>Demo Mode</strong> — Using a shared server key (50 requests/day/IP).
              <button
                onClick={() => { const btn = document.querySelector('[data-vault-trigger]') as HTMLElement; if (btn) btn.click(); }}
                className="underline hover:text-amber-200 ml-1 font-semibold"
              >
                Add your own FREE API key → Settings
              </button>
            </div>
          </div>
        )}

        {/* Style selection info alert box */}
        <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start space-x-2.5 text-xs text-indigo-300/90 leading-relaxed">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            {style === "Simple" && (
              <span><strong>Layman Mode:</strong> Conceptual descriptions, analogies, shorter text blocks, easy comparison formats.</span>
            )}
            {style === "Balanced" && (
              <span><strong>Balanced Mode:</strong> Structurally organized reports pairing general context with core statistical metrics.</span>
            )}
            {style === "Expert" && (
              <span><strong>Astrophysics Thesis:</strong> Quantitative equations, rigid mathematical dimensions, and raw chemical metrics values.</span>
            )}
          </div>
        </div>

        {/* Message bubble loops */}
        {messages.map((message) => {
          const isModel = message.role === "model";
          return (
            <div
              key={message.id}
              className={`flex flex-col max-w-[85%] ${isModel ? "self-start" : "self-end items-end ml-auto"
                } space-y-1`}
            >
              <div
                className={`p-3.5 px-4 rounded-2xl relative group transition duration-300 ${isModel
                  ? "bg-slate-950/30 border border-indigo-500/10 text-indigo-100 rounded-tl-none shadow-md"
                  : "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/15"
                  }`}
              >
                {/* Clean formatted output parsing lines */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content.split("\n").map((line, idx) => {
                    if (line.startsWith("###")) {
                      return <h5 key={idx} className="font-bold text-white text-base mt-2 mb-1">{line.replace("###", "").trim()}</h5>;
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <strong key={idx} className="block text-white font-semibold mt-1">{line.replace(/\*\*/g, "").trim()}</strong>;
                    }
                    return <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>{line}</p>;
                  })}
                </div>

                {/* Footnotes references if model answered */}
                {isModel && message.sources && message.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-indigo-500/10 text-[10px] text-indigo-300/70">
                    <span className="font-semibold text-indigo-400 block mb-0.5">Grounding Sources:</span>
                    <ul className="list-disc pl-3.5 space-y-0.5">
                      {message.sources.map((src, sIdx) => <li key={sIdx}>{src}</li>)}
                    </ul>
                  </div>
                )}

                {/* Floating microaction panel icons */}
                <div
                  className={`absolute right-2 bottom-1.5 opacity-0 group-hover:opacity-100 flex items-center space-x-1.5 p-1 bg-slate-900 rounded border border-indigo-500/10 transition-all duration-300`}
                >
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="p-1 hover:bg-slate-805 text-slate-400 hover:text-white rounded"
                    title="Copy message contents"
                  >
                    {copiedId === message.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  {isModel && (
                    <button
                      onClick={() => handleTTS(message.id, message.content)}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                      title="Read Answer Aloud"
                    >
                      {currentlyPlaying === message.id ? (
                        <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Timestamp tags */}
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                {message.timestamp} {message.tokens && `• Approx. ${message.tokens} tokens`}
              </span>
            </div>
          );
        })}

        {/* Animated sparkling loader for typing states */}
        {isTyping && (
          <div className="flex items-center space-x-2 p-3.5 bg-slate-950/20 border border-indigo-500/5 rounded-2xl rounded-tl-none self-start max-w-[200px]">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-xs text-slate-400 font-mono animate-pulse pl-2">Downlinking...</span>
          </div>
        )}

        <div ref={chatScrollEndRef} />
      </div>

      {/* Auto suggestions clickable prompt lists */}
      {messages.length === 1 && (
        <div className="px-4 py-2 flex flex-wrap gap-2 text-xs border-t border-indigo-500/5 bg-slate-950/10">
          <span className="text-slate-500 self-center font-bold text-[10px] uppercase">Guides:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              className="p-1.5 px-3 rounded-lg bg-slate-900 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/30 text-indigo-300 transition duration-300"
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Control Input bar */}
      <div className="p-3 bg-slate-950/40 border-t border-indigo-500/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search celestial indices, space coordinates, transit formulas..."
            className="flex-grow bg-slate-950 border border-slate-800 rounded-xl p-2.5 px-4 text-sm text-indigo-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-300"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition duration-300 flex items-center shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
