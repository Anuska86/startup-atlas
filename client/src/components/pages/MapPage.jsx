import "../../styles/MapPage.css";
import Button from "../common/Button.jsx";

import { getCategoryColor } from "../../utils/helpers.js";

import { useEffect, useState, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useLocation } from "react-router-dom";

import {
  BiChip,
  BiLeaf,
  BiLineChart,
  BiHeart,
  BiRefresh,
  BiUserCircle,
} from "react-icons/bi";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

function MapPage({ startups, theme, userCoords }) {
  const [map, setMap] = useState(null); //Actual Leaflet

  const location = useLocation();
  const hasFlown = useRef(false);

  const center = [30, -15];
  const zoom = 3;

  useEffect(() => {
    if (!map) return;

    // 1. Resize Observer watch the map's container
   
   const resizeObserver = new ResizeObserver(()=>{
 map.invalidateSize();
   })

   const container = map.getContainer();

   if (container) {
    resizeObserver.observe(container)
   }
   
   

    const flyToCoords = location.state?.flyTo;
    const targetId = location.state?.startupId;

    if (flyToCoords && !hasFlown.current) {
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

            if (iconElement) {
              iconElement.classList.add("jumping-marker-active");

              //Remove class after jumps

              setTimeout(() => {
                iconElement.classList.remove("jumping-marker-active");
              }, 2000);
            }
          
          }
        });

        if (!markerFound) {
          //console.error("6. Error: No marker found with ID:", targetId);
        }
      }, 1700); //Wait for flight (1.5s)

      hasFlown.current = true; //DONE

      //Clear the state so it doesn't fly there again on re-render
      window.history.replaceState({}, document.title);

      return () => {
        clearTimeout(jumpTimer);
      };
    } else if (userCoords) {
      map.flyTo([userCoords.lat, userCoords.lng], 10, {
        animate: true,
        duration: 1.5,
      });
    } else if (startups.length > 0 && !flyToCoords && !hasFlown.current) {
      // VIEW ALL
      const bounds = L.latLngBounds(startups.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (startups.length === 0 && !flyToCoords) {
      map.setView(center, zoom);
    }
  
  return () =>{
    resizeObserver.disconnect()
  }
  
  
  }, [
    map,
    theme,
    startups,
    location.state?.startupId,
    location.state?.flyTo,
    userCoords,
  ]);

  //Custom Icon for each industry
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

  //User icon

  const userIcon = L.divIcon({
    html: renderToStaticMarkup(
      <div
        style={{
          color: "var(--electric-sapphire)",
          fontSize: "32px",
        }}
      >
        <BiUserCircle />
      </div>,
    ),
    className: "user-location-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

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
          <Button
            variant="secondary"
            onClick={handleResetView}
            icon={BiRefresh}
          >
            Restore Initial View
          </Button>
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
          center={center}
          zoom={zoom}
          ref={setMap}
          style={{ height: "100%", width: "100%" }} // Ensure it fills the wrapper
        >
          <TileLayer
            key={theme}
            url={
              theme === "light"
                ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* User's Location Marker */}
          {userCoords && (
            <Marker
              position={[userCoords.lat, userCoords.lng]}
              icon={userIcon}
              zIndexOffset={1000}
            >
              <Popup>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                  You are here
                </div>
              </Popup>
            </Marker>
          )}

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
                    {/* Growth and MVP Tags */}
                    <div className="popup-tags">
                      {startup.category && (
                        <span className="startup-tag growth">
                          {startup.category}
                        </span>
                      )}
                      {startup.has_mvp && (
                        <span className="startup-tag mvp">MVP</span>
                      )}
                    </div>
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
