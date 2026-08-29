# Nepal Glacial Flood — Live Situation Map

An interactive, auto-refreshing situation dashboard for the **August 26, 2026 Nepal
glacial flood** (Bhote Koshi / Lhende Khola), built with Next.js. It maps the flood
path with real coordinates, shows verified casualty/rescue statistics, an event
timeline, and a coordinate table — and can pull fresh figures from official and
news sources via an agentic refresh pipeline.

> ⚠️ **Not an official source.** Figures are provisional and reflect reports current
> as of late August 2026. Always verify against the Nepal Police, NDRRMA, and
> BIPAD before acting on any number. This is a data-visualisation / awareness tool.

---

## Features

- **Interactive map** — flood origin, all affected locations, and the animated
  river-flow path (Mapbox GL JS, with a free Leaflet + OpenStreetMap fallback when
  no Mapbox token is set).
- **Live dashboard** — deaths, missing, rescued, impacted, power loss, bridges
  destroyed, and missing-by-nationality breakdown (Recharts).
- **Event timeline** — chronological sequence of the event (collapse → border
  crossing → downstream spread → ongoing alerts).
- **Coordinate table** — every mapped location with lat/lng, district, and severity.
- **Alert banner** — critical / warning / info alerts (e.g. the Tibet barrier-lake
  secondary event).
- **Agentic data refresh** — `POST /api/refresh` tries sources in priority order
  (BIPAD Nepal Govt → UN OCHA ReliefWeb → Anthropic web_search) and falls back to
  static verified data on failure. Never returns a 5xx.
- **GDACS poller** — watches the UN/JRC Global Disaster Alert RSS feed for Nepal
  events.
- **Vercel cron** — triggers the refresh every 10 minutes (see `vercel.json`).

## Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Mapbox GL JS /
Leaflet · Recharts · Anthropic SDK (`@anthropic-ai/sdk`, `web_search` tool).

## Getting started

Requirements: **Node.js 18+** and **npm**.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#    then edit .env.local and fill in the values (see below)

# 3. Run the dev server
npm run dev
#    open http://localhost:3000
```

### Build & start (production)

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes* | Powers the agentic live refresh (`web_search`). Get one at [console.anthropic.com](https://console.anthropic.com). |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Mapbox map token. If empty, the app uses Leaflet + OpenStreetMap (free, no key). |
| `CRON_SECRET` | No** | Bearer secret protecting `/api/cron`. Generate with `openssl rand -hex 32`. |
| `NEXT_PUBLIC_BASE_URL` | No** | Base URL used by the cron route to self-call `/api/refresh` on deploy. |
| `NASA_FIRMS_MAP_KEY` | No | Optional NASA FIRMS satellite-imagery layer. Free key at [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/). |

\* Without `ANTHROPIC_API_KEY` the app still runs fully — it serves the bundled
static verified dataset and the BIPAD/ReliefWeb/ GDACS pollers; only the
Anthropic-powered live news lookup is skipped.
\** Only needed when deploying with the Vercel cron in `vercel.json`.

## Deploying (Vercel)

1. Push this repo to GitHub and import it into [Vercel](https://vercel.com).
2. Set the environment variables above in the Vercel project settings.
3. The `vercel.json` cron (`/api/cron`, every 10 min) and `no-store` API headers
   are applied automatically.

## Project structure

```
src/
  app/
    page.tsx              # dashboard layout (map + dashboard + timeline + table)
    layout.tsx            # root layout + metadata
    api/refresh/route.ts  # agentic multi-source data refresh (BIPAD→ReliefWeb→Anthropic)
    api/cron/route.ts     # Vercel cron trigger (auth via CRON_SECRET)
  components/
    FloodMap.tsx          # interactive map (client-only)
    LiveDashboard.tsx     # stat cards + charts
    FloodTimeline.tsx     # event timeline
    CoordinateTable.tsx   # location coordinate table
    AlertBanner.tsx       # critical/warning/info alerts
  data/
    floodData.ts          # static verified dataset (origin, locations, stats, timeline)
    dataSources.ts        # agentic data-source registry
  lib/
    gdacs.ts              # UN/JRC disaster-alert RSS poller
  types/flood.ts          # shared TypeScript types
docs/agents/              # repo agent docs (issue tracker, triage labels, domain)
```

## Data sources

Nepal Police · BIPAD (Nepal Govt) · NDRRMA · UN OCHA ReliefWeb · GDACS (UN/JRC) ·
USGS · ICIMOD · major wire services (AP, Reuters, ABC, NBC, CBS) and international
news. The static layer (`src/data/floodData.ts`) is timestamped and attributed; the
live refresh layers the latest official/agency figures on top when available.

## License

This is a disaster-awareness / visualisation project. Please attribute sources and
verify figures against official authorities before redistribution.
