# CosmoGuide

**AI-Powered Space Knowledge Companion** — A Multi-Provider, Interactive Space Exploration Cockpit

Created by: **Nayan Dhurve** | Version: 2.0.0 | License: MIT

CosmoGuide is an interactive space exploration web application powered by **11 different AI providers**. It combines real-time 3D Kepler orbital simulations, live space weather tracking, interactive star charts, deep-space AI chat, astronomy quizzes, and generative space art into a single, immersive cockpit-style interface.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Hybrid API Key Model](#hybrid-api-key-model)
- [Key Features](#key-features)
- [Multi-Provider AI System](#multi-provider-ai-system)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Deployment Guide](#deployment-guide)
- [Getting Started](#getting-started)
- [Configuring API Keys](#configuring-api-keys)
- [Supported Providers](#supported-providers)
- [Module Reference](#module-reference)
- [Data Flow & Working Principle](#data-flow--working-principle)
- [Security & Privacy](#security--privacy)
- [Development](#development)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          CosmoGuide Architecture                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐     │
│  │   Browser     │     │  Express Server  │     │   AI Provider APIs   │     │
│  │  (React SPA)  │◄───►│   (Proxy Layer)  │◄───►│  (Gemini, Groq,      │     │
│  │               │     │   + Rate Limiter │     │   Anthropic, etc.)   │     │
│  │  • Chat UI    │     │                  │     └──────────────────────┘     │
│  │  • 3D Sim     │     │  • /api/chat     │                                  │
│  │  • Star Chart │     │  • /api/test-key │     ┌──────────────────────┐     │
│  │  • Quiz       │     │  • /api/weather  │     │   Static Data        │     │
│  │  • Vault      │     │  • /api/launches │     │  (Mock/Synthetic)    │     │
│  │  • ...        │     │  • /api/news     │     └──────────────────────┘     │
│  └──────────────┘     └──────────────────┘                                   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Browser Storage (localStorage)                     │   │
│  │  • cosmo_key_vault       → API keys & models                         │   │
│  │  • cosmo_active_provider → Currently selected AI provider            │   │
│  │  • cosmo_user_profile    → User identity & preferences                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

The application follows a **thin-server architecture** with a hybrid API key model:

- **Frontend (React SPA):** All UI rendering, 3D simulations, and state management happen in the browser.
- **Backend (Express.js):** Acts as a lightweight API proxy with built-in rate limiting for demo users.
- **Local Storage:** API keys and preferences are stored in the browser only.

---

## Hybrid API Key Model

CosmoGuide uses a **three-tier hybrid model** that balances user experience with security:

```
User sends a chat message
         │
         ▼
┌─────────────────────────────────────┐
│  Does user have their OWN API key   │
│  saved in the Vault (localStorage)? │
└─────────────────────────────────────┘
         │
    ┌────┴────┐
    │ YES    NO
    ▼        ▼
┌────────┐  ┌─────────────────────────────────┐
│ Use    │  │ Is server env var available      │
│ their  │  │ (process.env.GEMINI_API_KEY)?    │
│ key    │  └─────────────────────────────────┘
│ No     │           │
│ limits │     ┌─────┴─────┐
└────────┘     │ YES       NO
               ▼           ▼
        ┌─────────────────┐  ┌──────────────────────────────┐
        │ Use server key  │  │ Return error: configure your │
        │ with rate limit │  │ own key in Vault             │
        │ 50 req/IP/day   │  └──────────────────────────────┘
        │ Show DEMO badge │
        └─────────────────┘
```

### Tier Breakdown

| Tier | Who Pays | Rate Limit | UI Indicator | Use Case |
|------|----------|------------|-------------|----------|
| **User Key** | The visitor (their own API key) | None | Provider name badge | Power users, regulars |
| **Demo Key** | You (server env var) | 50 requests/IP/day | "DEMO" badge + banner | New users trying the app |
| **No Key** | N/A | N/A | Error message | User must configure a key |

### Why This Approach?

- **New users can instantly try the app** without any setup friction (50 free chats)
- **Your API key is never exposed** to the browser — it stays server-side
- **Rate limiting prevents surprise bills** — even with 1,000 daily users, you stay within Gemini's free tier
- **Power users add their own key** — they bypass limits and you pay nothing

---

## Key Features

### Multi-Provider AI Chat
- **11 AI providers** — Google Gemini, Groq, Anthropic Claude, OpenRouter, NVIDIA NIM, Together AI, DeepSeek, Mistral AI, Cohere, Perplexity, Hugging Face
- **Three response styles** — Simple (layperson), Balanced (structured), Expert (technical/deep)
- Real-time typing indicators, source citations, text-to-speech
- Full chat history within the session

### 3D Planetary Orbital Simulator
- Real-time Kepler orbital mechanics with configurable planetary parameters
- Gravity simulation, orbital speed visualization, camera controls
- Built with Canvas/Web API for smooth 60fps rendering

### Heliophysics Space Weather Tracker
- Solar flare monitoring (Kp index, solar wind speed/density, X-ray flux)
- Aurora visibility probability forecasts
- Geomagnetic storm alerts

### Tactical Star Map
- Celestial coordinate system (declination/right ascension)
- Interactive star chart with constellation overlays

### Astronomy Quiz Engine
- Multiple-choice trivia with explanations and scoring
- Dynamic question pool covering astrophysics, planetary science, cosmology

### Astro Vision — Generative Space Art
- AI-powered celestial image synthesis
- High-resolution nebula, galaxy, and supernova wallpapers

### Mission Control
- Live launch countdowns (SpaceX, NASA Artemis, ISRO Gaganyaan)
- Satellite tracking and mission status dashboard

### Hubble Birthday Time Machine
- Discover what Hubble/James Webb captured on your birthday
- Seasonal archive with high-resolution imagery

### Celestial Scale Matrix (Compare Mode)
- Side-by-side comparison of planets, stars, and galaxies
- Physical properties: mass, diameter, temperature, gravity, atmosphere

### Settings Portal (Vault)
- Multi-provider API key management (11 providers)
- Key testing/verification with real API calls
- Model scanning — batch-tests available models, identifies free vs paid options
- One-click "Get Free Key" links to provider signup pages
- User profile management with avatar upload

### And More...
- **Conspiracy Debunker** — Science-based rebuttals of space myths
- **Personal Cosmos** — Night sky guide with personalized rise/set times
- **Gamification Center** — Cosmic Bingo, Speed Gauntlet, badges
- **Deep Space Toys** — 2D gravity simulator, Scale of the Universe
- **Space Soundscape Generator** — Procedural audio synthesis
- **Cosmic Twin Matcher** — Personality matching to celestial objects

---

## Multi-Provider AI System

One of CosmoGuide's signature features is its **11-provider AI routing system**.

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
              │        Use it    Rate-limited  │
              │                   server env   │
              │                   fallback     │
              │                      ↓         │
              │       ┌─── Key valid? ────┐    │
              │       │   Yes        No    │    │
              │       │    ↓           ↓   │    │
              │       │ Call API   Return   │    │
              │       │          error to  │    │
              │       │          user      │    │
              └───────┴────────────────────┘    │
                         ↓
              Response → User sees AI reply
                         ↓
              Response includes mode field:
                "user" — using visitor's own key
                "demo" — using server key (rate-limited)
```

### Provider Routing

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
│       ├── ChatPanel.tsx         # AI chat interface with demo mode indicator
│       ├── VaultPanel.tsx        # Settings Portal — API keys, profile, free key links
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
├── server.ts                     # Express backend — API proxy, rate limiter, static serving
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

## Deployment Guide

CosmoGuide is designed for easy deployment on **Render** (free tier supported).

### Deploy on Render

1. Push your code to a GitHub repository
2. Go to [render.com](https://render.com) → Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your `CosmoGuide` repository
5. Fill in the settings:

| Setting | Value |
|---------|-------|
| **Name** | `cosmoguide` (or any) |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free |

6. Click **Create Web Service**
7. After deployment (~2-3 min), your app is live at `https://cosmoguide.onrender.com`

### Environment Variables (Optional)

Set these in Render dashboard → Environment to enable the **demo mode** fallback:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

When set, new visitors get 50 free chat requests/day using this key before being prompted to add their own.

### Custom Domain

Render supports custom domains with free SSL. Go to your service dashboard → **Settings** → **Custom Domain**.

### Preventing Cold Starts (Free Tier)

The free Render tier spins down after 15 min of inactivity. Prevent this with a free cron job:
- Create an account at [cron-job.org](https://cron-job.org) (free)
- Set it to ping `https://cosmoguide.onrender.com/api/health` every 14 minutes
- This keeps your app warm at no cost

### Updating After Deployment

Every `git push` to your main branch automatically triggers a new build on Render:

```bash
git add .
git commit -m "your changes"
git push origin main
# Render auto-deploys in ~2 min
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (includes npm)
- A free API key from at least one AI provider

### Installation

```bash
git clone https://github.com/Naydhurve3/CosmoGuide.git
cd CosmoGuide
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Configuring API Keys

CosmoGuide requires an API key from at least one AI provider to function. **No API keys are hardcoded or shipped with the repository.**

### Method 1: Settings Portal (Recommended)

1. Open CosmoGuide → Click **Settings Portal** (top-right header)
2. Scroll to **Planetary API Endpoint Systems** → Click **Configure Keys**
3. Select a provider (e.g., `Google Gemini Services`)
4. Paste your API key → Select a model → Click **Test Connection Key**
5. Click **Set Active** to make it the active AI backend
6. Navigate to **Cosmic AI Core** chat and start asking questions!

Your keys are stored securely in browser `localStorage` and persist between sessions.

### Method 2: Environment Variables (Server Fallback — For Demo Mode)

Optionally set fallback keys in Render dashboard or `.env` file:

```
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
```

These are used as rate-limited demo fallback when a visitor hasn't configured their own key (50 requests/IP/day).

---

## Supported Providers

| # | Provider | Free Tier | Sign-Up | Models |
|---|----------|-----------|---------|--------|
| 1 | Google Gemini | Free | [aistudio.google.com](https://aistudio.google.com) | Gemini 3.5 Flash, 3.1 Pro |
| 2 | Groq | Free | [console.groq.com](https://console.groq.com) | Llama 3.3 70B, Mixtral 8x7B |
| 3 | OpenRouter | Free models | [openrouter.ai](https://openrouter.ai) | Gemini 2.1 Pro Free, Llama 3 8B Free |
| 4 | Anthropic Claude | Paid | [console.anthropic.com](https://console.anthropic.com) | Claude 3.5 Sonnet, Haiku, Opus |
| 5 | NVIDIA NIM | Free | [build.nvidia.com](https://build.nvidia.com) | Llama 3.1 405B, Nemotron 70B |
| 6 | Together AI | Free credits | [api.together.xyz](https://api.together.xyz) | Llama 3.1 70B, Mixtral 8x7B |
| 7 | DeepSeek | Free | [platform.deepseek.com](https://platform.deepseek.com) | DeepSeek Chat (V3), Coder |
| 8 | Mistral AI | Free | [console.mistral.ai](https://console.mistral.ai) | Mistral 7B, Mistral Large, Codestral |
| 9 | Cohere | Free | [dashboard.cohere.com](https://dashboard.cohere.com) | Command R+, Command R |
| 10 | Perplexity | Paid | [docs.perplexity.ai](https://docs.perplexity.ai) | Sonar Reasoning, Sonar Pro |
| 11 | Hugging Face | Free inference | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | Llama 3.1 8B, Phi 3 Mini, Mistral 7B |

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
  ├── Express listens on port 3000 (or $PORT in production)
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
     ├── Has user key? → Use it (no limits)
     ├── No user key? → Rate-limited server env fallback (50/IP/day)
     │                   → Sets X-CosmoGuide-Mode: demo header
     └── No key at all? → Returns error: configure in Vault
  → API call to provider → Response with mode field
  → ChatPanel appends response + shows DEMO badge if applicable
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
  → Server fetches model list (or uses static fallback)
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
  → Click "Minimize" → handleMinimize(tab) → adds to minimizedWindows
  → Click "Maximize" → handleMaximizeToggle(tab) → fullscreen overlay
  → Click "Close" → handleCloseWindow(tab) → removes from activeTab
  → Click dock icon → handleRestore(tab) → removes from minimizedWindows
```

---

## Security & Privacy

- **No API keys are stored in the repository.** `.gitignore` excludes all `.env*` files.
- **API keys are stored in browser localStorage only.** Never on the server.
- **Demo keys stay server-side.** The `X-CosmoGuide-Mode: demo` header tells the client it's using a shared key, but the key itself is never sent to the browser.
- **Rate limiting prevents abuse.** Each IP gets 50 demo requests/day. Resets daily.
- **Server acts as a pass-through proxy.** Keys are forwarded to AI providers and not logged.
- **No user data is collected or tracked.** No analytics, cookies, or telemetry.
- **Chat history is ephemeral.** Lost on page refresh.

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
6. Add the provider to `processEnvKey()` in `server.ts` for demo mode support

---
