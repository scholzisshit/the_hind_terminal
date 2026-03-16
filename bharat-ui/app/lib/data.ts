// All static data constants for Bharat Monitor

export const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
export const INDIA_ZOOM = 5;

// ── Major Cities & Tech Centers ──────────────────────────────────────────────
export const TECH_CITIES = [
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, state: "Maharashtra", tier: 1, type: "finance", desc: "Financial capital, BFSI hub", pop: 20.7, techScore: 88 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025, state: "Delhi", tier: 1, type: "government", desc: "National capital, GovTech center", pop: 32.9, techScore: 82 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, state: "Karnataka", tier: 1, type: "tech", desc: "Silicon Valley of India", pop: 13.2, techScore: 98 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, state: "Telangana", tier: 1, type: "tech", desc: "HITECH City, pharma hub", pop: 10.5, techScore: 91 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, state: "Tamil Nadu", tier: 1, type: "tech", desc: "Automotive & IT corridor", pop: 11.5, techScore: 87 },
  { name: "Pune", lat: 18.5204, lng: 73.8567, state: "Maharashtra", tier: 1, type: "tech", desc: "Auto & IT hub", pop: 7.4, techScore: 85 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, state: "West Bengal", tier: 1, type: "trade", desc: "Eastern gateway, port city", pop: 15.1, techScore: 75 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, state: "Gujarat", tier: 1, type: "trade", desc: "GIFT City, textiles, trade", pop: 8.4, techScore: 79 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, state: "Punjab", tier: 2, type: "tech", desc: "Northern IT emerging hub", pop: 1.1, techScore: 72 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, state: "Rajasthan", tier: 2, type: "tourism", desc: "Pink city, startup ecosystem", pop: 4.0, techScore: 68 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh", tier: 2, type: "government", desc: "UP capital, defense corridor", pop: 3.7, techScore: 62 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673, state: "Kerala", tier: 2, type: "tech", desc: "Startup village, maritime tech", pop: 2.1, techScore: 78 },
  { name: "Indore", lat: 22.7196, lng: 75.8577, state: "Madhya Pradesh", tier: 2, type: "trade", desc: "Cleanest city, MSME hub", pop: 3.3, techScore: 65 },
  { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245, state: "Odisha", tier: 2, type: "tech", desc: "Smart city, IT SEZ", pop: 1.0, techScore: 66 },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362, state: "Assam", tier: 2, type: "trade", desc: "NE gateway, emerging hub", pop: 1.3, techScore: 55 },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh", tier: 2, type: "defense", desc: "Naval command, steel city", pop: 2.3, techScore: 70 },
  { name: "Surat", lat: 21.1702, lng: 72.8311, state: "Gujarat", tier: 2, type: "trade", desc: "Diamond & textile capital", pop: 7.8, techScore: 67 },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882, state: "Maharashtra", tier: 2, type: "logistics", desc: "Zero mile center, logistics hub", pop: 2.9, techScore: 63 },
  { name: "Patna", lat: 25.5941, lng: 85.1376, state: "Bihar", tier: 2, type: "government", desc: "Bihar capital, ancient city", pop: 2.5, techScore: 48 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558, state: "Tamil Nadu", tier: 2, type: "manufacturing", desc: "Pump city, textile industry", pop: 2.2, techScore: 69 },
];

// ── Universities / Hackathon Hubs ─────────────────────────────────────────────
export const UNIVERSITIES = [
  { name: "IIT Bombay", lat: 19.1334, lng: 72.9133, city: "Mumbai", rank: 1 },
  { name: "IIT Delhi", lat: 28.5450, lng: 77.1926, city: "Delhi", rank: 2 },
  { name: "IISc Bangalore", lat: 13.0212, lng: 77.5680, city: "Bengaluru", rank: 3 },
  { name: "IIT Madras", lat: 12.9915, lng: 80.2337, city: "Chennai", rank: 4 },
  { name: "IIT Kharagpur", lat: 22.3149, lng: 87.3105, city: "Kharagpur", rank: 5 },
  { name: "BITS Pilani", lat: 28.3665, lng: 73.6749, city: "Pilani", rank: 6 },
  { name: "IIIT Hyderabad", lat: 17.4459, lng: 78.3487, city: "Hyderabad", rank: 7 },
  { name: "IIT Hyderabad", lat: 17.5937, lng: 78.1299, city: "Hyderabad", rank: 8 },
  { name: "Jadavpur University", lat: 22.4996, lng: 88.3712, city: "Kolkata", rank: 9 },
  { name: "NIT Surathkal", lat: 13.0109, lng: 74.7948, city: "Mangaluru", rank: 10 },
];

