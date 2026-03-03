import "../styles/MapPage.css";

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

function MapPage({ startups }) {
  const isLightMode = window.matchMedia("(prefers-color-scheme:light)").matches;

  const tileUrl = isLightMode
    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const center = [20, 0]; //The center of the world

  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: "70vh", width: "100%" }}
      >
        <TileLayer
          url={tileUrl}
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
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
