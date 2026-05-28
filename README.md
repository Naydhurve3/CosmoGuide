# 🌌 CosmoGuide

**AI-Powered Space Knowledge Companion** — A Multi-Provider, Interactive Space Exploration Cockpit

> **Created by: Nayan Dhurve** | Version: 2.0.0 (React/TypeScript Rewrite) | License: MIT

CosmoGuide is an interactive space exploration web application powered by **11 different AI providers**. It combines real-time 3D Kepler orbital simulations, live space weather tracking, interactive star charts, deep-space AI chat, astronomy quizzes, and generative space art into a single, immersive cockpit-style interface.

Unlike the original Python/Streamlit version, this rewrite is a fully client-rendered React + TypeScript SPA with an Express.js backend acting as an intelligent proxy/router between the UI and multiple AI providers.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [Multi-Provider AI System](#multi-provider-ai-system)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuring API Keys](#configuring-api-keys)
- [Supported Providers](#supported-providers)
- [Module Reference](#module-reference)
- [Data Flow & Working Principle](#data-flow--working-principle)
- [Security & Privacy](#security--privacy)
- [Development](#development)
- [License](#license)

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           CosmoGuide Architecture                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐   │
│  │   Browser     │     │  Express Server  │     │   AI Provider APIs   │   │
│  │  (React SPA)  │◄───►│   (Proxy Layer)  │◄───►│  (Gemini, Groq,      │   │
│  │               │     │                  │     │   Anthropic, etc.)   │   │
│  │  • Chat UI    │     │  • /api/chat     │     └──────────────────────┘   │
│  │  • 3D Sim     │     │  • /api/test-key │                                │
│  │  • Star Chart │     │  • /api/weather  │     ┌──────────────────────┐   │
│  │  • Quiz       │     │  • /api/launches │     │   Static Data        │   │
│  │  • Vault      │     │  • /api/news     │     │  (Mock/Synthetic)    │   │
│  │  • ...        │     │  • ...           │     └──────────────────────┘   │
│  └──────────────┘     └──────────────────┘                                │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    Browser Storage (localStorage)                   │   │
│  │  • cosmo_key_vault     → Encrypted (masked) API keys & models      │   │
│  │  • cosmo_active_provider → Currently selected AI provider          │   │
│  │  • cosmo_user_profile   → User identity & preferences              │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

The application follows a **thin-server architecture**:

- **Frontend (React SPA):** All UI rendering, state management, 3D simulations, and user interaction happen in the browser. The app uses a modular window system — each feature (chat, orbits, weather, etc.) is an independent panel that can be opened, minimized, maximized, or closed.
- **Backend (Express.js):** Acts as a lightweight API proxy. It receives requests from the frontend, forwards them to the appropriate AI provider using the user's API key, and returns the response. It also serves static mock data for demos (launches, weather, news, comparisons) and the built Vite frontend in production.
- **Local Storage:** API keys and user preferences are stored in the browser's `localStorage` — they never touch the server's file system or database.

---

## Key Features

### 🤖 Multi-Provider AI Chat
- **11 AI providers** — Google Gemini, Groq, Anthropic Claude, OpenRouter, NVIDIA NIM, Together AI, DeepSeek, Mistral AI, Cohere, Perplexity, Hugging Face
- **Three response styles** — Simple (layperson), Balanced (structured), Expert (technical/deep)
- **Real-time streaming** — Typing indicators, source citations, text-to-speech
- **Conversation memory** — Full chat history within the session

### 🌍 3D Planetary Orbital Simulator
- Real-time Kepler orbital mechanics with configurable planetary parameters
- Gravity simulation, orbital speed visualization, and camera controls
- Built with Canvas/Web API for smooth 60fps rendering

### 📡 Heliophysics Space Weather Tracker
- Real-time solar flare monitoring (Kp index, solar wind speed/density, X-ray flux)
- Aurora visibility probability forecasts
- Geomagnetic storm alerts

### ⭐ Tactical Star Map
- Celestial coordinate system (declination/right ascension)
- Interactive star chart with constellation overlays

### 🧠 Astronomy Quiz Engine
- Multiple-choice trivia with explanations and scoring
- Dynamic question pool covering astrophysics, planetary science, and cosmology

### 🎨 Astro Vision — Generative Space Art
- AI-powered celestial image synthesis
- High-resolution nebula, galaxy, and supernova wallpapers

### 🚀 Mission Control
- Live launch countdowns (SpaceX, NASA Artemis, ISRO Gaganyaan)
- Satellite tracking and mission status dashboard

### 🎂 Hubble Birthday Time Machine
- Discover what the Hubble/James Webb telescopes captured on your birthday
- Seasonal archive with high-resolution imagery

### 🔬 Celestial Scale Matrix (Compare Mode)
- Side-by-side comparison of planets, stars, and galaxies
- Physical properties: mass, diameter, temperature, gravity, atmosphere

### 🛡️ Conspiracy Debunker
- Science-based rebuttals of common space myths and hoaxes
- Peer-reviewed reasoning against flat Earth, moon landing denial, etc.

### 🌌 Personal Cosmos — Night Sky Guide
- Personalized rise/set times based on user coordinates
- Planetary visibility windows and stargazing recommendations

### 🏆 Gamification Center
- Cosmic Bingo challenges (5×5 daily activity grid)
- Speed Gauntlet — timed rapid-fire trivia
- Loyalty stamp calendar and badge progress tracking

### 🎮 Deep Space Toys
- 2D Verlet gravity simulator — launch custom satellites and watch orbital mechanics in action
- Scale of the Universe — scroll from atomic scales to the observable cosmos

### 🔊 Space Soundscape Generator
- Procedural audio synthesis of stellar phenomena
- Micro-frequency hums tuned to gravity, density, and magnetic field data

### 🧬 Cosmic Twin Matcher
- Biometric-style personality matching to celestial objects
- Matches user responses with asteroids, planets, or pulsars

### 🔐 Settings Portal (Vault)
- **Multi-provider API key management** (11 providers)
- Key testing/verification with real API calls
- Model scanning — batch-tests available models and identifies free vs paid options
- User profile management with avatar upload

### 🌐 Social Features
- One-click sharing to Twitter/X, Reddit, WhatsApp
- Newsletter subscription for launch alerts
- Exit-intent popup with free cosmic calendar download
- Floating cursor comet trail particles
- Ambient audio feedback (radar pings on interactions)

---

## Multi-Provider AI System

One of CosmoGuide's signature features is its **11-provider AI routing system**. Here's how it works:

### Provider Selection Flow

```
User opens Chat → ChatPanel reads activeProvider from localStorage
                         ↓
              Sends POST /api/chat-advanced with:
                • message
                • style (Simple/Balanced/Expert)
                • customProviders (all stored keys & models)
                • activeProvider (e.g., "google")
                         ↓
              Server extracts key for activeProvider
                         ↓
              ┌──── Key found in request? ────┐
              │           Yes      No          │
              │             ↓        ↓         │
              │        Use it    Fall back to  │
              │                   process.env  │
              │                      ↓         │
              │       ┌─── Key valid? ────┐    │
              │       │   Yes        No    │    │
              │       │    ↓           ↓   │    │
              │       │ Call API   Return   │    │
              │       │          error to  │    │
              │       │          user to   │    │
              │       │          configure  │    │
              │       │          via Vault  │    │
              └───────┴────────────────────┘    │
                         ↓
              Response → User sees AI reply
```

### Cascading Logic per Provider

The server handles each provider differently:

| Provider | API Type | Auth Header | Endpoint |
|----------|----------|-------------|----------|
| Google Gemini | SDK (`@google/genai`) | `apiKey` param | Native SDK |
| Anthropic | REST | `x-api-key` | `api.anthropic.com/v1/messages` |
| Cohere | REST | `Authorization: Bearer` | `api.cohere.com/v1/chat` |
| Hugging Face | REST | `Authorization: Bearer` | `api-inference.huggingface.co/models/{model}` |
| Groq, OpenRouter, NVIDIA, Together, DeepSeek, Mistral, Perplexity | OpenAI-compatible REST | `Authorization: Bearer` | Respective `/v1/chat/completions` |

Each provider can be independently tested via the Vault's **Test Connection Key** button, and models can be batch-scanned with the **Scan Available Models** diagnostic tool.

---

## System Architecture

```
CosmoGuide/
├── src/                          # Frontend source (React + TypeScript)
│   ├── App.tsx                   # Root component — window manager, routing, layout
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles, animations, custom theme
│   ├── types.ts                  # Shared TypeScript interfaces
│   └── components/               # All feature modules (17 panels)
│       ├── ChatPanel.tsx         # AI chat interface with style selector
│       ├── VaultPanel.tsx        # Settings Portal — API keys, profile, model scanning
│       ├── SolarSystem3D.tsx     # 3D Kepler orbital simulator
│       ├── StarChart.tsx         # Interactive celestial star map
│       ├── SpaceDataPanel.tsx    # Heliophysics weather & telemetry
│       ├── QuizPanel.tsx         # Astronomy trivia engine
│       ├── ComparePanel.tsx      # Celestial body comparison matrix
│       ├── AstroVision.tsx       # Generative space art
│       ├── MissionControl.tsx    # Launch trackers & mission status
│       ├── BirthdayTimeMachine.tsx # Hubble birthday archive
│       ├── PersonalCosmos.tsx    # Night sky guide & user preferences
│       ├── GamificationCenter.tsx # Bingo, speed gauntlet, badges
│       ├── DeepSpaceToys.tsx     # Gravity simulator & universe scale
│       ├── CosmicDebunker.tsx    # Myth-busting space conspiracies
│       ├── CosmicTwinQuiz.tsx    # Celestial personality matcher
│       ├── SoundscapeGenerator.tsx # Procedural space audio synthesis
│       └── SpaceBackground.tsx   # Parallax particle starfield
│
├── server.ts                     # Express backend — API routes, AI proxy, static serving
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite bundler configuration
├── .env.example                  # Environment variable template (optional)
├── .gitignore                    # Git exclusion rules
└── README.md                     # This file
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19 | Component-based user interface |
| **Language** | TypeScript ~5.8 | Type-safe development |
| **Bundler** | Vite 6 | Fast HMR & production builds |
| **Styling** | Tailwind CSS 4.1 | Utility-first responsive design |
| **Icons** | Lucide React | SVG icon library |
| **Fonts** | Inter, Space Grotesk, JetBrains Mono | Typography |
| **Backend** | Express.js 4.21 | API server & middleware |
| **AI SDK** | @google/genai 2.4 | Google Gemini integration |
| **Build Tool** | esbuild | Backend bundling |
| **Runtime** | tsx | TypeScript execution for dev |
| **Audio** | Web Audio API | Procedural sounds & TTS |

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or later (includes `npm`)
- A **free API key** from at least one supported AI provider (see [Supported Providers](#supported-providers))

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/Naydhurve3/CosmoGuide.git
cd CosmoGuide

# 2. Install dependencies
npm install

# 3. Start the development server (frontend + backend together)
npm run dev
```

The app will be available at **http://localhost:3000**.

### Production Build

```bash
# Build frontend + bundle backend
npm run build

# Start production server
npm start
```

---

## Configuring API Keys

CosmoGuide requires an API key from at least one AI provider to function. **No API keys are hardcoded or shipped with the repository** — every user must supply their own.

### Method 1: Settings Portal (Recommended)

This is the easiest way — no file editing required.

1. Open CosmoGuide in your browser at `http://localhost:3000`
2. Click the **Settings Portal** button in the top-right header
3. Scroll down to **Planetary API Endpoint Systems** → click **Configure Keys**
4. Select a provider from the dropdown (e.g., `Google Gemini Services`)
5. Paste your API key in the **Secret API key** field
6. Optionally select a specific model from the **Dynamic Model List**
7. Click **Test Connection Key** to verify your key works
8. Click **Set Active** on your configured provider to make it the active AI backend
9. Navigate to **Cosmic AI Core** chat and start asking questions!

Your keys are stored securely in your browser's `localStorage` and persist between sessions.

### Method 2: Environment Variables (Server Fallback)

Optionally, you can set fallback keys in a `.env` file in the project root:

```env
GEMINI_API_KEY="your_gemini_key"
GROQ_API_KEY="your_groq_key"
OPENROUTER_API_KEY="your_openrouter_key"
ANTHROPIC_API_KEY="your_anthropic_key"
```

> **Note:** Keys set via Settings Portal always take priority over `.env` keys. The `.env` fallback is useful for quick testing or when you don't want to re-enter keys after clearing browser data.

---

## Supported Providers

| # | Provider | Free Tier | API Key Sign-Up | Model Examples |
|---|----------|-----------|-----------------|----------------|
| 1 | **Google Gemini** | ✅ Free tier | [aistudio.google.com](https://aistudio.google.com) | Gemini 3.5 Flash, 3.1 Pro |
| 2 | **Groq** | ✅ Free tier | [console.groq.com](https://console.groq.com) | Llama 3.3 70B, Mixtral 8x7B |
| 3 | **OpenRouter** | ✅ Free models | [openrouter.ai](https://openrouter.ai) | Gemini 2.1 Pro Free, Llama 3 8B Free |
| 4 | **Anthropic Claude** | ❌ Paid only | [console.anthropic.com](https://console.anthropic.com) | Claude 3.5 Sonnet, Haiku, Opus |
| 5 | **NVIDIA NIM** | ✅ Free tier | [build.nvidia.com](https://build.nvidia.com) | Llama 3.1 405B, Nemotron 70B |
| 6 | **Together AI** | ✅ Free credits | [api.together.xyz](https://api.together.xyz) | Llama 3.1 70B, Mixtral 8x7B |
| 7 | **DeepSeek** | ✅ Free tier | [platform.deepseek.com](https://platform.deepseek.com) | DeepSeek Chat (V3), Coder |
| 8 | **Mistral AI** | ✅ Free tier | [console.mistral.ai](https://console.mistral.ai) | Mistral 7B, Mistral Large, Codestral |
| 9 | **Cohere** | ✅ Free tier | [dashboard.cohere.com](https://dashboard.cohere.com) | Command R+, Command R |
| 10 | **Perplexity** | ❌ Paid only | [docs.perplexity.ai](https://docs.perplexity.ai) | Sonar Reasoning, Sonar Pro |
| 11 | **Hugging Face** | ✅ Free inference | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | Llama 3.1 8B, Phi 3 Mini, Mistral 7B |

### Recommendation for New Users

Start with **Google Gemini** (free, generous quota, fast) or **Groq** (free, extremely fast inference on Llama models). Both are one-click signup with no credit card required.

---

## Module Reference

All 17 feature modules are accessible from the main dashboard grid or via the **System HUD** indicators at the top of the app.

| Module ID | Name | Category | Description |
|-----------|------|----------|-------------|
| `orbits` | 3D Planetary Kepler Simulator | Orbital Mechanics | Live planetary physics with configurable orbits |
| `starchart` | Tactical Star Map | Celestial Cartography | Astronomical coordinate plotting & alignment |
| `chats` | AI Cosmic Assistant Intelligence | Generative AI | Multi-provider AI chat with 3 response styles |
| `telemetries` | Heliophysics Space Weather Tracker | Solar Telemetry | Solar flare monitoring, Kp index, aurora forecasts |
| `quiz` | Astronomical Knowledge Trivia | Gamification | Multiple-choice astrophysics challenges |
| `compare` | Celestial Scale Matrix | Comparative Systems | Side-by-side planet/star/galaxy comparison |
| `vault` | Telemetry Credentials Vault & Profile Settings | Identity & Key Services | API key management, user profile, model scanning |
| `astroart` | Astro Vision Neural Wallpaper | Generative Art | AI-powered space image synthesis |
| `cosmictwin` | Adaptive Celestial Twin Matcher | Biometric Signatures | Personality → celestial object matching |
| `birthday` | Hubble Observer Time Gazette | Historic Archives | Hubble/Webb birthday image discovery |
| `mission` | Observatory Mission Tracker | Satellites & Stations | Live launch countdowns & mission tracking |
| `debunker` | Conspiracy Debunker Registry | Scientific Peer-Review | Myth-busting with scientific reasoning |
| `ambient` | Space Sound Hum Synth | Soundscapes | Procedural stellar audio generation |
| `personalcosmos` | Personalized Stellar Cockpit | Hyper-Personalization | Night sky guide, rise/set times, coordinates |
| `gamification` | Cosmic Bingo & Speed Gauntlet | Gamification & Badges | Daily challenges, trivia speedrun, stamps |
| `deepspace` | Kepler Gravity Simulator & Scale of Universe | Interactive Sandbox | 2D gravity simulator, cosmic scale scroll |

---

## Data Flow & Working Principle

### 1. Application Initialization

```
npm run dev → tsx server.ts
  ├── Express listens on port 3000
  ├── Vite middleware serves React SPA in dev mode
  └── SPA loads in browser → App.tsx mounts
       ├── SpaceBackground (parallax particles) starts
       ├── Weather alert fetched via GET /api/weather
       ├── User profile loaded from localStorage
       ├── API key vault loaded from localStorage
       └── Active provider synced from localStorage
```

### 2. Chat Flow (End-to-End)

```
User types question → ChatPanel
  → Reads keys from localStorage (cosmo_key_vault)
  → Reads active provider (cosmo_active_provider)
  → POST /api/chat-advanced { message, style, customProviders, activeProvider }
  → Server extracts key for provider
     ├── If missing → returns 400 "Configure key in Vault"
     └── If present → calls provider's API
          ├── Google Gemini → @google/genai SDK
          ├── Anthropic → REST to api.anthropic.com
          ├── OpenAI-compatible (Groq, etc.) → REST to respective /v1/chat/completions
          └── Response parsed → { content, timestamp, sources }
  → ChatPanel appends model response to message list
  → Auto-scroll to latest message
```

### 3. API Key Verification Flow

```
User clicks "Test Connection Key" in VaultPanel
  → POST /api/test-key { provider, apiKey, model }
  → Server sends minimal ping to provider's API
     ├── Success → status: "active", testLogs: "Connected!"
     └── Failure → status: "error", testLogs: error message
  → Status displayed in Vault UI (green/red indicator)
```

### 4. Model Scanning Flow

```
User clicks "Scan Available Models" in VaultPanel
  → POST /api/test-models { provider, apiKey }
  → Server fetches model list from provider (or uses fallback static list)
  → Batch tests each model (up to 15) with timeout
  → Returns { id, name, working, isFree, error }
  → Vault displays sorted results:
     ├── Working free models first (green)
     ├── Working paid models (amber)
     └── Failed models (red with error reason)
  → User can click "Select" to activate a specific model
```

### 5. Window Management System

```
Each module is a "window" managed by App.tsx:
  → activeTab: Currently focused window (or null for desktop)
  → minimizedWindows: Array of minimized window IDs
  → maximizedWindow: Currently maximized window (or null)

User actions:
  → Click module card → handleLaunch(tab) → sets activeTab
  → Click "Minimize" → handleMinimize(tab) → adds to minimizedWindows, clears activeTab
  → Click "Maximize" → handleMaximizeToggle(tab) → fullscreen overlay
  → Click "Close" → handleCloseWindow(tab) → removes from activeTab + minimizedWindows
  → Click dock icon → handleRestore(tab) → removes from minimizedWindows, sets activeTab
```

---

## Security & Privacy

- **No API keys are stored in the repository.** The `.gitignore` explicitly excludes all `.env*` files (except `.env.example`).
- **API keys are stored in browser localStorage only.** They never transit through a database or file system on the server.
- **The server acts as a pass-through proxy** — it forwards your key to the AI provider and returns the response. It does not log or persist keys.
- **All API calls are made server-side** to avoid CORS issues and protect your key from client-side network inspection.
- **No user data is collected or tracked.** No analytics, no cookies, no telemetry back to any third party.
- **Chat history is ephemeral** — it exists only in the current browser session and is lost on page refresh.

---

## Development

### Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build frontend (`vite build`) + bundle backend (`esbuild`) |
| `npm start` | Start production server from `dist/` |
| `npm run lint` | Type-check with `tsc --noEmit` |

### Adding a New Feature Module

1. Create a new component in `src/components/`
2. Add its metadata to the `MODULE_METADATA` array in `App.tsx`
3. Add a route in the active tab render section of `App.tsx`
4. Import and register the component

### Adding a New AI Provider

1. Add the provider to the `providers` state in `VaultPanel.tsx` (with default model)
2. Add the provider to the `select` dropdown in the API key config UI
3. Add the provider to the API key test logic in `server.ts` (`/api/test-key` endpoint)
4. Add the provider to the chat routing logic in `server.ts` (`/api/chat-advanced` endpoint)
5. Add static model listings in `/api/models` and `/api/test-models`

---

## License

MIT License — Feel free to use, modify, and distribute for learning and portfolio purposes.