// ── Border Conflict Zones ─────────────────────────────────────────────────────
export const CONFLICT_ZONES = [
  {
    id: "loc-kashmir",
    name: "Line of Control — Kashmir",
    severity: "CRITICAL",
    description: "Active disputed border. Heavy militarization on both sides. LoC sees regular ceasefire violations.",
    casualties_2024: 48,
    incidents_30d: 12,
    color: "#FF3355",
    fillColor: "#FF3355",
    fillOpacity: 0.18,
    // Approximate LoC polygon (simplified)
    coordinates: [
      [37.0, 74.8], [36.5, 75.5], [35.8, 76.3], [35.2, 76.8],
      [34.7, 75.9], [34.2, 74.8], [33.5, 74.1], [33.0, 73.9],
      [32.5, 74.2], [33.0, 75.0], [33.5, 75.8], [34.0, 76.2],
      [34.5, 77.0], [35.0, 77.5], [35.5, 77.8], [36.0, 76.8],
      [36.5, 76.0], [37.0, 75.5], [37.0, 74.8],
    ],
  },
  {
    id: "pak-occupied-kashmir",
    name: "Pakistan-Occupied Kashmir",
    severity: "HIGH",
    description: "Administered by Pakistan, claimed by India. Known as Azad Kashmir. Historical conflict region.",
    casualties_2024: 12,
    incidents_30d: 5,
    color: "#FF6600",
    fillColor: "#FF6600",
    fillOpacity: 0.20,
    coordinates: [
      [36.9, 72.8], [36.5, 73.5], [35.8, 74.2], [35.0, 73.8],
      [34.3, 73.2], [33.7, 73.0], [33.2, 73.4], [33.0, 73.9],
      [33.5, 74.1], [34.2, 74.8], [34.7, 75.9], [35.2, 76.0],
      [35.5, 75.2], [36.0, 74.5], [36.5, 73.8], [37.0, 73.2], [36.9, 72.8],
    ],
  },
  {
    id: "lac-ladakh",
    name: "LAC — Ladakh (India–China)",
    severity: "HIGH",
    description: "Line of Actual Control. Galwan Valley confrontation 2020. Active patrolling and standoffs.",
    casualties_2024: 0,
    incidents_30d: 3,
    color: "#FF9933",
    fillColor: "#FF9933",
    fillOpacity: 0.15,
    coordinates: [
      [34.5, 78.5], [34.8, 79.5], [35.2, 80.5], [35.5, 81.5],
      [35.8, 82.0], [35.5, 82.5], [35.0, 82.8], [34.5, 83.0],
      [34.0, 82.5], [33.5, 81.5], [33.2, 80.5], [33.5, 79.5],
      [34.0, 78.8], [34.5, 78.5],
    ],
  },
  {
    id: "lac-arunachal",
    name: "LAC — Arunachal Pradesh (India–China)",
    severity: "MODERATE",
    description: "China claims Arunachal Pradesh as 'South Tibet'. Regular incursions reported.",
    casualties_2024: 0,
    incidents_30d: 2,
    color: "#FFD700",
    fillColor: "#FFD700",
    fillOpacity: 0.14,
    coordinates: [
      [27.5, 91.5], [27.8, 92.5], [28.2, 93.5], [28.5, 94.5],
      [28.2, 95.5], [27.8, 96.2], [27.2, 96.5], [26.8, 95.5],
      [26.5, 94.5], [26.8, 93.5], [27.0, 92.5], [27.3, 91.8], [27.5, 91.5],
    ],
  },
  {
    id: "myanmar-border",
    name: "India–Myanmar Border — Manipur",
    severity: "HIGH",
    description: "Active ethnic conflict spilling across border. Insurgency movements active. Refugee flows.",
    casualties_2024: 89,
    incidents_30d: 8,
    color: "#CC44FF",
    fillColor: "#CC44FF",
    fillOpacity: 0.16,
    coordinates: [
      [25.5, 93.5], [25.8, 94.0], [26.2, 94.5], [26.0, 95.0],
      [25.5, 95.2], [25.0, 95.0], [24.5, 94.5], [24.0, 94.0],
      [24.2, 93.5], [24.8, 93.2], [25.2, 93.3], [25.5, 93.5],
    ],
  },
  {
    id: "naxal-belt",
    name: "Red Corridor — Naxalite Belt",
    severity: "MODERATE",
    description: "Left-wing extremist activity. Chhattisgarh, Jharkhand, Odisha triangle. Active anti-naxal operations.",
    casualties_2024: 156,
    incidents_30d: 6,
    color: "#FF4444",
    fillColor: "#FF4444",
    fillOpacity: 0.12,
    coordinates: [
      [22.5, 80.0], [22.8, 81.5], [22.5, 83.0], [22.0, 84.0],
      [21.5, 84.5], [20.5, 84.0], [20.0, 83.0], [20.5, 81.5],
      [21.0, 80.5], [21.5, 80.0], [22.0, 79.8], [22.5, 80.0],
    ],
  },
];

// ── Military / Nuclear / Strategic Sites ──────────────────────────────────────
export const MILITARY_BASES = [
  { name: "Southern Naval Command", lat: 9.96, lng: 76.28, type: "naval", country: "India", strength: "HIGH" },
  { name: "Western Naval Command", lat: 18.93, lng: 72.84, type: "naval", country: "India", strength: "HIGH" },
  { name: "Eastern Naval Command", lat: 17.69, lng: 83.22, type: "naval", country: "India", strength: "HIGH" },
  { name: "Northern Army Command", lat: 32.73, lng: 74.86, type: "army", country: "India", strength: "CRITICAL" },
  { name: "Strategic Forces Command — Mathura", lat: 27.49, lng: 77.67, type: "strategic", country: "India", strength: "CRITICAL" },
  { name: "Kalaikunda Air Force", lat: 22.12, lng: 87.18, type: "airforce", country: "India", strength: "HIGH" },
  { name: "Hindon Air Force", lat: 28.69, lng: 77.45, type: "airforce", country: "India", strength: "HIGH" },
  { name: "China Hotan Base", lat: 37.03, lng: 79.86, type: "airforce", country: "China", strength: "HIGH" },
  { name: "Pakistan Chaklala", lat: 33.62, lng: 73.07, type: "airforce", country: "Pakistan", strength: "HIGH" },
  { name: "Pakistan Karachi Naval", lat: 24.83, lng: 66.99, type: "naval", country: "Pakistan", strength: "HIGH" },
  { name: "China Kashgar", lat: 39.46, lng: 76.02, type: "army", country: "China", strength: "MODERATE" },
];

