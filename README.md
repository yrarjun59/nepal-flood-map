# Nepal Glacial Flood — Live Situation Map

> Real-time mapping and situation dashboard for the **August 26, 2026 Nepal glacial flood** (Bhote Koshi / Lhende Khola event).

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://nepal-flood-map.vercel.app)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/nepal-flood-map/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8)](https://web.dev/progressive-web-apps/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com)

---

## 🌊 Event Overview

On **August 26, 2026 at 02:52:10 UTC (08:37 NST)**, a combined bedrock-and-glacier collapse on the **Lhende Khola** (tributary of the Bhote Koshi) near the Nepal-Tibet border triggered a catastrophic glacial lake outburst flood (GLOF). The surge destroyed the Nepal-China Friendship Bridge at Rasuwagadhi, devastated settlements along the Bhote Koshi → Trishuli → Narayani river corridor (~300 km), and impacted an estimated **90,000+ people**.

**Verified figures (as of Aug 29, 2026):**
- **584 deaths** (579 Nepal + 5 Tibet)
- **2,600+ missing** (1,900 Nepal + 700 foreigners including 90 Americans, 38 Australians)
- **3,000+ rescued** via helicopter
- **19 bridges destroyed**, **40 km roads washed away**
- **430 MW hydropower lost** (~1/8 of Nepal's capacity)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Interactive Map** | Leaflet + OpenStreetMap (no API key required). Animated flood flow path, severity-coded markers, clickable popups with coordinates & details. |
| **Live Dashboard** | Auto-refreshes every 60s. Deaths, missing, rescued, bridges, roads, power loss. GDACS secondary event alerts. Nationality breakdown chart (Recharts). |
| **Satellite Comparison** | Before/after slider using Sentinel-2 imagery (Copernicus Programme). Pre-flood: Aug 20 → Post-flood: Aug 28. |
| **River Gauge Data** | Real-time water levels from Nepal DHM (Bahrabise/Bhote Koshi, Benighat/Trishuli, Narayanghat/Narayani, Cheughat/Budhi Gandaki). |
| **Live News Feed** | Free RSS aggregation from ABC News, NBC News, CBS News, The Watchers, EarthSky — **no API key needed**. |
| **Map Layers Panel** | Toggle: Flood extent (Copernicus/UN-SAT), Critical infrastructure (OSM), Evacuation routes, Population density (WorldPop), Landslide risk (ICIMOD). |
| **Event Timeline** | 9 verified events (Aug 26–29) with staggered animations, sources cited per event. |
| **Coordinate Table** | Sortable, filterable, copy lat/lng, CSV export (9 locations + origin). |
| **Data Export** | GeoJSON (QGIS/ArcGIS), KML (Google Earth), CSV, PDF situation report. |
| **PWA / Offline** | Installable, works offline via service worker, cached map tiles & static data. |
| **Field Worker Guide** | `FIELD_GUIDE.md` — GPS/QGIS/Google Earth usage, coordinate export, offline install, troubleshooting. |

---

## 🏗 Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── cron/route.ts           # Vercel cron (every 10 min)
│   │   ├── refresh/route.ts        # Multi-source data pipeline
│   │   ├── rss-aggregate/route.ts  # Free RSS news aggregator
│   │   └── dhm-gauges/route.ts     # DHM Nepal river gauges
│   ├── page.tsx                    # Full dashboard
│   └── layout.tsx                  # PWA metadata, service worker
├── components/
│   ├── LeafletFloodMap.tsx
│   ├── LiveDashboard.tsx
│   ├── SatelliteComparison.tsx
│   ├── RiverGaugeData.tsx
│   ├── RSSNewsAggregator.tsx
│   ├── FloodExtentOverlay.tsx
│   ├── FloodTimeline.tsx
│   ├── CoordinateTable.tsx
│   ├── DataExport.tsx
│   └── AlertBanner.tsx
├── data/
│   ├── floodData.ts                # Verified static data (Aug 29 2026)
│   └── dataSources.ts              # 12-source priority registry
├── lib/gdacs.ts                    # UN GDACS RSS poller
└── types/flood.ts                  # TypeScript definitions
```

---

## 🔄 Data Pipeline (All Free — No Keys Required)

| Priority | Source | Type | Auth | What it Provides |
|----------|--------|------|------|------------------|
| 1 | **BIPAD** (Nepal Govt) | JSON REST API | None | Official casualty figures |
| 2 | **ReliefWeb** (UN OCHA) | JSON REST API | None (appname) | UN situation reports |
| 3 | **RSS News** (ABC, NBC, CBS, Watchers, EarthSky) | RSS/XML | None | Live news aggregation |
| 4 | **NewsAPI.org** | JSON REST API | Optional (free 100/day localhost) | Curated news articles |
| 5 | **Google Custom Search** | JSON REST API | Optional (free 100/day) | Web search results |
| 6 | **Free LLM** (NVIDIA NIM / Groq / Together / OpenRouter) | OpenAI-compatible | Optional | News summarization fallback |
| 7 | **Static Fallback** | Local TS | — | Verified Aug 29 2026 data |

> **Gemini API is the primary LLM** — the app uses Gemini 1.5 Flash with 7 API keys for automatic rate-limit fallback. The app runs fully free using RSS as primary live news source and Gemini as the AI summarization layer.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn

### Install & Run
```bash
git clone https://github.com/yrarjun59/nepal-flood-map.git
cd nepal-flood-map
npm install
npm run dev
```
Open http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables (optional):
   - `ANTHROPIC_API_KEY` — for LLM news fallback (optional)
   - `NVIDIA_NIM_API_KEY` — for free LLM alternative (optional)
   - `GROQ_API_KEY` — for free LLM alternative (optional)
   - `NEWS_API_KEY` — for NewsAPI.org news aggregation (optional)
   - `GOOGLE_API_KEY1` + `GOOGLE_CX` — for Google Custom Search (optional)
   - `CRON_SECRET` — `openssl rand -hex 32` (for Vercel cron)
   - `NEXT_PUBLIC_BASE_URL` — your deployment URL
4. Deploy — cron runs every 10 minutes automatically

---

## 🌐 Free LLM Alternatives (Gemini 1.5 Flash — Primary LLM)

The dashboard uses **Google Gemini 1.5 Flash** as its primary LLM for AI news summarization, with 7 API keys configured for automatic rate-limit fallback (1,500 req/day per key = 10,500 req/day total).

### News Aggregation APIs

| Provider | Free Tier | Setup |
|----------|-----------|-------|
| **NewsAPI.org** | ✅ 100 req/day (localhost only) | Register at `newsapi.org/register` → set `NEWS_API_KEY` |
| **Google Custom Search** | ✅ 100 req/day free | API key at `console.cloud.google.com`, CX at `programmablesearchengine.google.com` → set `GOOGLE_API_KEY1` + `GOOGLE_CX` |

### LLM Providers (OpenAI-compatible)

| Provider | Free Tier | Models | Setup |
|----------|-----------|--------|-------|
| **NVIDIA NIM** | ✅ Generous | Nemotron-3-Ultra, Llama-3.1, Mixtral | Sign up at `build.nvidia.com`, get API key |
| **Groq** | ✅ 14,400 req/day | Llama-3.1-70B, Mixtral-8x7B | `console.groq.com` |
| **Together AI** | ✅ $1 free credit | Llama-3.1, Mixtral, Qwen | `api.together.xyz` |
| **OpenRouter** | ✅ Free models | Various | `openrouter.ai` |

### Quick Setup (NVIDIA NIM — Recommended)
```bash
# 1. Get free API key from https://build.nvidia.com/explore/discover
# 2. Add to .env.local:
NVIDIA_NIM_API_KEY=your_key_here
NVIDIA_NIM_BASE_URL=https://integrate.api.nvidia.com/v1
```

The code auto-detects available keys and uses the first working provider.

---

## 📱 Field Worker Usage

The dashboard is designed for **offline field use**:

1. **Visit** the dashboard URL on mobile (Chrome/Safari)
2. **Add to Home Screen** → installs as PWA
3. **First load** while online → caches all static data & map tiles
4. **After installation** → works without internet

### Export for GIS
- **GeoJSON** → QGIS / ArcGIS: `Layer → Add Layer → Add Vector Layer`
- **KML** → Google Earth: `File → Open → .kml`
- **CSV** → Excel / database import
- **PDF** → Print for coordination meetings

### Coordinates
Copy from Coordinate Table → paste into GPS/Garmin as `lat,lng` (WGS84).

See `FIELD_GUIDE.md` for full instructions.

---

## 📊 Data Sources & Verification

| Source | Authority | Verification |
|--------|-----------|--------------|
| Nepal Police | ⭐⭐⭐⭐⭐ Primary | Official statements |
| BIPAD Portal | ⭐⭐⭐⭐⭐ Govt API | Real-time incident data |
| NDRRMA | ⭐⭐⭐⭐⭐ Govt | Daily SITREPs |
| ReliefWeb (UN) | ⭐⭐⭐⭐ | Aggregated UN reports |
| GDACS (UN/JRC) | ⭐⭐⭐⭐ | Secondary event alerts |
| USGS | ⭐⭐⭐⭐⭐ | M5.2 landslide seismic signal |
| ICIMOD | ⭐⭐⭐⭐ | Glacier collapse confirmation |
| DHM Nepal | ⭐⭐⭐⭐ | River gauge data |
| Copernicus EMS | ⭐⭐⭐⭐ | Satellite flood extent |
| Major News | ⭐⭐⭐ | ABC, NBC, CBS, Reuters, AP |

> **All figures are provisional.** Nepal Police / BIPAD are highest authority. Dashboard auto-refreshes every 60s.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Map | Leaflet + OpenStreetMap (no API key) |
| Charts | Recharts |
| PWA | Service Worker + Web App Manifest |
| APIs | BIPAD, ReliefWeb, DHM Nepal, GDACS, RSS feeds |
| News APIs | NewsAPI.org, Google Custom Search (optional) |
| Optional LLM | NVIDIA NIM / Groq / Together / OpenRouter (OpenAI-compatible) |

---

## 📁 Project Structure

```
nepal-flood-map/
├── public/
│   ├── sw.js              # Service worker
│   ├── manifest.json      # PWA manifest
│   └── icons/             # PWA icons
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── data/              # Static data & source registry
│   ├── lib/               # Utilities (GDACS)
│   └── types/             # TypeScript types
├── docs/agents/           # Agent configuration (issue tracker, triage, domain)
├── .scratch/              # Local markdown issue tracker
├── FIELD_GUIDE.md         # Field worker instructions
├── AGENTS.md              # Agent configuration
└── vercel.json            # Vercel cron config
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-layer`
3. Make changes following existing patterns
4. Run `npm run build` to verify
5. Submit a PR

### Adding Data Sources
Add to `src/data/dataSources.ts` following the registry pattern, then update the refresh pipeline in `src/app/api/refresh/route.ts`.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Nepal Police, Nepal Army, NDRRMA** — official data
- **BIPAD Portal** — Nepal's disaster management platform
- **UN OCHA ReliefWeb, GDACS** — international coordination
- **USGS, ICIMOD** — scientific verification
- **DHM Nepal** — river gauge data
- **Copernicus EMS / ESA** — satellite imagery
- **ABC News, NBC News, CBS News, The Watchers, EarthSky** — live reporting
- **OpenStreetMap contributors** — base map tiles
- **Leaflet, Recharts, Next.js communities** — open source tools

---

## 📞 Emergency Contacts

- **Nepal Police Emergency:** 100
- **NDRRMA:** +977-1-4262636
- **DHM Flood Forecasting:** +977-1-4470393

---

*Built with Next.js · Tailwind · Leaflet · Recharts · Free APIs only*  
*Generated by Hermes Agent (Nous Research)*  
*Data verified: August 29, 2026*