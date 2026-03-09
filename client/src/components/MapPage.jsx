import "../styles/MapPage.css";

import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useLocation } from "react-router-dom";

import {
  BiChip,
  BiLeaf,
  BiLineChart,
  BiHeart,
  BiRefresh,
} from "react-icons/bi";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

function MapPage({ startups, theme }) {
  const mapRef = useRef(null);
  const location = useLocation();

  const center = [30, -15];
  const zoom = 3;

  useEffect(() => {
    if (!mapRef.current) return;

    // 1. Force Leaflet to recalculate its container size
    mapRef.current.invalidateSize();

    const flyToCoords = location.state?.flyTo;

    // 2. Decide where to move the camera
    if (flyToCoords) {
      // If we have a specific destination, go there
      mapRef.current.setView(flyToCoords, 14, {
        duration: 1.5,
        animate: true,
      });

      // Optional: Clear the state so it doesn't fly there again on re-render
      window.history.replaceState({}, document.title);
    } else if (startups.length > 0) {
      // Otherwise, show all startups
      const bounds = L.latLngBounds(startups.map((s) => [s.lat, s.lng]));
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
      });
    }
  }, [theme, startups, location.state]);

  const createCustomIcon = (startup) => {
    let SelectedIcon = BiChip;
    const industry = startup.industry?.toLowerCase() || "";

    if (industry.includes("energy") || industry.includes("agriculture")) {
      SelectedIcon = BiLeaf;
    } else if (industry.includes("fin") || industry.includes("saas")) {
      SelectedIcon = BiLineChart;
    } else if (industry.includes("health")) {
      SelectedIcon = BiHeart;
    } else if (industry.includes("ai") || industry.includes("quantum")) {
      SelectedIcon = BiChip;
    } else {
      SelectedIcon = BiChip; // Default
    }

    const iconMarkup = renderToStaticMarkup(
      <div
        style={{
          color: "#4cc9f0",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SelectedIcon />
      </div>,
    );

    return L.divIcon({
      html: iconMarkup,
      className: "industry-icon-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  //Reset the map view

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  return (
    <div className="map-page-container">
      <div className="map-wrapper">
        <div className="map-internal-controls">
          <button className="reset-view-btn" onClick={handleResetView}>
            <BiRefresh
              style={{
                marginRight: "8px",
                verticalAlign: "middle",
                fontSize: "1.2rem",
              }}
            />
            <span> Restore Initial View</span>
          </button>
        </div>
        <div className="map-legend">
          <h4>Industry Key</h4>
          <div className="legend-item">
            <BiLeaf className="icon energy" /> Energy & Agriculture
          </div>
          <div className="legend-item">
            <BiLineChart className="icon fin" /> FinTech & SaaS
          </div>
          <div className="legend-item">
            <BiHeart className="icon health" /> HealthTech
          </div>
          <div className="legend-item">
            <BiChip className="icon tech" /> AI, Quantum & Tech
          </div>
        </div>
        <MapContainer
          key={theme}
          center={center}
          zoom={zoom}
          ref={mapRef}
          style={{ height: "100%", width: "100%" }} // Ensure it fills the wrapper
        >
          <TileLayer
            url={
              theme === "light"
                ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          <MarkerClusterGroup chunkedLoading spiderfyOnMaxZoom={true}>
            {startups.map((startup) => (
              <Marker
                key={startup.id}
                position={[startup.lat, startup.lng]}
                icon={createCustomIcon(startup)}
              >
                <Popup>
                  <div className="map-popup">
                    <h3>{startup.name}</h3>
                    <p>
                      <strong>{startup.industry}</strong>
                    </p>
                    <p>
                      {startup.business_address.city}, {startup.country}
                    </p>
                    <a href={startup.website} target="_blank" rel="noreferrer">
                      Visit Website
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