export const NUCLEAR_SITES = [
  { name: "Tarapur Nuclear Plant", lat: 19.83, lng: 72.65, type: "power", status: "operational" },
  { name: "Kudankulam Nuclear Plant", lat: 8.17, lng: 77.71, type: "power", status: "operational" },
  { name: "Kaiga Nuclear Plant", lat: 14.87, lng: 74.44, type: "power", status: "operational" },
  { name: "BARC Mumbai", lat: 19.01, lng: 72.92, type: "research", status: "operational" },
  { name: "Rawatbhata (RAPS)", lat: 24.91, lng: 75.56, type: "power", status: "operational" },
  { name: "Kakrapar Atomic Station", lat: 21.23, lng: 73.36, type: "power", status: "operational" },
  { name: "Pakistan Kahuta (Enrichment)", lat: 33.59, lng: 73.38, type: "weapons", status: "active" },
  { name: "Pakistan Khushab Reactor", lat: 32.06, lng: 72.21, type: "weapons", status: "active" },
  { name: "China Lop Nur", lat: 40.7, lng: 90.6, type: "weapons", status: "historical" },
];

// ── Infrastructure Nodes ──────────────────────────────────────────────────────
export const PORTS = [
  { name: "JNPT Mumbai", lat: 18.95, lng: 72.95, type: "major", cargo_mt: 71 },
  { name: "Mundra Port", lat: 22.83, lng: 69.71, type: "major", cargo_mt: 155 },
  { name: "Chennai Port", lat: 13.09, lng: 80.29, type: "major", cargo_mt: 52 },
  { name: "Kolkata Port", lat: 22.57, lng: 88.33, type: "major", cargo_mt: 62 },
  { name: "Vizag Port", lat: 17.69, lng: 83.27, type: "major", cargo_mt: 70 },
  { name: "Karachi Port", lat: 24.85, lng: 67.01, type: "international", cargo_mt: 50 },
  { name: "Colombo Port", lat: 6.93, lng: 79.84, type: "international", cargo_mt: 7 },
  { name: "Gwadar Port", lat: 25.12, lng: 62.33, type: "strategic_china", cargo_mt: 15 },
];

export const UNDERSEA_CABLES = [
  {
    name: "SEA-ME-WE 5",
    coordinates: [[6.9, 79.8], [8.5, 75.5], [10.8, 72.8], [13.1, 80.3], [17.7, 83.2], [22.6, 88.4]],
    capacity_tbps: 24,
  },
  {
    name: "Bay of Bengal Gateway",
    coordinates: [[13.1, 80.3], [7.0, 80.0], [3.1, 73.5], [4.2, 79.8]],
    capacity_tbps: 40,
  },
  {
    name: "India–Europe (I-ME-WE)",
    coordinates: [[18.9, 72.8], [12.5, 54.0], [23.6, 58.5], [29.3, 32.3]],
    capacity_tbps: 3.84,
  },
];

// ── Influence Radius Zones ────────────────────────────────────────────────────
export const INFLUENCE_CIRCLES = [
  { name: "Northern Theater", lat: 30.0, lng: 76.5, radius: 650000, color: "#00FFFF", desc: "Northern command strategic zone. Covers Pakistan border + LAC Ladakh." },
  { name: "Western Strategic Zone", lat: 22.0, lng: 70.0, radius: 550000, color: "#00FFFF", desc: "Arabian Sea influence. Karachi + Gwadar threat envelope." },
  { name: "Eastern Corridor", lat: 24.0, lng: 92.0, radius: 500000, color: "#00FFFF", desc: "Eastern Command. Bangladesh + Myanmar border + Bay of Bengal." },
  { name: "Deccan Core", lat: 17.5, lng: 78.5, radius: 600000, color: "#00FFFF", desc: "Southern technology and defense heartland." },
  { name: "Andaman–Nicobar Perimeter", lat: 11.7, lng: 92.7, radius: 400000, color: "#FFD700", desc: "Strategic island chain. Maritime chokepoint — Malacca Strait access." },
];

// ── Strategic Waterways ───────────────────────────────────────────────────────
export const WATERWAYS = [
  { name: "Strait of Malacca", lat: 2.5, lng: 103.0, importance: "CRITICAL", desc: "80% of India's oil imports pass through" },
  { name: "Strait of Hormuz", lat: 26.6, lng: 56.3, importance: "CRITICAL", desc: "Persian Gulf energy chokepoint" },
  { name: "Bab-el-Mandeb", lat: 12.6, lng: 43.4, importance: "HIGH", desc: "Red Sea entry, Houthi threat active" },
  { name: "Ten Degree Channel", lat: 10.0, lng: 92.5, importance: "HIGH", desc: "Andaman Islands strategic passage" },
  { name: "Eight Degree Channel", lat: 8.0, lng: 73.5, importance: "MODERATE", desc: "Lakshadweep archipelago passage" },
];

