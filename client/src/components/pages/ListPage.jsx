import React from "react";
import "../../styles/ListPage.css";

import {
  BiLinkExternal,
  BiCalendarAlt,
  BiGhost,
  BiMapAlt,
  BiChevronRight,
  BiGlobe,
} from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";
import Button from "../common/Button.jsx";

function ListPage({ startups, isLoading, onReset }) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="loader-div">Searching the Atlas...</div>;
  }

  return (
    <div className="card-container">
      {startups.length > 0 ? (
        startups.map((startup) => {
          //City
          const city = startup.all_locations?.toLowerCase().includes("remote")
            ? "Digital Nomad"
            : startup.all_locations?.split(",")[0] || "Unknown City";
          //Country
          const country = startup.regions
            ? startup.regions
                .replace(/[{}[\]"']/g, "")
                .split(",")[0]
                .trim()
            : "Global";

          //Founded Year
          const foundedYear = startup.launched_at
            ? startup.launched_at.substring(0, 4)
            : "N/A";

          //Is seeking funding
          const isSeekingFunding = startup.stage === "Early";

          //Is Remote
          const isRemote =
            startup.all_locations?.toLowerCase().includes("remote") ||
            city === "Unknown City";

          return (
            <div
              key={startup.id}
              className="startup-card clickable"
              onClick={() => navigate(`/startup/${startup.id}`)}
            >
              <div className="card-right-info">
                {isSeekingFunding && (
                  <div className="funding-badge">Seeking Funding </div>
                )}
              </div>

              <div className="card-header">
                <h2>{startup.name}</h2>
              </div>
              <div className="founded-year">
                <BiCalendarAlt size={18} />
                Founded : {foundedYear}
              </div>

              <div className="card-details">
                <p>
                  <strong>Industry:</strong> {startup.industry}
                </p>

                {/* Shows this if NOT a remote/unknow situation */}

                {!isRemote && (
                  <p>
                    <strong>Location:</strong>{" "}
                    {city === country || !country
                      ? city
                      : `${city}, ${country}`}
                  </p>
                )}

                {isRemote ? (
                  <div className="remote-location-pill">
                    <BiGlobe size={16} />
                    Full Remote / Global
                  </div>
                ) : (
                  <Button
                    className="btn-link-to-map"
                    variant="secondary"
                    icon={BiMapAlt}
                    onClick={(e) => {
                      e.stopPropagation();

                      window.scrollTo(0, 0);

                      navigate("/map", {
                        state: {
                          flyTo: [startup.lat, startup.lng],
                          startupId: startup.id,
                        },
                      });
                    }}
                  >
                    View on Map
                  </Button>
                )}
              </div>

              <div className="card-footer-hint">
                <span>View Details</span>
                <BiChevronRight size={25} />
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-results-container">
          <BiGhost size={75} className="no-results-icon" />
          <h3>No Startups Found</h3>
          <p>
            Try adjusting your filters or search terms to find what you're
            looking for.
          </p>
          <Button
            className="reset-btn-simple"
            variant="secondary"
            onClick={onReset}
            aria-label="reset button"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default ListPage;
