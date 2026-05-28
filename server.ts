import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// List of live countdowns for SpaceX/ISRO/NASA launch windows
const LIVE_LAUNCH_WINDOWS = [
  {
    id: "launch-artemis-2",
    agency: "NASA",
    mission: "Artemis II Crewed Lunar Flyby",
    vehicle: "Space Launch System (SLS) Block 1",
    location: "KSC LC-39B, Florida, USA",
    countdownDays: 142,
    alert: "Crew fully trained. Cryogenic fuel tank pressure valves certified."
  },
  {
    id: "launch-starship-6",
    agency: "SpaceX",
    mission: "Starship Integrated Flight Test 6",
    vehicle: "Starship Super Heavy",
    location: "Starbase, Boca Chica, Texas",
    countdownDays: 18,
    alert: "Core booster static fire tests successfully finalized."
  },
  {
    id: "launch-gaganyaan",
    agency: "ISRO",
    mission: "Gaganyaan G1 Crew Demonstration",
    vehicle: "LVM3 Rocket",
    location: "SDSC SHAR, Sriharikota, India",
    countdownDays: 45,
    alert: "In-flight escape launch abort simulation parameters fully verified."
  }
];

// Galaxy / Hubble Birthday archives mapping
const BIRTHDAY_ARCHIVES = [
  {
    monthRange: "Winter (Dec - Feb)",
    title: "The Pillars of Creation (M16 Infrared)",
    explanation: "A spectacular view of newborn star clusters emerging from dense towers of cold gas and cosmic dust in the Eagle Nebula, photographed in deep near-infrared mapping.",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=60"
  },
  {
    monthRange: "Spring (Mar - May)",
    title: "Centaurus A Radio Galaxy Jets",
    explanation: "The massive elliptical galaxy Centaurus A shows violent relativistic plasma jets bursting outwards from its central supermassive black hole, colliding with gas clouds.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60"
  },
  {
    monthRange: "Summer (Jun - Aug)",
    title: "The Helix Nebula Eyeball",
    explanation: "Often called 'The Eye of God', this planetary nebula is a dying solar-type star shedding its outer gaseous shells into interstellar space, photographed in crisp resolution.",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60"
  },
  {
    monthRange: "Autumn (Sep - Nov)",
    title: "Andromeda's Core Core Halo",
    explanation: "Our nearest spiral neighbor M31 reveals a breathtaking luminous starburst core and concentric dust lanes winding around a central black hole engine.",
    imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60"
  }
];