// ── Country Intelligence Data ─────────────────────────────────────────────────
export const COUNTRY_INTEL: Record<string, {
  name: string; flag: string; instability: number;
  threat: number; conflict: number; security: number; cyber: number;
  signals: Array<{ label: string; severity: string }>;
  news: Array<{ headline: string; source: string; severity: string; ago: string }>;
  military: { ownFlights: number; foreignFlights: number; vessels: number; alerts: number };
  economy: { sensex?: string; gdpMomentum: string; instabilityRegime: string };
}> = {
  India: {
    name: "India", flag: "🇮🇳",
    instability: 35,
    threat: 6, conflict: 8, security: 20, cyber: 23,
    signals: [
      { label: "Critical LoC", severity: "CRITICAL" },
      { label: "1 Hacktivist Campaign", severity: "WARNING" },
      { label: "1 Tropical Weather", severity: "INFO" },
      { label: "275 Climate Events", severity: "INFO" },
      { label: "4-15 Jammu Active", severity: "HIGH" },
    ],
    news: [
      { headline: "India at 'high alert' on LAC after satellite imagery shows Chinese buildup", source: "Times of India", severity: "HIGH", ago: "2h" },
      { headline: "Sensex hits 72,800 — markets bullish on Q4 earnings season", source: "Economic Times", severity: "INFO", ago: "45m" },
      { headline: "Maharashtra grid under stress — peak summer demand hits 31 GW", source: "PTI", severity: "WARNING", ago: "1h" },
      { headline: "IIT Bombay CTF winner announced — team 'ByteBreakers' wins ₹50L", source: "NDTV", severity: "INFO", ago: "3h" },
    ],
    military: { ownFlights: 42, foreignFlights: 0, vessels: 92, alerts: 3 },
    economy: { sensex: "72,800", gdpMomentum: "+6.5%", instabilityRegime: "35/100 (Normal)" },
  },
  Pakistan: {
    name: "Pakistan", flag: "🇵🇰",
    instability: 72,
    threat: 38, conflict: 45, security: 62, cyber: 28,
    signals: [
      { label: "Active LoC Ceasefire Violations", severity: "CRITICAL" },
      { label: "IMF Dependency", severity: "HIGH" },
      { label: "Political Instability", severity: "HIGH" },
      { label: "8 Active Militant Groups", severity: "CRITICAL" },
    ],
    news: [
      { headline: "Pakistan military budget increased 15% amid tensions with India", source: "Dawn", severity: "HIGH", ago: "5h" },
      { headline: "IMF loan tranche delayed — economic pressure mounts", source: "The News", severity: "WARNING", ago: "2h" },
    ],
    military: { ownFlights: 18, foreignFlights: 3, vessels: 12, alerts: 7 },
    economy: { gdpMomentum: "+2.1%", instabilityRegime: "72/100 (Elevated)" },
  },
  China: {
    name: "China", flag: "🇨🇳",
    instability: 28,
    threat: 42, conflict: 25, security: 15, cyber: 55,
    signals: [
      { label: "LAC Infrastructure Buildup", severity: "HIGH" },
      { label: "Cyber Operations Elevated", severity: "CRITICAL" },
      { label: "PLAN Exercises — Indian Ocean", severity: "HIGH" },
      { label: "Economic Slowdown", severity: "MODERATE" },
    ],
    news: [
      { headline: "PLA conducts exercises near LAC — satellite confirms troop movements", source: "Reuters", severity: "HIGH", ago: "3h" },
      { headline: "China-Pakistan CPEC Phase II accelerates construction", source: "SCMP", severity: "WARNING", ago: "6h" },
    ],
    military: { ownFlights: 120, foreignFlights: 0, vessels: 340, alerts: 5 },
    economy: { gdpMomentum: "+4.6%", instabilityRegime: "28/100 (Stable)" },
  },
};

// ── Web3 Hubs Mock ────────────────────────────────────────────────────────────
export const WEB3_HUBS = TECH_CITIES.filter(c => c.tier === 1).map(c => ({
  ...c,
  nodes: Math.floor(Math.random() * 180) + 20,
  protocols: Math.floor(Math.random() * 22) + 3,
}));

// ── Highway Network ───────────────────────────────────────────────────────────
export const HIGHWAYS = [
  { id: "NH-44", name: "NH-44 (Srinagar–Kanyakumari)", path: [[34.1, 74.8], [32.7, 74.9], [31.1, 75.3], [28.7, 77.1], [24.6, 77.7], [21.1, 79.1], [17.4, 78.5], [13.1, 80.3], [8.1, 77.5]] },
  { id: "NH-48", name: "NH-48 (Delhi–Chennai)", path: [[28.7, 77.1], [24.9, 75.3], [23.0, 72.6], [21.2, 72.8], [19.1, 72.9]] },
  { id: "NH-19", name: "NH-19 (Delhi–Kolkata)", path: [[28.7, 77.1], [26.8, 80.9], [25.6, 85.1], [22.6, 88.4]] },
  { id: "NH-27", name: "NH-27 (East–West)", path: [[26.1, 91.7], [25.6, 85.1], [25.3, 82.9], [26.9, 75.8], [26.7, 70.9]] },
];

// ── AQI Color Map ─────────────────────────────────────────────────────────────
export const AQI_COLOR = (aqi: number): string => {
  if (aqi > 300) return "#FF3355";
  if (aqi > 200) return "#FF6600";
  if (aqi > 150) return "#FF9933";
  if (aqi > 100) return "#FFD700";
  if (aqi > 50)  return "#88CC00";
  return "#00FF88";
};

export const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: "#FF3355",
  HIGH: "#FF6600",
  WARNING: "#FF9933",
  MODERATE: "#FFD700",
  INFO: "#00FFFF",
  LOW: "#00FF88",
  SAFE: "#00FF88",
};

// ── NEW TRACKERS (from tracker.tsx) ──────────────────────────────────────────

export const TERROR_INCIDENTS: Array<[number, number, string, number]> = [
  [34.0837, 74.7973, "Pulwama 2019", 40],
  [19.0760, 72.8777, "Mumbai 26/11", 174],
  [23.0225, 72.5714, "Ahmedabad 2008", 60],
  [32.0639, 75.7773, "Pathankot 2016", 7]
];

export const MAJOR_PORTS: Array<[number, number, string, string]> = [
  [19.07, 72.88, "JNPT Mumbai", "50% Container Traffic"],
  [13.10, 80.27, "Chennai", "East Coast Hub"],
  [17.69, 83.22, "Visakhapatnam", "Container Giant"],
  [9.92, 76.24, "Kochi", "Natural Harbor"],
  [23.02, 70.22, "Kandla", "Oil & Dry Bulk"]
];

export const INCUBATION_CENTERS: Array<[number, number, string, string]> = [
  [12.9716, 77.5946, "NSRCEL IIMB", "Bangalore"],
  [17.3850, 78.4867, "T-Hub", "Hyderabad"],
  [23.0225, 72.5714, "CIIE IIMA", "Ahmedabad"],
  [19.1333, 72.9167, "SINE IITB", "Mumbai"]
];

