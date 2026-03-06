import React from "react";
import "../styles/ListPage.css";

import { BiLinkExternal, BiCalendarAlt, BiGhost } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function ListPage({ startups, isLoading, onReset }) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="loader-div">Searching the Atlas...</div>;
  }

  return (
    <div className="card-container">
      {startups.length > 0 ? (
        startups.map((startup) => (
          <div
            key={startup.id}
            className="startup-card clickable"
            onClick={() => navigate(`/startup/${startup.id}`)}
          >
            <div className="card-right-info">
              {startup.is_seeking_funding && (
                <div className="funding-badge">Seeking Funding </div>
              )}
              <div className="founded-year">
                <BiCalendarAlt size={26} />
                Founded : {startup.founded}
              </div>
            </div>

            <div className="card-header">
              <h2>{startup.name}</h2>
            </div>

            <div className="card-details">
              <p>
                <strong>Industry:</strong> {startup.industry}
              </p>
              <p>
                <strong>Location:</strong> {startup.country},{" "}
                {startup.continent}
              </p>
            </div>

            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-website-btn"
                onClick={(e) => e.stopPropagation()}
              >
                {" "}
                Visit Website <BiLinkExternal />
              </a>
            )}
          </div>
        ))
      ) : (
        <div className="no-results-container">
          <BiGhost size={75} className="no-results-icon" />
          <h3>No Startups Found</h3>
          <p>
            Try adjusting your filters or search terms to find what you're
            looking for.
          </p>
          <button className="reset-btn-simple" onClick={onReset}>
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default ListPage;