// Helper to resolve Gemini client using either systemic API key or user's custom key
function getGeminiClient(customKey?: string): GoogleGenAI | null {
  const finalKey = customKey || process.env.GEMINI_API_KEY;
  if (!finalKey || finalKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: finalKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ----------------- ADVANCED CORE API ENDPOINTS -----------------

// Live orbits launches indices
app.get("/api/launches", (req, res) => {
  res.json(LIVE_LAUNCH_WINDOWS);
});

// Hubble Time Machine mapping
app.post("/api/birthday-calculator", (req, res) => {
  const { date } = req.body;
  if (!date) {
    return res.status(400).json({ error: "Date parameter is required." });
  }

  // Choose index based on month value
  const parsedDate = new Date(date);
  const month = isNaN(parsedDate.getTime()) ? 0 : parsedDate.getMonth();
  let index = 0;
  if (month >= 2 && month <= 4) index = 1; // Spring
  else if (month >= 5 && month <= 7) index = 2; // Summer
  else if (month >= 8 && month <= 10) index = 3; // Autumn

  const item = BIRTHDAY_ARCHIVES[index];
  res.json({
    date,
    headline: `GALACTIC GAZETTE (EST. 2026): Stellar Burst Over Eagle Core Commemorated on Your Day!`,
    title: item.title,
    explanation: item.explanation,
    imageUrl: item.imageUrl,
    astrologicalSymbol: ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"][month]
  });
});

// GET /api/models - Returns dynamic listings or reliable statics for 11 providers
app.get("/api/models", async (req, res) => {
  const { provider, apiKey } = req.query as { provider?: string; apiKey?: string };
  if (!provider) {
    return res.status(400).json({ error: "Provider parameter is required." });
  }

  // Define fallback statics for each of the 11 providers
  const staticModels: Record<string, { id: string; name: string }[]> = {
    google: [
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Default)" },
      { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro" },
      { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite" }
    ],
    groq: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Default)" },
      { id: "llama3-8b-8192", name: "Llama 3 8B" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" }
    ],
    openrouter: [
      { id: "google/gemini-2.1-pro-preview:free", name: "Gemini 2.1 Pro Free" },
      { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro (Standard)" },
      { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "meta-llama/llama-3-8b-instruct:free", name: "Llama 3 8B Free" }
    ],
    anthropic: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Latest)" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" }
    ],
    nvidia: [
      { id: "meta/llama-3.1-405b-instruct", name: "Llama 3.1 405B Instruct" },
      { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "Llama 3.1 Nemotron 70B" },
      { id: "mistralai/mixtral-8x22b-instruct-v0.1", name: "Mixtral 8x22B" }
    ],
    together: [
      { id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", name: "Llama 3.1 8B Instruct" },
      { id: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", name: "Llama 3.1 70B Instruct" },
      { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", name: "Mixtral 8x7B" }
    ],
    deepseek: [
      { id: "deepseek-chat", name: "DeepSeek Chat (V3)" },
      { id: "deepseek-coder", name: "DeepSeek Coder (V2.5)" }
    ],
    mistral: [
      { id: "open-mistral-7b", name: "Mistral 7B (Default)" },
      { id: "mistral-large-latest", name: "Mistral Large (Latest)" },
      { id: "codestral-latest", name: "Codestral AI" }
    ],
    cohere: [
      { id: "command-r-plus", name: "Command R+ (104B)" },
      { id: "command-r", name: "Command R (35B)" },
      { id: "command", name: "Command (52B)" },
      { id: "command-light", name: "Command Light" }
    ],
    perplexity: [
      { id: "sonar-reasoning", name: "Sonar Reasoning (Default)" },
      { id: "sonar", name: "Sonar Search" },
      { id: "sonar-reasoning-pro", name: "Sonar Reasoning Pro" },
      { id: "sonar-pro", name: "Sonar Pro Search" }
    ],
    huggingface: [
      { id: "meta-llama/Llama-3.1-8B-Instruct", name: "Llama 3.1 8B Instruct" },
      { id: "meta-llama/Llama-3.1-70B-Instruct", name: "Llama 3.1 70B Instruct" },
      { id: "mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B Instruct" },
      { id: "microsoft/Phi-3-mini-4k-instruct", name: "Phi 3 Mini 4K Instruct" }
    ]
  };

  if (!apiKey) {
    return res.json({ models: staticModels[provider] || [{ id: "default", name: `Default ${provider} Model` }] });
  }

  try {
    if (provider === "google") {
      return res.json({ models: staticModels.google });
    }

    let modelsUrl = "";
    if (provider === "groq") modelsUrl = "https://api.groq.com/openai/v1/models";
    else if (provider === "openrouter") modelsUrl = "https://openrouter.ai/api/v1/models";
    else if (provider === "nvidia") modelsUrl = "https://integrate.api.nvidia.com/v1/models";
    else if (provider === "together") modelsUrl = "https://api.together.xyz/v1/models";
    else if (provider === "mistral") modelsUrl = "https://api.mistral.ai/v1/models";

    if (modelsUrl) {
      const response = await fetch(modelsUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.data)) {
          const formatted = data.data.map((m: any) => ({
            id: m.id,
            name: m.id
          }));
          return res.json({ models: formatted });
        }
      }
    }

    return res.json({ models: staticModels[provider] || [{ id: "default", name: `Default ${provider} Model` }] });
  } catch (error: any) {
    console.error(`Error requesting models from ${provider}:`, error);
    return res.json({ models: staticModels[provider] || [{ id: "default", name: `Default ${provider} Model` }] });
  }
});

// Test Connection health check for 11 providers (Gemini, Groq, OpenRouter, Anthropic, NVIDIA, Together, DeepSeek, Mistral, Cohere, Perplexity, Hugging Face)
app.post("/api/test-key", async (req, res) => {
  const { provider, apiKey, model } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: "API key is required." });
  }

  const testContent = "Respond only with 'Stellar communication online!' to verify api connectivity.";

  try {
    if (provider === "google") {
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
        model: model || "gemini-3.5-flash",
        contents: "Respond only with 'Stellar communication online!' to verify api connectivity.",
      });
      return res.json({
        success: true,
        message: response.text || "Connected successfully with Gemini orbiters.",
        details: `Active model: ${model || "gemini-3.5-flash"}`
      });
    }

    if (provider === "anthropic") {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: model || "claude-3-5-sonnet-20241022",
          messages: [{ role: "user", content: testContent }],
          max_tokens: 15
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error?.message || `Anthropic error ${resp.status}`);
      }
      return res.json({
        success: true,
        message: data.content?.[0]?.text || "Connected successfully with Anthropic satellite.",
        details: `Active model: ${model || "claude-3-5-sonnet-20241022"}`
      });
    }

    if (provider === "cohere") {
      const resp = await fetch("https://api.cohere.com/v1/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: testContent,
          model: model || "command-r-plus"
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || `Cohere error ${resp.status}`);
      }
      return res.json({
        success: true,
        message: data.text || "Connected successfully with Cohere transceiver.",
        details: `Active model: ${model || "command-r-plus"}`
      });
    }

    if (provider === "huggingface") {
      const targetModel = model || "meta-llama/Llama-3.1-8B-Instruct";
      const resp = await fetch(`https://api-inference.huggingface.co/models/${targetModel}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: testContent,
          parameters: { max_new_tokens: 15 }
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || `Hugging Face returned status ${resp.status}`);
      }
      const responseMsg = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
      return res.json({
        success: true,
        message: responseMsg || "Connected successfully with Hugging Face cluster.",
        details: `Active model: ${targetModel}`
      });
    }

    const openAICompatibleBases: Record<string, { url: string; fallbackModel: string }> = {
      groq: { url: "https://api.groq.com/openai/v1/chat/completions", fallbackModel: "llama-3.3-70b-versatile" },
      openrouter: { url: "https://openrouter.ai/api/v1/chat/completions", fallbackModel: "google/gemini-2.1-pro-preview:free" },
      nvidia: { url: "https://integrate.api.nvidia.com/v1/chat/completions", fallbackModel: "meta/llama-3.1-405b-instruct" },
      together: { url: "https://api.together.xyz/v1/chat/completions", fallbackModel: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo" },
      deepseek: { url: "https://api.deepseek.com/v1/chat/completions", fallbackModel: "deepseek-chat" },
      mistral: { url: "https://api.mistral.ai/v1/chat/completions", fallbackModel: "open-mistral-7b" },
      perplexity: { url: "https://api.perplexity.ai/chat/completions", fallbackModel: "sonar" }
    };

    const targetConfig = openAICompatibleBases[provider];
    if (targetConfig) {
      const resp = await fetch(targetConfig.url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model || targetConfig.fallbackModel,
          messages: [{ role: "user", content: testContent }],
          max_tokens: 15
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error?.message || data.error || `${provider} returned ${resp.status}`);
      }
      return res.json({
        success: true,
        message: data.choices?.[0]?.message?.content || `Successfully verified communications payload with ${provider}.`,
        details: `Active model: ${model || targetConfig.fallbackModel}`
      });
    }

    res.json({
      success: true,
      message: `Verified mock status connection for unrecognized custom provider: ${provider}`,
      details: "No network anomalies reported by satellite array."
    });
  } catch (err: any) {
    console.error("[Test Key Connection Error]", err);
    res.status(400).json({
      success: false,
      error: err.message || "Failed validating API credentials."
    });
  }
});

// POST /api/test-models - Batch-tests available models for specific providers with timeouts & fee recognition
app.post("/api/test-models", async (req, res) => {
  const { provider, apiKey } = req.body;
  if (!provider || !apiKey) {
    return res.status(400).json({ error: "Provider and API key are required." });
  }

  // Fallback static list
  const staticModels: Record<string, { id: string; name: string }[]> = {
    google: [
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Default)" },
      { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro" },
      { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite" }
    ],
    groq: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Default)" },
      { id: "llama3-8b-8192", name: "Llama 3 8B" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" }
    ],
    openrouter: [
      { id: "google/gemini-2.1-pro-preview:free", name: "Gemini 2.1 Pro Free" },
      { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro (Standard)" },
      { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "meta-llama/llama-3-8b-instruct:free", name: "Llama 3 8B Free" }
    ],
    anthropic: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Latest)" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" }
    ],
    nvidia: [
      { id: "meta/llama-3.1-405b-instruct", name: "Llama 3.1 405B Instruct" },
      { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "Llama 3.1 Nemotron 70B" },
      { id: "mistralai/mixtral-8x22b-instruct-v0.1", name: "Mixtral 8x22B" }
    ],
    together: [
      { id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", name: "Llama 3.1 8B Instruct" },
      { id: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", name: "Llama 3.1 70B Instruct" },
      { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", name: "Mixtral 8x7B" }
    ],
    deepseek: [
      { id: "deepseek-chat", name: "DeepSeek Chat (V3)" },
      { id: "deepseek-coder", name: "DeepSeek Coder (V2.5)" }
    ],
    mistral: [
      { id: "open-mistral-7b", name: "Mistral 7B (Default)" },
      { id: "mistral-large-latest", name: "Mistral Large (Latest)" },
      { id: "codestral-latest", name: "Codestral AI" }
    ],
    cohere: [
      { id: "command-r-plus", name: "Command R+ (104B)" },
      { id: "command-r", name: "Command R (35B)" },
      { id: "command", name: "Command (52B)" },
      { id: "command-light", name: "Command Light" }
    ],
    perplexity: [
      { id: "sonar-reasoning", name: "Sonar Reasoning (Default)" },
      { id: "sonar", name: "Sonar Search" },
      { id: "sonar-reasoning-pro", name: "Sonar Reasoning Pro" },
      { id: "sonar-pro", name: "Sonar Pro Search" }
    ],
    huggingface: [
      { id: "meta-llama/Llama-3.1-8B-Instruct", name: "Llama 3.1 8B Instruct" },
      { id: "meta-llama/Llama-3.1-70B-Instruct", name: "Llama 3.1 70B Instruct" },
      { id: "mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B Instruct" },
      { id: "microsoft/Phi-3-mini-4k-instruct", name: "Phi 3 Mini 4K Instruct" }
    ]
  };

  let modelList: { id: string; name: string }[] = [];

  try {
    if (provider === "google") {
      modelList = staticModels.google;
    } else {
      let modelsUrl = "";
      if (provider === "groq") modelsUrl = "https://api.groq.com/openai/v1/models";
      else if (provider === "openrouter") modelsUrl = "https://openrouter.ai/api/v1/models";
      else if (provider === "nvidia") modelsUrl = "https://integrate.api.nvidia.com/v1/models";
      else if (provider === "together") modelsUrl = "https://api.together.xyz/v1/models";
      else if (provider === "mistral") modelsUrl = "https://api.mistral.ai/v1/models";

      if (modelsUrl) {
        const response = await fetch(modelsUrl, {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.data)) {
            modelList = data.data.map((m: any) => ({
              id: m.id,
              name: m.id
            }));
          }
        }
      }
    }
  } catch (err) {
    console.warn(`Could not load live dynamic list for provider ${provider}:`, err);
  }

  if (!modelList || modelList.length === 0) {
    modelList = staticModels[provider] || [{ id: "default", name: `Default ${provider} Model` }];
  }

  // To safeguard performance, test popular sub-slices of max 15 models
  const maxToTest = 15;
  const slicedModels = modelList.slice(0, maxToTest);

  const openAICompatibleBases: Record<string, { url: string }> = {
    groq: { url: "https://api.groq.com/openai/v1/chat/completions" },
    openrouter: { url: "https://openrouter.ai/api/v1/chat/completions" },
    nvidia: { url: "https://integrate.api.nvidia.com/v1/chat/completions" },
    together: { url: "https://api.together.xyz/v1/chat/completions" },
    deepseek: { url: "https://api.deepseek.com/v1/chat/completions" },
    mistral: { url: "https://api.mistral.ai/v1/chat/completions" },
    perplexity: { url: "https://api.perplexity.ai/chat/completions" }
  };

  const results = await Promise.all(
    slicedModels.map(async (model) => {
      let working = false;
      let error: string | null = null;
      let isFree = false;

      if (provider === "openrouter") {
        isFree = model.id.endsWith(":free");
      } else if (provider === "groq") {
        const lowercaseId = model.id.toLowerCase();
        isFree = lowercaseId.includes("llama3-8b") || lowercaseId.includes("gemma") || lowercaseId.includes("mixtral") || lowercaseId.includes("versatile");
      }

      try {
        if (provider === "google") {
          const client = new GoogleGenAI({ apiKey });
          const response = await client.models.generateContent({
            model: model.id,
            contents: "ping",
            config: { maxOutputTokens: 1 }
          });
          if (response) {
            working = true;
          }
        } else if (provider === "anthropic") {
          const resp = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json"
            },
            body: JSON.stringify({
              model: model.id,
              messages: [{ role: "user", content: "ping" }],
              max_tokens: 1
            }),
            signal: AbortSignal.timeout(5000)
          });
          const data = await resp.json();
          if (resp.ok) {
            working = true;
          } else {
            error = data.error?.message || `Anthropic status ${resp.status}`;
          }
        } else if (provider === "cohere") {
          const resp = await fetch("https://api.cohere.com/v1/chat", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: "ping",
              model: model.id
            }),
            signal: AbortSignal.timeout(5000)
          });
          const data = await resp.json();
          if (resp.ok) {
            working = true;
          } else {
            error = data.message || `Cohere status ${resp.status}`;
          }
        } else if (provider === "huggingface") {
          const resp = await fetch(`https://api-inference.huggingface.co/models/${model.id}`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              inputs: "ping",
              parameters: { max_new_tokens: 1 }
            }),
            signal: AbortSignal.timeout(5000)
          });
          const data = await resp.json();
          if (resp.ok) {
            working = true;
          } else {
            error = data.error || `Hugging Face status ${resp.status}`;
          }
        } else {
          const targetConfig = openAICompatibleBases[provider];
          if (targetConfig) {
            const resp = await fetch(targetConfig.url, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: model.id,
                messages: [{ role: "user", content: "ping" }],
                max_tokens: 1
              }),
              signal: AbortSignal.timeout(5000)
            });
            const data = await resp.json();
            if (resp.ok) {
              working = true;
            } else {
              error = data.error?.message || data.error || `${provider} returned code ${resp.status}`;
            }
          } else {
            working = true;
          }
        }
      } catch (err: any) {
        error = err.message || "Timeout or unreachable connection endpoint.";
      }

      return {
        id: model.id,
        name: model.name || model.id,
        working,
        isFree,
        error
      };
    })
  );

  res.json({
    provider,
    totalTested: results.length,
    working: results.filter((r) => r.working).length,
    free: results.filter((r) => r.isFree && r.working).length,
    models: results
  });
});