export const RIVER_TRADE_ROUTES: Array<Array<[number, number]>> = [
  [[31.1048, 77.1734], [28.6139, 77.2090]],
  [[23.3441, 85.3096], [22.5726, 88.3639]],
  [[18.5204, 73.8567], [19.0760, 72.8777]]
];

export const POLITICAL_ZONES: Array<[number, number, string, string]> = [
  [28.6139, 77.2090, "Delhi - Mixed", "High Tension"],
  [19.0760, 72.8777, "Mumbai - Cosmopolitan", "Stable"],
  [31.1048, 77.1734, "Shimla - Regional", "BJP Stronghold"]
];

export const PROTEST_HOTSPOTS: Array<[number, number, string]> = [
  [28.6139, 77.2090, "Delhi Farmers"],
  [17.3850, 78.4867, "Hyderabad Student"],
  [22.5726, 88.3639, "Kolkata Labor"]
];

export const AIRWAY_CORRIDORS: Array<Array<[number, number]>> = [
  [[28.5665, 77.1031], [19.0863, 72.8679]],
  [[13.0697, 80.2437], [19.0863, 72.8679]],
  [[28.5665, 77.1031], [17.4415, 78.3683]]
];

export const UNDERSEA_PIPELINES: Array<Array<[number, number]>> = [
  [[19.0760, 72.8777], [20.2961, 72.9793]],
  [[8.4768, 76.3049], [9.9174, 76.2419]]
];

export const CONFLICT_ZONES_TRACKER: Array<[number, number, string, string]> = [
  [34.0837, 74.7973, "Jammu & Kashmir", "Active Militancy"],
  [19.9167, 85.8333, "Chhattisgarh", "Naxal Heartland"],
  [27.0238, 74.2179, "Rajasthan Border", "Pakistan LOC"]
];

export const OVERLAND_PIPELINES: Array<Array<[number, number]>> = [
  [[22.3, 69.2], [28.6, 77.2], [23.0, 72.0]],
  [[19.0, 72.8], [22.0, 73.0]]
];

// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 11 — 22 New Modular Trackers
// ══════════════════════════════════════════════════════════════════════════════

// 1. Predictions (Think Tanks & Policy Forecasts)
export const PREDICTIONS: Array<{ name: string; lat: number; lng: number; type: string; desc: string }> = [
  { name: "ORF New Delhi", lat: 28.5985, lng: 77.2220, type: "think-tank", desc: "Observer Research Foundation — Foreign policy forecasts" },
  { name: "IDSA", lat: 28.5842, lng: 77.1549, type: "defense", desc: "Institute for Defence Studies — Strategic analysis" },
  { name: "Takshashila Institution", lat: 12.9339, lng: 77.6140, type: "think-tank", desc: "Public policy research from Bengaluru" },
  { name: "CSEP Delhi", lat: 28.6362, lng: 77.2182, type: "economic", desc: "Centre for Social and Economic Progress" },
  { name: "RIS", lat: 28.5678, lng: 77.2068, type: "trade", desc: "Research and Information System for Developing Countries" },
];

// 2. Trade Policies
export const TRADE_POLICIES: Array<{ name: string; lat: number; lng: number; type: string; desc: string }> = [
  { name: "Mundra SEZ", lat: 22.8384, lng: 69.7250, type: "sez", desc: "Adani SEZ — largest private port in India" },
  { name: "Kandla FTWZ", lat: 23.0333, lng: 70.2167, type: "ftwz", desc: "Free Trade Warehousing Zone — Kutch" },
  { name: "JNPT SEZ", lat: 18.9511, lng: 72.9519, type: "sez", desc: "Jawaharlal Nehru Port Trust — Mumbai" },
  { name: "Cochin SEZ", lat: 9.9585, lng: 76.3424, type: "sez", desc: "IT/Technology export zone — Kochi" },
  { name: "Visakhapatnam SEZ", lat: 17.7063, lng: 83.2378, type: "sez", desc: "Multi-product SEZ — Andhra Pradesh" },
  { name: "Chennai Petrochemical SEZ", lat: 12.8065, lng: 80.2206, type: "sez", desc: "Oil & gas export processing" },
];

// 3. Student Protests
export const STUDENT_PROTESTS: Array<{ name: string; lat: number; lng: number; cause: string; severity: string }> = [
  { name: "JNU New Delhi", lat: 28.5402, lng: 77.1670, cause: "Fee hike & academic freedom", severity: "HIGH" },
  { name: "Jadavpur University", lat: 22.4996, lng: 88.3712, cause: "Curriculum reform demands", severity: "MODERATE" },
  { name: "Aligarh Muslim University", lat: 27.9157, lng: 78.0777, cause: "CAA/NRC protests", severity: "HIGH" },
  { name: "Hyderabad Central University", lat: 17.4609, lng: 78.3379, cause: "Scholarship delays", severity: "MODERATE" },
  { name: "BHU Varanasi", lat: 25.2677, lng: 82.9913, cause: "Campus safety", severity: "LOW" },
];

// 4. Government Colleges
export const GOV_COLLEGES: Array<{ name: string; lat: number; lng: number; type: string }> = [
  { name: "Delhi University", lat: 28.6889, lng: 77.2115, type: "central" },
  { name: "Anna University", lat: 13.0108, lng: 80.2352, type: "state" },
  { name: "Savitribai Phule Pune Univ", lat: 18.5569, lng: 73.8302, type: "state" },
  { name: "Calcutta University", lat: 22.5780, lng: 88.3629, type: "central" },
  { name: "Osmania University", lat: 17.4126, lng: 78.5300, type: "state" },
  { name: "Mumbai University", lat: 18.9786, lng: 72.8328, type: "state" },
  { name: "Gujarat University", lat: 23.0341, lng: 72.5469, type: "state" },
  { name: "Punjab University", lat: 30.7619, lng: 76.7667, type: "state" },
];

