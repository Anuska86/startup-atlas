import React from "react";
import "../styles/ListPage.css";

import { BiLinkExternal, BiCalendarAlt } from "react-icons/bi";

function ListPage({ startups, isLoading }) {
  if (isLoading) {
    return <div className="loader-div">Searching the Atlas...</div>;
  }

  return (
    <div className="card-container">
      {startups.length > 0 ? (
        startups.map((startup, index) => (
          <div key={index} className="startup-card">
            <h2>{startup.name}</h2>
            <span className="founded-year">
              <BiCalendarAlt size={26} />
              Founded in: {startup.founded}
            </span>

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
              >
                {" "}
                Visit Website <BiLinkExternal />
              </a>
            )}
          </div>
        ))
      ) : (
        <p className="no-results-p">No startups found matching that criteria</p>
      )}
    </div>
  );
}

export default ListPage;
