import React from "react";

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
            <p>
              <strong>Industry:</strong> {startup.industry}
            </p>
            <p>
              <strong>Location:</strong> {startup.country}, {startup.continent}
            </p>
          </div>
        ))
      ) : (
        <p className="no-results-p">No startups found matching that criteria</p>
      )}
    </div>
  );
}

export default ListPage;