// 5. Think Tanks (additional)
export const THINK_TANKS: Array<{ name: string; lat: number; lng: number; focus: string }> = [
  { name: "NITI Aayog", lat: 28.6146, lng: 77.2132, focus: "National policy" },
  { name: "IIM Ahmedabad CIIE", lat: 23.0295, lng: 72.5467, focus: "Innovation & entrepreneurship" },
  { name: "Vidhi Centre for Legal Policy", lat: 28.6332, lng: 77.2222, focus: "Legal reform" },
  { name: "CPR Delhi", lat: 28.5957, lng: 77.1634, focus: "Urban & climate policy" },
];

// 6. Railway Lines (major corridors as Polylines)
export const RAILWAY_LINES: Array<{ name: string; coords: Array<[number, number]>; type: string }> = [
  { name: "Delhi–Mumbai Rajdhani", coords: [[28.70, 77.10], [26.91, 75.78], [23.02, 72.57], [19.07, 72.87]], type: "rajdhani" },
  { name: "Delhi–Kolkata Rajdhani", coords: [[28.70, 77.10], [25.59, 85.13], [22.57, 88.36]], type: "rajdhani" },
  { name: "Chennai–Bengaluru Shatabdi", coords: [[13.08, 80.27], [12.97, 77.59]], type: "shatabdi" },
  { name: "Mumbai–Pune Deccan Express", coords: [[19.07, 72.87], [18.52, 73.85]], type: "express" },
  { name: "Delhi–Amritsar Shatabdi", coords: [[28.70, 77.10], [30.73, 76.77], [31.63, 74.87]], type: "shatabdi" },
  { name: "Mumbai–Goa Konkan Railway", coords: [[19.07, 72.87], [17.68, 73.32], [15.49, 73.82]], type: "scenic" },
  { name: "Dedicated Freight Corridor West", coords: [[19.07, 72.87], [22.30, 73.20], [23.02, 72.57], [28.70, 77.10]], type: "freight" },
];

// 7. Traffic Jams
export const TRAFFIC_JAMS: Array<{ name: string; lat: number; lng: number; severity: string; delay_min: number }> = [
  { name: "Silk Board Junction", lat: 12.9172, lng: 77.6228, severity: "CRITICAL", delay_min: 45 },
  { name: "Signal Hill, Mumbai", lat: 19.0200, lng: 72.8460, severity: "HIGH", delay_min: 35 },
  { name: "Rajiv Chowk, Delhi", lat: 28.6328, lng: 77.2197, severity: "HIGH", delay_min: 30 },
  { name: "Anna Salai, Chennai", lat: 13.0614, lng: 80.2634, severity: "MODERATE", delay_min: 20 },
  { name: "MG Road, Bengaluru", lat: 12.9758, lng: 77.6066, severity: "HIGH", delay_min: 25 },
  { name: "Hinjewadi IT Park, Pune", lat: 18.5913, lng: 73.7389, severity: "HIGH", delay_min: 40 },
  { name: "Howrah Bridge, Kolkata", lat: 22.5851, lng: 88.3468, severity: "MODERATE", delay_min: 22 },
];

// 8. Major Highway Projects (under construction, as Polylines)
export const MAJOR_HIGHWAY_PROJECTS: Array<{ name: string; coords: Array<[number, number]>; status: string }> = [
  { name: "Delhi–Mumbai Expressway", coords: [[28.70, 77.10], [26.91, 75.78], [23.02, 72.57], [19.07, 72.87]], status: "under-construction" },
  { name: "Bengaluru–Chennai Expressway", coords: [[12.97, 77.59], [12.95, 78.50], [13.08, 80.27]], status: "under-construction" },
  { name: "Amritsar–Jamnagar Expressway", coords: [[31.63, 74.87], [28.70, 77.10], [22.47, 70.06]], status: "planned" },
  { name: "Nagpur–Mumbai Samruddhi Mahamarg", coords: [[21.14, 79.08], [19.87, 75.34], [19.07, 72.87]], status: "operational" },
];

// 9. Sludge & Waste Pipelines
export const SLUDGE_PIPELINES: Array<Array<[number, number]>> = [
  [[19.07, 72.87], [19.20, 72.95], [19.35, 73.10]],
  [[28.61, 77.20], [28.55, 77.35], [28.48, 77.50]],
  [[13.08, 80.27], [13.15, 80.35]],
];

// 10. Slurry Pipelines
export const SLURRY_PIPELINES: Array<{ name: string; coords: Array<[number, number]>; material: string }> = [
  { name: "Kudremukh Iron Ore Pipeline", coords: [[13.18, 75.25], [13.34, 74.80]], material: "iron-ore" },
  { name: "NMDC Bacheli Pipeline", coords: [[18.87, 81.29], [17.68, 83.21]], material: "iron-ore" },
  { name: "HZL Zinc Pipeline", coords: [[24.58, 73.68], [24.87, 74.62]], material: "zinc-concentrate" },
];

// 11. Space Ports
export const SPACE_PORTS: Array<{ name: string; lat: number; lng: number; org: string; desc: string }> = [
  { name: "Satish Dhawan Space Centre", lat: 13.7199, lng: 80.2304, org: "ISRO", desc: "Primary launch pad — Sriharikota" },
  { name: "Thumba Equatorial Rocket Station", lat: 8.5374, lng: 76.8631, org: "ISRO", desc: "Sounding rocket launches — Kerala" },
  { name: "Abdul Kalam Island", lat: 20.7575, lng: 87.1001, org: "DRDO", desc: "Missile testing range — Odisha" },
  { name: "Kulasekharapattinam", lat: 8.3615, lng: 77.7552, org: "ISRO", desc: "New SSLV launch pad, under development" },
  { name: "Challakere", lat: 14.3245, lng: 76.6541, org: "ISRO/DRDO", desc: "Aerospace park & testing facilities" },
];

