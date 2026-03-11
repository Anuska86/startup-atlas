import "../styles/MapPage.css";

import { getCategoryColor } from "../utils/helpers.js";

import { useEffect, useState, useRef } from "react";
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
  const [map, setMap] = useState(null); //Actual Leaflet

  const location = useLocation();
  const hasFlown = useRef(false);

  const center = [30, -15];
  const zoom = 3;

  useEffect(() => {
    if (!map) return;

    // 1. Force Leaflet to recalculate its container size
    map.invalidateSize();

    const flyToCoords = location.state?.flyTo;
    const targetId = location.state?.startupId;

    if (flyToCoords && !hasFlown.current) {
      console.group("Map Navigation Debug");
      console.log("1. Target Coordinates:", flyToCoords);
      console.log("2. Target Startup ID:", targetId);

      // If we have a specific destination, go there

      map.flyTo(flyToCoords, 14, {
        animate: true,
        duration: 1.5,
      });

      const jumpTimer = setTimeout(() => {
        let markerFound = false;

        map.eachLayer((layer) => {
          // Check if this layer is the marker we want

          if (layer instanceof L.Marker && layer.options.id === targetId) {
            markerFound = true;
            layer.openPopup();
            const iconElement = layer.getElement(); //Get the DOM element

            console.log("3. Marker Layer Found:", layer);
            console.log(
              "4. DOM Element Status:",
              iconElement ? "Visible" : "Not in DOM (Cluster?)",
            );

            if (iconElement) {
              console.log("5. Success! Adding jump class.");
              iconElement.classList.add("jumping-marker-active");

              //Remove class after jumps

              setTimeout(() => {
                iconElement.classList.remove("jumping-marker-active");
              }, 2000);
            } else {
              console.warn(
                "Target marker is likely hidden inside a Cluster. Animation cannot run.",
              );
            }
          }
        });

        if (!markerFound) {
          console.error("6. Error: No marker found with ID:", targetId);
        }
        console.groupEnd();
      }, 1700); //Wait for flight (1.5s)

      hasFlown.current = true; //DONE

      //Clear the state so it doesn't fly there again on re-render
      window.history.replaceState({}, document.title);

      return () => {
        clearTimeout(jumpTimer);
      };
    } else if (startups.length > 0 && !flyToCoords && !hasFlown.current) {
      // VIEW ALL
      const bounds = L.latLngBounds(startups.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (startups.length === 0 && !flyToCoords) {
      map.setView(center, zoom);
    }
  }, [map, theme, startups, location.state]);

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
          color: getCategoryColor(startup.category),
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
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
      popupAnchor: [0, -25],
    });
  };

  const handleResetView = () => {
    if (map) {
      map.setView(center, zoom, {
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
          ref={setMap}
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
                id={startup.id}
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
                      {startup.city}, {startup.country}
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
