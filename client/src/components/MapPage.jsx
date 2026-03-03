import "../styles/MapPage.css";

import { useEffect, useRef } from "react";

import { renderToStaticMarkup } from "react-dom/server";

import { BiChip, BiLeaf, BiLineChart, BiHeart } from "react-icons/bi";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapPage({ startups, theme }) {
  const center = [20, 0]; // center of the map
  const mapRef = useRef(null);
  const zoom = 18;

  //recheck the size of the map and redraw the tiles
  useEffect(() => {
    setTimeout(() => {
      mapRef.current.invalidateSize();
    }, 100);
  }, [theme]);

  //Business logos

  const createCustomIcon = (startup) => {
    let SelectedIcon = BiChip; // Default
    const industry = startup.industry?.toLowerCase() || "";

    if (industry.includes("energy")) SelectedIcon = BiLeaf;
    if (industry.includes("fin")) SelectedIcon = BiLineChart;
    if (industry.includes("health")) SelectedIcon = BiHeart;

    // Convert React Icon to an SVG string for Leaflet
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

  return (
    <div className="map-wrapper">
      <MapContainer
        className="markercluster-map"
        center={center}
        zoom={zoom}
        ref={mapRef}
        style={{ height: "70vh", width: "100%" }}
      >
        {/* THEME TILES LAYER */}
        <TileLayer
          key={theme}
          url={
            theme === "light"
              ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          }
          attribution="&copy; CARTO"
        />

        <MarkerClusterGroup
          chunkedLoading // Optimization for many markers
          spiderfyOnMaxZoom={true}
        >
          {startups.map(
            (startup) =>
              startup.lat &&
              startup.lng && (
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
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit Website
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ),
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default MapPage;