// 12. Intel Hotspots
export const INTEL_HOTSPOTS: Array<{ name: string; lat: number; lng: number; type: string; severity: string }> = [
  { name: "Wagah Border", lat: 31.6047, lng: 74.5736, type: "border-intel", severity: "HIGH" },
  { name: "Tawang Sector", lat: 27.5860, lng: 91.8596, type: "border-intel", severity: "HIGH" },
  { name: "Siliguri Corridor", lat: 26.7271, lng: 88.3953, type: "chokepoint", severity: "CRITICAL" },
  { name: "Andaman & Nicobar CMD", lat: 11.6683, lng: 92.7358, type: "naval-intel", severity: "MODERATE" },
  { name: "Jaisalmer Sector", lat: 26.9157, lng: 70.9083, type: "border-intel", severity: "MODERATE" },
];

// 13. Aviation Hubs
export const AVIATION_HUBS: Array<{ name: string; lat: number; lng: number; type: string; code: string }> = [
  { name: "Indira Gandhi International", lat: 28.5562, lng: 77.1000, type: "international", code: "DEL" },
  { name: "Chhatrapati Shivaji Maharaj", lat: 19.0896, lng: 72.8656, type: "international", code: "BOM" },
  { name: "Kempegowda International", lat: 13.1986, lng: 77.7066, type: "international", code: "BLR" },
  { name: "Rajiv Gandhi International", lat: 17.2403, lng: 78.4294, type: "international", code: "HYD" },
  { name: "Chennai International", lat: 12.9941, lng: 80.1709, type: "international", code: "MAA" },
  { name: "Netaji Subhas Chandra Bose", lat: 22.6547, lng: 88.4467, type: "international", code: "CCU" },
  { name: "Cochin International", lat: 10.1520, lng: 76.4019, type: "international", code: "COK" },
  { name: "Dabolim Naval Airfield", lat: 15.3808, lng: 73.8314, type: "military-civilian", code: "GOI" },
];

// 14. Military Activity Zones
export const MILITARY_ACTIVITY: Array<{ name: string; lat: number; lng: number; type: string; branch: string }> = [
  { name: "Siachen Base Camp", lat: 35.22, lng: 77.10, type: "forward-base", branch: "Army" },
  { name: "INS Kadamba", lat: 14.79, lng: 74.12, type: "naval-base", branch: "Navy" },
  { name: "Halwara Air Force Station", lat: 30.74, lng: 75.63, type: "air-base", branch: "Air Force" },
  { name: "Pokhran Range", lat: 26.97, lng: 71.92, type: "test-range", branch: "DRDO" },
  { name: "Sukhna Cantonment", lat: 26.85, lng: 88.78, type: "cantonment", branch: "Army" },
  { name: "AFS Thanjavur", lat: 10.72, lng: 79.10, type: "air-base", branch: "Air Force" },
];

// 15. Displacement Flows (Polylines)
export const DISPLACEMENT_FLOWS: Array<{ name: string; coords: Array<[number, number]>; cause: string }> = [
  { name: "Rohingya Camps → Jammu", coords: [[21.42, 92.00], [25.59, 85.14], [32.72, 74.86]], cause: "Conflict displacement" },
  { name: "Kashmir IDP Flow", coords: [[34.08, 74.79], [32.72, 74.86], [28.70, 77.10]], cause: "Conflict displacement" },
  { name: "Naxal Corridor Outflow", coords: [[19.91, 82.70], [21.14, 79.08], [22.71, 75.85]], cause: "Insurgency displacement" },
];

// 16. Strategic Waterways (Polylines)
export const STRATEGIC_WATERWAYS: Array<{ name: string; coords: Array<[number, number]>; type: string }> = [
  { name: "Ganga Navigable Waterway NW-1", coords: [[25.31, 83.01], [25.59, 85.14], [22.57, 88.36]], type: "inland" },
  { name: "Brahmaputra NW-2", coords: [[26.14, 91.73], [26.19, 92.74], [27.48, 94.91]], type: "inland" },
  { name: "Buckingham Canal", coords: [[13.08, 80.27], [15.49, 80.05]], type: "coastal" },
  { name: "Palk Strait Shipping Lane", coords: [[9.28, 79.42], [9.93, 79.83], [10.77, 79.84]], type: "maritime" },
];

// 17. Natural Events
export const NATURAL_EVENTS: Array<{ name: string; lat: number; lng: number; type: string; severity: string }> = [
  { name: "Bihar Flood Zone", lat: 25.59, lng: 85.14, type: "flood", severity: "CRITICAL" },
  { name: "Assam Flood Belt", lat: 26.14, lng: 91.73, type: "flood", severity: "HIGH" },
  { name: "Uttarakhand Landslide Zone", lat: 30.32, lng: 79.06, type: "landslide", severity: "HIGH" },
  { name: "Cyclone Bay of Bengal Track", lat: 14.50, lng: 85.50, type: "cyclone", severity: "MODERATE" },
  { name: "Gujarat Drought Zone", lat: 23.25, lng: 69.67, type: "drought", severity: "MODERATE" },
  { name: "Himachal Seismic Zone", lat: 32.22, lng: 77.18, type: "earthquake", severity: "HIGH" },
];

// 18. Cyber Threats
export const CYBER_THREATS: Array<{ name: string; lat: number; lng: number; type: string; severity: string }> = [
  { name: "AIIMS Ransomware Hotspot", lat: 28.5672, lng: 77.2100, type: "ransomware", severity: "CRITICAL" },
  { name: "Mumbai Power Grid Probe", lat: 19.07, lng: 72.87, type: "infrastructure", severity: "HIGH" },
  { name: "Bengaluru IT Corridor APT", lat: 12.97, lng: 77.59, type: "apt", severity: "HIGH" },
  { name: "Pune Defence Sector", lat: 18.52, lng: 73.85, type: "espionage", severity: "MODERATE" },
  { name: "Hyderabad Pharma Data Breach", lat: 17.38, lng: 78.48, type: "data-breach", severity: "MODERATE" },
];

