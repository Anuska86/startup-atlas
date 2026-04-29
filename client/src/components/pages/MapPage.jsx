import "../../styles/MapPage.css";
import Button from "../common/Button.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";

import { getCategoryColor } from "../../utils/helpers.js";
import { createCustomIcon } from "../../utils/iconUtils.jsx";

import { useEffect, useState, useRef, useMemo, memo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useLocation } from "react-router-dom";

import {
  BiChip,
  BiLeaf,
  BiLineChart,
  BiHeart,
  BiRefresh,
  BiUserCircle,
  BiCodeAlt,
  BiCartAlt,
  BiMusic,
  BiSupport,
  BiGlobe,
} from "react-icons/bi";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

//Marker Helper

const MemoizedMarker = memo(({ startup }) => {
  // This only runs if the startup data changes
  const icon = useMemo(
    () => createCustomIcon(startup),
    [startup.category, startup.industry],
  );

  return (
    <Marker
      position={[startup.lat, startup.lng]}
      icon={icon}
      eventHandlers={{
        add: (e) => {
          e.target.options.id = startup.id;
        },
      }}
    >
      <Popup>
        <div className="map-popup">
          <h3>{startup.name}</h3>
          <p>
            <strong>{startup.industry}</strong>
          </p>
          <p>{startup.all_locations || "Location TBD"}</p>

          {/*Category and MVP Tags */}
          <div className="popup-tags">
            {startup.tags &&
              startup.tags
                .replace(/[\[\]']/g, "")
                .split(",")
                .map((tag) => (
                  <span key={tag} className="startup-tag">
                    {tag.trim()}
                  </span>
                ))}
            {startup.has_mvp && <span className="startup-tag mvp">MVP</span>}
          </div>
          <a href={startup.website} target="_blank" rel="noreferrer">
            Visit Website
          </a>
        </div>
      </Popup>
    </Marker>
  );
});

function MapPage({ startups, userCoords }) {
  const [map, setMap] = useState(null); //Actual Leaflet

  const { theme } = useTheme();

  const location = useLocation();
  const hasFlown = useRef(false);

  const center = [30, -15];
  const zoom = 3;

  useEffect(() => {
    if (!map) return;

    //DECLARATIONS

    let jumpTimer;

    //Resize Observer watch the map's container

    const resizeObserver = new ResizeObserver(() => {
      //The map container still exist?

      if (map && map.getContainer()) {
        map.invalidateSize();
      }
    });

    const container = map.getContainer();

    if (container) {
      resizeObserver.observe(container);
    }

    map.invalidateSize();

    //LOGIC

    const flyToCoords = location.state?.flyTo;
    const targetId = location.state?.startupId;

    const isValidCoord =
      flyToCoords &&
      !isNaN(flyToCoords[0]) &&
      !isNaN(flyToCoords[1]) &&
      flyToCoords[0] !== null;

    if (flyToCoords && isValidCoord && !hasFlown.current) {
      // If we have a specific destination, go there

      map.flyTo(flyToCoords, 18, {
        animate: true,
        duration: 1.5,
      });

      const jumpTimer = setTimeout(() => {
        let markerFound = false;

        map.eachLayer((layer) => {
          // Check if this layer is the Cluster Group

          if (layer.zoomToShowLayer) {
            const childMarkers = layer.getLayers();
            const targetMarker = childMarkers.find(
              (marker) => marker.options.id === targetId,
            );

            if (targetMarker) {
              markerFound = true;

              //Cluster expands + zoom to the target marker
              layer.zoomToShowLayer(targetMarker, () => {
                targetMarker.openPopup();
                const iconElement = targetMarker.getElement(); //Get the DOM element

                if (iconElement) {
                  iconElement.classList.add("jumping-marker-active");

                  //Remove class after jumps

                  setTimeout(() => {
                    iconElement.classList.remove("jumping-marker-active");
                  }, 2000);
                }
              });
            }
          }
        });

        if (!markerFound) {
          //console.error("6. Error: No marker found with ID:", targetId);
        }
      }, 1800); //Wait for flight (1.5s)

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
    } else if (flyToCoords && !isValidCoord) {
      console.warn(
        "Location state provided invalid coordinates. Skipping flight.",
      );
      map.setView(center, zoom);
    }

    //EXIT

    return () => {
      resizeObserver.disconnect();
      if (jumpTimer) clearTimeout(jumpTimer);
    };
  }, [
    map,
    theme,
    startups,
    location.state?.startupId,
    location.state?.flyTo,
    userCoords,
  ]);

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
            className="restore-map-view-btn"
            variant="secondary"
            onClick={handleResetView}
            icon={BiRefresh}
          >
            Restore Initial View
          </Button>
        </div>
        <div
          className="map-legend"
          role="region"
          aria-labelledby="legend-title"
        >
          <h4 id="legend-title">Industry Key</h4>
          <div className="legend-item">
            <BiLeaf className="icon energy" aria-hidden="true" /> Energy &
            Agriculture
          </div>
          <div className="legend-item">
            <BiLineChart className="icon fin" aria-hidden="true" /> FinTech &
            SaaS
          </div>
          <div className="legend-item">
            <BiHeart className="icon health" aria-hidden="true" /> HealthTech
          </div>
          <div className="legend-item">
            <BiChip className="icon tech" aria-hidden="true" /> AI, Quantum &
            Tech
          </div>
          <div className="legend-item">
            <BiCodeAlt className="icon dev" aria-hidden="true" /> DevTools &
            Software
          </div>
          <div className="legend-item">
            <BiCartAlt className="icon commerce" aria-hidden="true" />{" "}
            E-commerce & Retail
          </div>
          <div className="legend-item">
            <BiMusic className="icon entertainment" aria-hidden="true" /> Music
            & Media
          </div>
          <div className="legend-item">
            <BiSupport className="icon gaming" aria-hidden="true" /> AR, VR &
            Gaming
          </div>
          <div className="legend-item">
            <BiGlobe className="icon enterprise" aria-hidden="true" />{" "}
            Enterprise & Logistics
          </div>
        </div>
        <MapContainer
          center={center}
          zoom={zoom}
          ref={setMap}
          style={{ height: "100%", width: "100%" }} // Ensure it fills the wrapper
          worldCopyJump={true}
          minZoom={2}
          fadeAnimation={true}
          zoomAnimation={true}
          maxBounds={[
            [-85.05112878, -180],
            [85.05112878, 180],
          ]}
          maxBoundsViscosity={1.0}
          aria-label="Interactive map showing startup locations"
        >
          <TileLayer
            key={theme}
            url={
              theme === "light"
                ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            keepBuffer={2}
            maxNativeZoom={19}
            maxZoom={20}
            updateWhenIdle={false}
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

          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom={true}
            disableClusteringAtZoom={17}
          >
            {startups
              .filter((startup) => startup.lat !== null && startup.lng !== null) //OUT NULLS
              .map((startup) => (
                <MemoizedMarker key={startup.id} startup={startup} />
              ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
