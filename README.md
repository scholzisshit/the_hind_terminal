# Bharat Monitor

**Real-time continental intelligence dashboard** — Geopolitical monitoring, financial telemetry, and military tracking in a unified, modular situational awareness interface entirely hyper-focused on India & South Asia.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

---

## Why Bharat Monitor?

| Problem                            | Solution |
| ---------------------------------- | -------- |
| Information overload & ugly dashboards | **Clean, VS Code-style modular dashboard** where every panel can be toggled on/off. |
| No geospatial context for events   | **Interactive high-performance Canvas map** with 34 toggleable data layers specifically tailored for the subcontinent. |
| Clunky global trackers             | **22 custom trackers** focused on India (e.g. Student Protests, Space Ports, Naxal Insurgencies, Tech Hubs). |
| Static news feeds                  | **Real-time updates** via Rust WebSocket layers streaming financial telemetry at 1Hz frames. |
| Expensive OSINT tools ($$$)        | **100% free & open source** (because paying for OSINT is so 2023). |
| You get hacked                     | We have an easter egg terminal that literally runs `curl rate.sx` inside the browser without exploding. |

---

## The Stack

A full-stack geospatial intelligence platform for India across three distinct polyglot services:

| Service | Stack | Port | Status |
|---------|-------|------|--------|
| `bharat-ai` | Python 3 FastAPI + Uvicorn | 8000 | ✅ Operational |
| `bharat-core` | Rust Axum + Tokio | 8080 | ✅ High-performance telemetry |
| `bharat-ui` | Next.js 14 + Tailwind | 3000 | ✅ Live |

---

## Dashboard Interface

### Clean Default State & Modular Telemetry

The UI was meticulously softened to achieve a professional "hackathon winner" aesthetic. Harsh neon Hex codes were replaced with muted pastels, ping animations slowed to 4-second breaths, and a strict VS Code-style panel architecture was introduced. 

![Clean Default Map State](./brain/b42653f7-faf8-49e1-ae7b-4d82351f2054/clean_map_state_1773578137867.png)

### Expanded Geospatial Intelligence Trackers

Bharat Monitor brings **34 geospatial tracker layers**, carefully categorized into 8 distinct intelligence groups:
1. **Geopolitical:** War Zones (India vs Conflict Borders), LoC/LAC.
2. **Cities & Education:** Tech hubs, Finance centers, Student Protests.
3. **Military & Defense:** Strategic Radii, Navy Bases, Base perimeters.
4. **Intelligence & Cyber:** Cyber Threats, Data Centers.
5. **Transport & Infrastructure:** Space Ports, NH Corridors, Railway Lines.
6. **Maritime & Pipelines:** Major Ports, Overland/Undersea Pipelines.
7. **Natural & Environment:** Natural Events, Monsoons, Weather Alerts.
8. **Policy & Research:** Think Tanks, Innovation Centers.

![Trackers Verification](./brain/b42653f7-faf8-49e1-ae7b-4d82351f2054/verify_new_trackers_1773591038418.webp)

---

## Core Panels

### 📊 Financial Telemetry
- Live **SENSEX**, **NIFTY50**, **BANKNIFTY** updating seamlessly.
- **Power Grid Status** — Load % bars with saturation probability per region (Western, Northern, Southern, Eastern).
- **Highway Congestion** — Live speed indicators for central corridors.

### 📡 Live Intel Feed
- Scrolling alert cards color-coded by severity (CRITICAL/WARNING/INFO).
- Integrated with right-anchor activity bar for collapsible reading.

### 🇮🇳 Country Intel Panel
- Instability Index (Stable / Elevated / Critical).
- Threat vector breakdowns across Security, Conflict, and Cyber domains.
- Top news feeds and military activity counters.

### 💻 Virtual Terminal
- A dark-mode macOS virtual terminal expanding from the right edge.
- Live execution of `curl rate.sx` directly in the browser!

![Terminal integration](./brain/b42653f7-faf8-49e1-ae7b-4d82351f2054/terminal_verification_1773591879375.png)

---

## Responsive Power-User Features

* **Tailored Resizability**: The Left and Right activity panels are interactively draggable bounding between 200px and 800px to expand telemetry charts.
* **Mobile-First Modals**: The workspace strictly switches to `absolute` floating popups when viewed on a phone, keeping the map fully functional with pinch-to-zoom Canvas rendering.

---

## How to Run

```bash
# Full stack (Starts UI, Rust Backend & Python AI layer)
bash ./start.sh

# Frontend only (works standalone with simulation fallback)
cd bharat-ui
npm install && npm run dev
```

---

## Security Acknowledgments

We thank the following researchers for responsibly disclosing security issues:

- **Cody Richard** — Disclosed three security findings covering IPC command exposure via DevTools in production builds, renderer-to-sidecar trust boundary analysis, and the global fetch patch credential injection architecture (2026).
- **You (Yes, You)** — For staring at the terminal screen trying to crash the Node cluster.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)** — see [LICENSE](LICENSE) for the full text.

**In plain terms:**
- **Source code disclosure** — if you distribute or modify this software, you **must** make the complete source code available under the same AGPL-3.0 license.
- **Network use is distribution** — if you run a modified version as a network service (SaaS, web app, API), you **must** provide the source code to all users who interact with it over the network.

*Built for absolute situational mastery.*
