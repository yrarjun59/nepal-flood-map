# GitHub Repository Description

## Short Description (for repo settings)
Real-time mapping & situation dashboard for the August 26, 2026 Nepal glacial flood (Bhote Koshi/Lhende Khola). Interactive map, live dashboard, satellite comparison, river gauges, news feed, data export & PWA offline support. All free APIs — no keys required.

## Topics / Tags (add in repo settings → General → Topics)
```
nepal flood disaster dashboard glacial-lake-outburst-flood glof bhote-koshi lhende-khola
nextjs leaflet recharts pwa offline-first typescript tailwind
humanitarian open-source disaster-response gis qgis google-earth
```

## Repository Description (for GitHub About section)
A production-ready, real-time situation dashboard for the **August 26, 2026 Nepal glacial flood** (Bhote Koshi / Lhende Khola GLOF event). Built for field workers, emergency responders, journalists, and researchers.

**Key Features:**
- 🗺️ **Interactive Map** — Leaflet + OpenStreetMap (no API key), animated flood flow path, severity-coded markers
- 📊 **Live Dashboard** — Auto-refreshes every 60s via multi-source pipeline (BIPAD → ReliefWeb → RSS → static)
- 🛰️ **Satellite Comparison** — Before/after Sentinel-2 slider (Copernicus)
- 🌊 **River Gauges** — Real-time DHM Nepal data (Bahrabise, Benighat, Narayanghat, Cheughat)
- 📰 **Live News** — Free RSS aggregation (ABC, NBC, CBS, The Watchers, EarthSky)
- 📁 **Map Layers** — Flood extent, infrastructure, evacuation routes, population, landslide risk
- 📥 **Data Export** — GeoJSON (QGIS/ArcGIS), KML (Google Earth), CSV, PDF reports
- 📱 **PWA/Offline** — Installable, works offline via service worker
- 📋 **Field Guide** — GPS/QGIS/Google Earth instructions for field workers

**Data Pipeline (All Free):**
1. BIPAD (Nepal Govt API) — official casualties
2. ReliefWeb (UN OCHA) — UN SITREPs
3. RSS News — ABC, NBC, CBS, The Watchers, EarthSky
4. Optional LLM — NVIDIA NIM / Groq / Together (free tiers)
5. Static fallback — verified Aug 29 2026 data

**Tech Stack:** Next.js 14, TypeScript, Tailwind, Leaflet, Recharts, PWA

**Verified Data Sources:** Nepal Police, BIPAD, NDRRMA, USGS, ICIMOD, DHM Nepal, Copernicus EMS, UN GDACS, major international news.

---

## To Set Up

1. **Go to** https://github.com/yrarjun59/nepal-flood-map
2. **Click** the gear icon (⚙️) next to "About" or go to Settings → General
3. **Paste** the Short Description above into "Description"
4. **Add** the Topics above (comma-separated)
5. **Save**

The README.md is already updated with full documentation.