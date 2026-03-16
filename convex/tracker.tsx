import React, { useEffect, useState, useCallback } from 'react';
import {
    MapContainer, TileLayer, GeoJSON, LayerGroup, Marker, Popup,
    CircleMarker, Polyline, useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// COMPLETE TRACKER DATA - INDIA EXCLUSIVE
const InfrastructureMap = () => {
    const [tradeData, setTradeData] = useState(null);
    const [activeAlerts, setActiveAlerts] = useState({});
    const [newsFeed, setNewsFeed] = useState([]);

    // 1. TRADE ROUTES (National Highways - GLOWING)
    const loadTradeRoutes = useCallback(() => {
        fetch('https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/geojsons/national_highways.geojson')
            .then(res => res.json())
            .then(data => setTradeData(data));
    }, []);

    // 2. TERROR INCIDENTS (SATP data)
    const terrorIncidents = [
        [34.0837, 74.7973, "Pulwama 2019", 40],
        [19.0760, 72.8777, "Mumbai 26/11", 174],
        [23.0225, 72.5714, "Ahmedabad 2008", 60],
        [32.0639, 75.7773, "Pathankot 2016", 7]
    ];

    // 3. MAJOR PORTS (13 key ports)
    const majorPorts = [
        [19.07, 72.88, "JNPT Mumbai", "50% Container Traffic"],
        [13.10, 80.27, "Chennai", "East Coast Hub"],
        [17.69, 83.22, "Visakhapatnam", "Container Giant"],
        [9.92, 76.24, "Kochi", "Natural Harbor"],
        [23.02, 70.22, "Kandla", "Oil & Dry Bulk"]
    ];

    // 4. INCUBATION CENTERS (NSRCEL, T-Hub, etc)
    const incubationCenters = [
        [12.9716, 77.5946, "NSRCEL IIMB", "Bangalore"],
        [17.3850, 78.4867, "T-Hub", "Hyderabad"],
        [23.0225, 72.5714, "CIIE IIMA", "Ahmedabad"],
        [19.1333, 72.9167, "SINE IITB", "Mumbai"]
    ];

    // 5. INTERSTATE RIVER TRADE ROUTES
    const riverTradeRoutes = [
        [[31.1048, 77.1734], [28.6139, 77.2090]], // Yamuna Delhi-Shimla
        [[23.3441, 85.3096], [22.5726, 88.3639]], // Ganga industrial corridor
        [[18.5204, 73.8567], [19.0760, 72.8777]]  // Krishna-Mumbai
    ];

    // 6. RELIGION/POLITICAL ALIGNMENT ZONES
    const politicalZones = [
        [28.6139, 77.2090, "Delhi - Mixed", "High Tension"],
        [19.0760, 72.8777, "Mumbai - Cosmopolitan", "Stable"],
        [31.1048, 77.1734, "Shimla - Regional", "BJP Stronghold"]
    ];

    // 7. PROTEST HOTSPOTS (Dynamic)
    const protestLocations = [
        [28.6139, 77.2090, "Delhi Farmers"],
        [17.3850, 78.4867, "Hyderabad Student"],
        [22.5726, 88.3639, "Kolkata Labor"]
    ];

    // 8. MAJOR AIRWAY CHANNELS
    const airwayCorridors = [
        [[28.5665, 77.1031], [19.0863, 72.8679]], // Delhi-Mumbai
        [[13.0697, 80.2437], [19.0863, 72.8679]], // Chennai-Mumbai
        [[28.5665, 77.1031], [17.4415, 78.3683]]  // Delhi-Hyderabad
    ];

    // 9. UNDERSEA PIPELINES
    const underseaPipelines = [
        [[19.0760, 72.8777], [20.2961, 72.9793]], // Mumbai High Gas
        [[8.4768, 76.3049], [9.9174, 76.2419]]    // Kochi-Mangalore Gas
    ];

    // 10. CONFLICT ZONES (Persistent)
    const conflictZones = [
        [34.0837, 74.7973, "Jammu & Kashmir", "Active Militancy"],
        [19.9167, 85.8333, "Chhattisgarh", "Naxal Heartland"],
        [27.0238, 74.2179, "Rajasthan Border", "Pakistan LOC"]
    ];

    // 11. PIPELINES (Overland)
    const pipelines = [
        [[22.3, 69.2], [28.6, 77.2], [23.0, 72.0]], // HVJ Gas Pipeline
        [[19.0, 72.8], [22.0, 73.0]]                // Mumbai High Oil
    ];

    // SIMULATED NEWS FEED → Triggers Trackers
    useEffect(() => {
        loadTradeRoutes();

        // Real-time news simulation (30s intervals)
        const newsEvents = [
            { type: 'terror', title: "J&K encounter", lat: 34.0837, lng: 74.7973 },
            { type: 'protest', title: "Delhi farmers block highway", lat: 28.6139, lng: 77.2090 },
            { type: 'incubation', title: "Bengaluru startup incubator fire", lat: 12.9716, lng: 77.5946 },
            { type: 'riverTrade', title: "Yamuna water dispute escalates", lat: 28.6139, lng: 77.2090 },
            { type: 'airways', title: "Mumbai airport drone threat", lat: 19.0863, lng: 72.8679 },
            { type: 'underseaPipes', title: "Mumbai High pipeline leak", lat: 19.0760, lng: 72.8777 },
            { type: 'political', title: "Election violence UP", lat: 26.8467, lng: 80.9462 }
        ];

        const interval = setInterval(() => {
            const event = newsEvents[Math.floor(Math.random() * newsEvents.length)];
            setNewsFeed(prev => [...prev.slice(-5), event]); // Last 5 alerts

            // Activate relevant tracker
            setActiveAlerts(prev => ({ ...prev, [event.type]: true }));
        }, 15000); // 15s for demo

        return () => clearInterval(interval);
    }, [loadTradeRoutes]);

    const glowingStyle = {
        color: '#00FFFF',
        weight: 6,
        opacity: 0.95,
        fillOpacity: 0
    };

    return (
        <div style={{ height: '800px', position: 'relative', fontFamily: 'Arial' }}>
            {/* 🔥 LIVE NEWS ALERTS */}
            <div style={{
                position: 'absolute', top: 10, left: 10, zIndex: 1000,
                background: 'linear-gradient(135deg, #ff416c, #ff4b2b, #ff8177)',
                color: 'white', padding: '20px', borderRadius: '15px',
                maxWidth: '400px', boxShadow: '0 8px 32px rgba(255,65,108,0.4)',
                backdropFilter: 'blur(10px)'
            }}>
                <h3 style={{ margin: '0 0 15px 0' }}>🚨 LIVE INFRA THREAT FEED</h3>
                {newsFeed.map((alert, i) => (
                    <div key={i} style={{
                        padding: '8px', margin: '3px 0', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.2)', fontSize: '13px'
                    }}>
                        <strong>{getAlertIcon(alert.type)} {alert.title}</strong>
                    </div>
                ))}
            </div>

            {/* 📊 ACTIVE TRACKER LEGEND */}
            <div style={{
                position: 'absolute', top: 10, right: 10, zIndex: 1000,
                background: 'rgba(0,0,0,0.85)', color: 'white', padding: '20px',
                borderRadius: '15px', minWidth: '200px', fontSize: '13px'
            }}>
                <h4 style={{ margin: '0 0 15px 0' }}>🗺️ ACTIVE TRACKERS ({Object.keys(activeAlerts).filter(k => activeAlerts[k]).length}/10)</h4>
                {Object.entries(activeAlerts).map(([type, active]) => active && (
                    <div key={type} style={{
                        display: 'flex', alignItems: 'center', margin: '5px 0',
                        padding: '5px', background: getTrackerColor(type),
                        borderRadius: '5px', fontWeight: 'bold'
                    }}>
                        {getTrackerIcon(type)} {formatTrackerName(type)}
                    </div>
                ))}
            </div>

            <MapContainer
                center={[21.7679, 78.8718]}
                zoom={5.5}
                style={{ height: '100%', width: '100%', borderRadius: '15px' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* 1️⃣ TRADE ROUTES (Always Active - Glowing) */}
                {tradeData && (
                    <GeoJSON
                        data={tradeData}
                        style={glowingStyle}
                    />
                )}

                {/* 2️⃣ TERROR INCIDENTS */}
                {activeAlerts.terror && (
                    <LayerGroup>
                        {terrorIncidents.map(([lat, lng, name, deaths], i) => (
                            <CircleMarker
                                key={`terror-${i}`}
                                center={[lat, lng]}
                                radius={Math.max(deaths / 2.5, 10)}
                                fillColor="#8B0000"
                                color="#FF0000"
                                weight={3}
                                fillOpacity={0.9}
                            >
                                <Popup>
                                    <h3 style={{ color: '#d32f2f' }}>💥 {name}</h3>
                                    <strong>Fatalities: {deaths}</strong><br />
                                    Critical security incident
                                </Popup>
                            </CircleMarker>
                        ))}
                    </LayerGroup>
                )}

                {/* 3️⃣ MAJOR PORTS */}
                {activeAlerts.ports && (
                    <LayerGroup>
                        {majorPorts.map(([lat, lng, name, desc], i) => (
                            <Marker key={`port-${i}`} position={[lat, lng]}>
                                <Popup>
                                    <h3 style={{ color: '#1976d2' }}>⚓ {name}</h3>
                                    <em>{desc}</em><br /><br />
                                    <strong>95% of India trade volume</strong>
                                </Popup>
                            </Marker>
                        ))}
                    </LayerGroup>
                )}

                {/* 4️⃣ INCUBATION CENTERS */}
                {activeAlerts.incubation && (
                    <LayerGroup>
                        {incubationCenters.map(([lat, lng, name], i) => (
                            <CircleMarker
                                key={`inc-${i}`}
                                center={[lat, lng]}
                                radius={12}
                                fillColor="#FFD700"
                                color="#FFA500"
                                weight={3}
                                fillOpacity={0.9}
                            >
                                <Popup>
                                    <h3 style={{ color: '#f57c00' }}>🚀 {name}</h3>
                                    <strong>Technology Business Incubator</strong><br />
                                    News: Fire/Funding incident
                                </Popup>
                            </CircleMarker>
                        ))}
                    </LayerGroup>
                )}

                {/* 5️⃣ INTERSTATE RIVER TRADE */}
                {activeAlerts.riverTrade && riverTradeRoutes.map((route, i) => (
                    <Polyline
                        key={`river-${i}`}
                        positions={route}
                        weight={8}
                        color="#00BFFF"
                        dashArray="15,10"
                        opacity={0.9}
                    >
                        <Popup>
                            <h3 style={{ color: '#0277bd' }}>🌊 Interstate River Trade</h3>
                            Water dispute corridor<br />
                            <strong>Critical agriculture lifeline</strong>
                        </Popup>
                    </Polyline>
                ))}

                {/* 6️⃣ RELIGION/POLITICAL ALIGNMENT */}
                {activeAlerts.political && (
                    <LayerGroup>
                        {politicalZones.map(([lat, lng, name, status], i) => (
                            <CircleMarker
                                key={`pol-${i}`}
                                center={[lat, lng]}
                                radius={15}
                                fillColor={status === "High Tension" ? "#FF5722" : "#4CAF50"}
                                color="#000"
                                weight={2}
                                fillOpacity={0.8}
                            >
                                <Popup>
                                    <h3 style={{ color: status === "High Tension" ? "#d84315" : "#388e3c" }}>
                                        🗳️ {name}
                                    </h3>
                                    Status: <strong>{status}</strong>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </LayerGroup>
                )}

                {/* 7️⃣ PROTEST HOTSPOTS */}
                {activeAlerts.protest && newsFeed.map((news, i) =>
                    news.type === 'protest' && (
                        <CircleMarker
                            key={`protest-${i}`}
                            center={[news.lat, news.lng]}
                            radius={16}
                            fillColor="#FF4500"
                            color="#FF0000"
                            weight={4}
                            fillOpacity={0.9}
                            stroke={true}
                        >
                            <Popup>
                                <h3 style={{ color: '#e64a19' }}>🪧 LIVE PROTEST</h3>
                                <strong>{news.title}</strong><br />
                                Active disruption detected
                            </Popup>
                        </CircleMarker>
                    )
                )}

                {/* 8️⃣ MAJOR AIRWAY CHANNELS */}
                {activeAlerts.airways && airwayCorridors.map((route, i) => (
                    <Polyline
                        key={`air-${i}`}
                        positions={route}
                        weight={4}
                        color="#87CEEB"
                        opacity={0.7}
                    >
                        <Popup>
                            <h3 style={{ color: '#1976d2' }}>✈️ Major Air Corridor</h3>
                            High-density flight path<br />
                            <strong>Aviation security alert</strong>
                        </Popup>
                    </Polyline>
                ))}

                {/* 9️⃣ UNDERSEA PIPELINES */}
                {activeAlerts.underseaPipes && underseaPipelines.map((pipe, i) => (
                    <Polyline
                        key={`sea-${i}`}
                        positions={pipe}
                        weight={7}
                        color="#FF1493"
                        dashArray="8,8"
                        opacity={0.9}
                    >
                        <Popup>
                            <h3 style={{ color: '#c2185b' }}>🌊 UNDERSEA PIPELINE</h3>
                            Critical gas infrastructure<br />
                            <strong>Leak/maintenance news</strong>
                        </Popup>
                    </Polyline>
                ))}

                {/* 🔟 CONFLICT ZONES (Always monitored) */}
                {activeAlerts.conflictZones && conflictZones.map(([lat, lng, name], i) => (
                    <CircleMarker
                        key={`conflict-${i}`}
                        center={[lat, lng]}
                        radius={20}
                        fillColor="#8B0000"
                        color="#FF0000"
                        weight={4}
                        fillOpacity={0.85}
                    >
                        <Popup>
                            <h3 style={{ color: '#d32f2f' }}>⚠️ {name}</h3>
                            <strong>Persistent Conflict Zone</strong><br />
                            Continuous monitoring required
                        </Popup>
                    </CircleMarker>
                ))}

                {/* 1️⃣1️⃣ OVERLAND PIPELINES */}
                {activeAlerts.pipelines && pipelines.map((pipe, i) => (
                    <Polyline
                        key={`pipe-${i}`}
                        positions={pipe}
                        weight={6}
                        color="#FFD700"
                        dashArray="12,8"
                    >
                        <Popup>
                            <h3 style={{ color: '#f57f17' }}>🛢️ HVJ Pipeline</h3>
                            Hazira-Vijaipur-Jagdishpur<br />
                            <strong>India's energy backbone</strong>
                        </Popup>
                    </Polyline>
                ))}
            </MapContainer>

            <style jsx>{`
        .leaflet-container {
          border-radius: 15px !important;
        }
      `}</style>
        </div>
    );
};

// HELPER FUNCTIONS
const getAlertIcon = (type) => {
    const icons = {
        terror: '💥', protest: '🪧', incubation: '🚀', riverTrade: '🌊',
        airways: '✈️', underseaPipes: '🌊', political: '🗳️'
    };
    return icons[type] || '📍';
};

const getTrackerIcon = (type) => {
    const icons = {
        terror: '💥', ports: '⚓', incubation: '🚀', riverTrade: '🌊',
        political: '🗳️', protest: '🪧', airways: '✈️',
        underseaPipes: '🌊', conflictZones: '⚠️', pipelines: '🛢️'
    };
    return icons[type] || '📍';
};

const getTrackerColor = (type) => {
    const colors = {
        terror: 'rgba(220, 53, 69, 0.2)',
        ports: 'rgba(0, 123, 255, 0.2)',
        incubation: 'rgba(255, 193, 7, 0.3)',
        riverTrade: 'rgba(13, 202, 240, 0.2)',
        political: 'rgba(40, 167, 69, 0.2)',
        protest: 'rgba(255, 69, 0, 0.3)',
        airways: 'rgba(135, 206, 235, 0.2)',
        underseaPipes: 'rgba(255, 20, 147, 0.3)',
        conflictZones: 'rgba(139, 0, 0, 0.3)',
        pipelines: 'rgba(255, 215, 0, 0.2)'
    };
    return colors[type] || 'rgba(108,117,125,0.2)';
};

const formatTrackerName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

export default InfrastructureMap;
