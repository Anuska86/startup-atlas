import "../styles/MapPage.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapPage({ startups }) {
  const center = [20, 0]; //The center of the world

  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: "70vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
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
      </MapContainer>
    </div>
  );
}

export default MapPage;
