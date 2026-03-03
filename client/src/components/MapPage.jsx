import "../styles/MapPage.css";
import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BiChip,
  BiLeaf,
  BiLineChart,
  BiHeart,
  BiRefresh,
  BiGlobe,
} from "react-icons/bi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

function MapPage({ startups, theme }) {
  const mapRef = useRef(null);

  const center = [30, -15];
  const zoom = 3;

  //Reset the map view

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(startCenter, startZoom, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  //Render the map
  useEffect(() => {
    if (mapRef.current && startups.length > 0) {
      // Small timeout
      const timer = setTimeout(() => {
        mapRef.current.invalidateSize();

        //Calculate the bounds of the map so all the markers can be visible
        const bounds = L.latLngBounds(startups.map((s) => [s.lat, s.lng]));
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50],
          animate: true,
        });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [theme, startups]);

  const createCustomIcon = (startup) => {
    let SelectedIcon = BiChip;
    const industry = startup.industry?.toLowerCase() || "";
    if (industry.includes("energy")) SelectedIcon = BiLeaf;
    if (industry.includes("fin")) SelectedIcon = BiLineChart;
    if (industry.includes("health")) SelectedIcon = BiHeart;

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
    <div className="map-page-container">
      <div className="map-controls">
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
      <div className="map-wrapper">
        <div className="map-legend">
          <h4>Industry Key</h4>
          <div className="legend-item">
            <BiLeaf className="icon energy" /> Renewable Energy
          </div>
          <div className="legend-item">
            <BiLineChart className="icon fin" /> FinTech
          </div>
          <div className="legend-item">
            <BiHeart className="icon health" /> HealthTech
          </div>
          <div className="legend-item">
            <BiChip className="icon tech" /> Technology / AI
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