// 19. Internet Outages
export const INTERNET_OUTAGES: Array<{ name: string; lat: number; lng: number; isp: string; severity: string }> = [
  { name: "Kashmir Shutdown", lat: 34.08, lng: 74.79, isp: "Multiple", severity: "CRITICAL" },
  { name: "Manipur Blackout", lat: 24.81, lng: 93.94, isp: "BSNL/Airtel", severity: "HIGH" },
  { name: "Rajasthan Rural Gap", lat: 26.91, lng: 75.78, isp: "BSNL", severity: "MODERATE" },
  { name: "Arunachal Connectivity Lag", lat: 27.10, lng: 93.61, isp: "BSNL", severity: "MODERATE" },
];

// 20. Critical Minerals
export const CRITICAL_MINERALS: Array<{ name: string; lat: number; lng: number; mineral: string; status: string }> = [
  { name: "Bailadila Iron Ore", lat: 18.67, lng: 81.24, mineral: "Iron Ore", status: "active" },
  { name: "Singhbhum Uranium Belt", lat: 22.40, lng: 86.20, mineral: "Uranium", status: "active" },
  { name: "Orissa Chromite", lat: 21.49, lng: 83.97, mineral: "Chromite", status: "active" },
  { name: "Rajasthan Zinc-Lead", lat: 24.58, lng: 73.68, mineral: "Zinc-Lead", status: "active" },
  { name: "Jharkhand Mica Belt", lat: 24.00, lng: 85.50, mineral: "Mica", status: "active" },
  { name: "Kerala Thorium Sands", lat: 8.52, lng: 76.94, mineral: "Thorium", status: "restricted" },
  { name: "AP Bauxite Deposits", lat: 18.29, lng: 83.22, mineral: "Bauxite", status: "active" },
];

// 21. Fires (recent wildfire / industrial)
export const FIRES: Array<{ name: string; lat: number; lng: number; type: string; severity: string }> = [
  { name: "Uttarakhand Forest Fire", lat: 30.06, lng: 79.29, type: "wildfire", severity: "CRITICAL" },
  { name: "Odisha Industrial Zone", lat: 20.27, lng: 85.83, type: "industrial", severity: "HIGH" },
  { name: "Punjab Stubble Burn", lat: 30.90, lng: 75.85, type: "agricultural", severity: "MODERATE" },
  { name: "Mizoram Jhum Fire", lat: 23.16, lng: 92.93, type: "wildfire", severity: "HIGH" },
  { name: "Bandipur National Park", lat: 11.67, lng: 76.51, type: "wildfire", severity: "HIGH" },
];

// 22. Weather Alerts
export const WEATHER_ALERTS: Array<{ name: string; lat: number; lng: number; type: string; severity: string }> = [
  { name: "Delhi Heat Wave", lat: 28.70, lng: 77.10, type: "heat-wave", severity: "CRITICAL" },
  { name: "Kerala Heavy Rain", lat: 10.85, lng: 76.27, type: "heavy-rain", severity: "HIGH" },
  { name: "Odisha Cyclone Warning", lat: 20.29, lng: 85.82, type: "cyclone", severity: "CRITICAL" },
  { name: "Tamil Nadu Fog", lat: 11.01, lng: 76.95, type: "fog", severity: "LOW" },
  { name: "Rajasthan Cold Wave", lat: 26.91, lng: 75.78, type: "cold-wave", severity: "MODERATE" },
  { name: "Assam Thunderstorm", lat: 26.14, lng: 91.73, type: "thunderstorm", severity: "HIGH" },
];

// ══════════════════════════════════════════════════════════════════════════════
//  PHASE 12 — War Zones & Strategic Overlays
// ══════════════════════════════════════════════════════════════════════════════

export const WAR_ZONES_POLYGONS: Array<{ name: string; color: string; coords: Array<[number, number]> }> = [
  {
    name: "India (Home)",
    color: "#4DD2D2", // Tech Blue
    coords: [
      [35.49, 76.79], [32.22, 79.18], [29.35, 80.89], [27.70, 85.32], [28.20, 88.50], [29.50, 95.00],
      [27.50, 97.00], [25.00, 94.00], [21.50, 92.50], [22.00, 89.00], [20.00, 86.00], [15.00, 80.00],
      [10.00, 79.00], [8.00, 77.00], [10.00, 76.00], [15.00, 73.00], [20.00, 72.00], [23.50, 68.00],
      [28.00, 70.00], [32.50, 74.00]
    ]
  },
  {
    name: "Myanmar Conflict",
    color: "#F25C75", // Danger Red
    coords: [
      [28.00, 97.50], [25.00, 99.00], [20.00, 100.00], [15.00, 98.00], [10.00, 98.50], 
      [14.00, 93.50], [20.00, 92.50], [24.00, 94.00], [27.00, 96.00]
    ]
  },
  {
    name: "Iran / ME Tensions",
    color: "#F25C75", // Danger Red
    coords: [
      [39.00, 44.00], [38.00, 50.00], [37.00, 55.00], [35.00, 61.00], [29.00, 61.50], 
      [25.00, 61.00], [26.00, 56.00], [27.00, 51.00], [30.00, 48.00], [34.00, 45.00], [38.00, 44.00]
    ]
  },
  {
    name: "Af-Pak Frontier",
    color: "#F25C75", // Danger Red
    coords: [
      [35.00, 71.00], [32.00, 69.00], [29.00, 63.00], [26.00, 62.00], [27.00, 65.00], 
      [30.00, 68.00], [33.00, 71.50], [34.50, 72.00]
    ]
  }
];
