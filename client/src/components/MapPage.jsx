import "../styles/MapPage.css";

import { useEffect, useRef } from "react";

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
  const center = [20, 0]; //The center of the world
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [theme]);

  return (
    <div className="map-wrapper">
      <MapContainer
        className="markercluster-map"
        center={center}
        zoom={2}
        ref={mapRef}
        style={{ height: "70vh", width: "100%" }}
      >
        {/* LIGHT TILES LAYER */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
          opacity={theme === "light" ? 1 : 0}
          className="map-tile-layer"
          zIndex={theme === "light" ? 10 : 1} // Bring to front when active
        />
        {/* DARK TILES LAYER */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
          opacity={theme === "dark" ? 1 : 0}
          className="map-tile-layer"
          zIndex={theme === "dark" ? 10 : 1} // Bring to front when active
        />
        <MarkerClusterGroup
          chunkedLoading // Optimization for many markers
          spiderfyOnMaxZoom={true}
        >
          {startups.map((startup) => (
            <Marker key={startup.id} position={[startup.lat, startup.lng]}>
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
  );
}

export default MapPage;