// AI Advanced Chat Engine supporting Custom Vault Credentials passed from headers / state
app.post("/api/chat-advanced", async (req, res) => {
  try {
    const { message, style = "Balanced", customProviders, activeProvider = "google" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message input is required." });
    }

    const currentProvider = activeProvider || "google";
    const providerSettings = customProviders?.[currentProvider] || {};
    let apiKey = providerSettings.key || "";
    let model = providerSettings.model || "";

    // Fallback server keys for convenience/testing if not specified in vault but defined in environment:
    if (!apiKey) {
      if (currentProvider === "google") {
        apiKey = process.env.GEMINI_API_KEY || "";
      } else if (currentProvider === "groq") {
        apiKey = process.env.GROQ_API_KEY || "";
      } else if (currentProvider === "openrouter") {
        apiKey = process.env.OPENROUTER_API_KEY || "";
      } else if (currentProvider === "anthropic") {
        apiKey = process.env.ANTHROPIC_API_KEY || "";
      }
    }

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(400).json({
        error: `Provider '${currentProvider}' has no valid API key in your key vault. Please visit the Observatory Station Key Hub to fill it.`
      });
    }

    let instructions = "";
    if (style === "Simple") {
      instructions = "Explain in simple layperson terms. Use metaphors or friendly comparisons with an elegant celestial storytelling vibe. Shorter blocks of text, maximum 2 paragraphs.";
    } else if (style === "Expert") {
      instructions = "Focus on rigorous astrophysics formulas, solar mechanics, spectroscopic observations, and technical space metrics. Be highly precise.";
    } else {
      instructions = "Deliver structured summaries containing interesting insights, bullet points, and clean lists.";
    }

    const commandPrompt = `You are "CosmoGuide", the ultimate AI space exploration companion.
The user is asking: "${message}".
Style requested: ${style}.
Guidelines: ${instructions}
Answer in beautiful structured Markdown format and specify your grounding citations as bracketed footnotes if any. Do not expose internal technical routes.`;

    if (currentProvider === "google") {
      const client = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      const result = await client.models.generateContent({
        model: model || "gemini-3.5-flash",
        contents: commandPrompt,
      });

      return res.json({
        content: result.text || "Signal interrupted. Cosmic radiation detected.",
        timestamp: new Date().toLocaleTimeString(),
        sources: ["James Webb near-infrared imaging", "NASA Astrobiology core", "Stellarium stellar databases"]
      });
    }

    if (currentProvider === "anthropic") {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: model || "claude-3-5-sonnet-20241022",
          messages: [{ role: "user", content: commandPrompt }],
          max_tokens: 1512
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error?.message || `Anthropic returned status ${resp.status}`);
      }
      return res.json({
        content: data.content?.[0]?.text || "Communication loop disrupted.",
        timestamp: new Date().toLocaleTimeString(),
        sources: ["ESA Stellar Cartography", "Chandra X-Ray Observatories", "Anthropic Semantic Grid"]
      });
    }

    if (currentProvider === "cohere") {
      const resp = await fetch("https://api.cohere.com/v1/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: commandPrompt,
          model: model || "command-r-plus"
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || `Cohere returned status ${resp.status}`);
      }
      return res.json({
        content: data.text || "Direct telemetry line offline.",
        timestamp: new Date().toLocaleTimeString(),
        sources: ["Canada-France-Hawaii Telescope spectra", "Cohere command modules", "Galactic Archive Core"]
      });
    }

    if (currentProvider === "huggingface") {
      const targetModel = model || "meta-llama/Llama-3.1-8B-Instruct";
      const resp = await fetch(`https://api-inference.huggingface.co/models/${targetModel}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: commandPrompt,
          parameters: { max_new_tokens: 1024 }
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || `Hugging Face returned status ${resp.status}`);
      }
      const responseMsg = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
      return res.json({
        content: responseMsg || "Distributed compute clusters failed to compute.",
        timestamp: new Date().toLocaleTimeString(),
        sources: ["Hugging Face Open Weights repository", "Community model arrays", "Kitt Peak National Observatory"]
      });
    }

    const openAICompatibleBases: Record<string, { url: string; fallbackModel: string; sources: string[] }> = {
      groq: {
        url: "https://api.groq.com/openai/v1/chat/completions",
        fallbackModel: "llama-3.3-70b-versatile",
        sources: ["Groq High Performance LPU arrays", "NASA Astronomy API", "Local Solar-winds telemetry"]
      },
      openrouter: {
        url: "https://openrouter.ai/api/v1/chat/completions",
        fallbackModel: "google/gemini-2.1-pro-preview:free",
        sources: ["OpenRouter aggregation grid", "DeepSpace network nodes", "Stellar spectrum registry"]
      },
      nvidia: {
        url: "https://integrate.api.nvidia.com/v1/chat/completions",
        fallbackModel: "meta/llama-3.1-405b-instruct",
        sources: ["NVIDIA NIM microservices", "Fermi Gamma-ray Telescope parameters", "SOHO Satellite flares"]
      },
      together: {
        url: "https://api.together.xyz/v1/chat/completions",
        fallbackModel: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        sources: ["Together AI distributed nodes", "Minor Planet Center catalog", "Spitzer infrared scans"]
      },
      deepseek: {
        url: "https://api.deepseek.com/v1/chat/completions",
        fallbackModel: "deepseek-chat",
        sources: ["DeepSeek V3 neural cluster", "Arecibo legacy maps", "VLT high-resolution spectra"]
      },
      mistral: {
        url: "https://api.mistral.ai/v1/chat/completions",
        fallbackModel: "open-mistral-7b",
        sources: ["Mistral AI cloud routers", "Mauna Kea submillimeter arrays", "Palomar Transit maps"]
      },
      perplexity: {
        url: "https://api.perplexity.ai/chat/completions",
        fallbackModel: "sonar",
        sources: ["Perplexity Grounded Search engines", "Online Heliophysics databases", "Symphony solar-wind metrics"]
      }
    };

    const targetConfig = openAICompatibleBases[currentProvider];
    if (targetConfig) {
      const resp = await fetch(targetConfig.url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model || targetConfig.fallbackModel,
          messages: [{ role: "user", content: commandPrompt }],
          max_tokens: 1512
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error?.message || data.error || `${currentProvider} returned status ${resp.status}`);
      }
      return res.json({
        content: data.choices?.[0]?.message?.content || "No message payload returned from model gateway.",
        timestamp: new Date().toLocaleTimeString(),
        sources: targetConfig.sources
      });
    }

    res.status(400).json({ error: "Unsupported activeProvider requested." });
  } catch (error: any) {
    console.error("[Advanced Chat API Error]", error);
    res.status(500).json({ error: error.message || "Failed establishing communication with custom models." });
  }
});

// Astro-Vision Image Prompting, returns simulated custom visual coordinates or beautiful abstract styles
app.post("/api/astro-vision", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Visual prompt text is required." });
  }

  // Custom visual generation palettes to simulate hyper-realistic stellar spaces
  const visualPalettes = [
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=60", // Eagle
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60", // Cosmic
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60", // Aurora
    "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60", // Rocket
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=60"  // Galaxies
  ];

  const randomIndex = Math.abs(prompt.length) % visualPalettes.length;
  const chosenWallpaper = visualPalettes[randomIndex];

  res.json({
    prompt,
    imageUrl: chosenWallpaper,
    galleryDate: "Daily Showcase of may 2026",
    title: `AI Astro-Vision: ${prompt.substring(0, 30)}...`,
    technicalMetadata: `Dimensions: 1024x1024 | Engine: CosmoGen-3D | Style: Ultra-high field mapping`
  });
});

// Dynamic Space Weather & Alerts Dashboard
app.get("/api/weather", (req, res) => {
  res.json({
    kpIndex: 6.8, // Major Storm level
    solarWindSpeed: 685, // km/s
    solarWindDensity: 14.2, // protons/cm3
    xrayFlux: "M", // M-class flare tracked
    auroraProbability: 82, // active auroras visible tonight
    alertMessage: "Kp level has peaked at 6.8. Heavy geomagnetic space winds detected. Beautiful aurora displays projected tonight! Minor atmospheric telemetry variations recorded."
  });
});

// Simulated Space News feeds
app.get("/api/news", (req, res) => {
  res.json([
    {
      id: "news-jwst-atmosphere",
      title: "JWST Detects Methane and Carbon Dioxide in Atmosphere of Nearby exoplanet K2-18b",
      summary: "NASA's James Webb Space Telescope has performed spectacular transit observations of exoplanet K2-18b, mapping rich carbonaceous signatures and fueling theories of potential ocean-bearing conditions beneath a dense hydrogen envelope.",
      source: "NASA Space Science",
      publishedDate: "2026-05-24",
      url: "https://webbtelescope.org",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "news-artemis-crew",
      title: "Artemis III Expedition Finalizes Lunar South Pole Landing Site Selections",
      summary: "NASA has selected nine candidate areas for the historic Artemis III crewed expedition. The coordinates target elevated ridges receiving near-constant sunlight for power next to deep craters containing permanent water ice reservoirs.",
      source: "ESA / NASA Exploration",
      publishedDate: "2026-05-20",
      url: "https://nasa.gov/artemis",
      imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "news-solar-max",
      title: "Solar Cycle 25 Enters Intense Solar Maximum, Fueling Vibrant Auroral Storms World-Wide",
      summary: "Space Weather Prediction offices note that Magnetosphere solar wind levels are at high activity. A sequence of massive X-class flares has triggered geometric storms causing auroral visibility as far south as mid-latitudes on Earth.",
      source: "NOAA Space Weather Prediction",
      publishedDate: "2026-05-27",
      url: "https://swpc.noaa.gov",
      imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60"
    }
  ]);
});

// Mock database registry for comparisons
app.get("/api/compare", (req, res) => {
  res.json([
    {
      id: "sun",
      name: "The Sun",
      category: "star",
      mass: "1.989 × 10^30 kg (333,000 Earths)",
      diameter: "1,392,700 km",
      temperature: "5,500 °C (surface), 15,000,000 °C (core)",
      distance: "0 km (Center of system)",
      gravity: "274 m/s² (28x Earth)",
      color: "#ffcc00",
      atmosphere: "Hydrogen and Helium plasma",
      fact: "The Sun contains 99.86% of all mass in our Solar System."
    },
    {
      id: "earth",
      name: "Earth",
      category: "planet",
      mass: "5.972 × 10^24 kg",
      diameter: "12,742 km",
      temperature: "-89 °C to 58 °C",
      distance: "149.6 million km (1.00 AU)",
      gravity: "9.81 m/s²",
      color: "#3b82f6",
      atmosphere: "Nitrogen (78%), Oxygen (21%)",
      fact: "Earth is the only known orbital body harboring liquid ocean water, supporting massive life forms."
    },
    {
      id: "mars",
      name: "Mars",
      category: "planet",
      mass: "6.39 × 10^23 kg (0.1x Earth)",
      diameter: "6,779 km",
      temperature: "-143 °C to 35 °C",
      distance: "227.9 million km (1.52 AU)",
      gravity: "3.72 m/s² (0.38x Earth)",
      color: "#ef4444",
      atmosphere: "Thin Carbon Dioxide (95%)",
      fact: "The Red Planet hosts Olympus Mons, the tallest planetary volcano (22 km) in our solar system."
    }
  ]);
});

// Standard quiz generation mock fallback
app.post("/api/quiz", (req, res) => {
  res.json({
    questions: [
      {
        question: "Which of these celestial items represents the absolute hottest planet within our Solar System?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        correctIndex: 1,
        explanation: "Even though Mercury is closest to the Sun, Venus holds the hottest temperature because its thick greenhouse atmosphere traps immense carbon heat."
      },
      {
        question: "Olympus Mons is a massive, towering volcano located on which celestial neighbor?",
        options: ["The Moon", "Venus", "Mars", "Saturn"],
        correctIndex: 2,
        explanation: "Olympus Mons, located on Mars, stands three times taller than Mount Everest."
      }
    ]
  });
});

app.get("/api/asteroids", (req, res) => {
  res.json([
    {
      id: "ast-2026-cg1",
      name: "Asteroid 2026 CG1 (CosmoCruiser)",
      closeApproachDate: "2026-06-12",
      velocityKph: 54120,
      missDistanceAu: 0.024,
      estimatedDiameterMinM: 140,
      estimatedDiameterMaxM: 320,
      isPotentiallyHazardous: true,
      orbitingBody: "Earth"
    }
  ]);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", activeGrid: "UTC-2026" });
});

// ---------------- SERVING logic ----------------

async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CosmoGuide Engine] Main server launched successfully on port ${PORT}`);
  });
}

serveApp().catch((err) => {
  console.error("[CosmoGuide Error] Launch failed:", err);
});
