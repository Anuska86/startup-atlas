import React from "react";

import "../styles/StartupDetails.css";

import { useParams, useNavigate } from "react-router-dom";
import {
  BiArrowBack,
  BiGlobe,
  BiRocket,
  BiDollarCircle,
  BiCheckShield,
  BiMap,
} from "react-icons/bi";

function StartupDetails({ startups }) {
  const { id } = useParams(); //Grabing the id from the url
  const navigate = useNavigate();

  const startup = startups.find((startup) => startup.id == id); //important to use == instead of === in case tgat te ID is a string in the url but a number in a data

  if (!startup) {
    return (
      <div className="loader-div">
        <p>Loading startup intelligence...</p>
        <button onClick={() => navigate("/list")} className="reset-btn-simple">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="details-page-container">
      {/* Navigation Header */}
      <button className="back-nav-btn" onClick={() => navigate(-1)}>
        <BiArrowBack /> Back to Atlas
      </button>

      <div className="details-main-card">
        {/* Top Header Section */}
        <div className="details-header">
          <div className="title-area">
            <h1>{startup.name}</h1>
            <div className="details-badges">
              {startup.is_seeking_funding && (
                <span className="funding-pill">Seeking Funding</span>
              )}
              {startup.has_mvp && <span className="mvp-pill">MVP Ready</span>}
            </div>
          </div>
          <div className="details-meta">
            <span>
              <BiMap /> {startup.country}, {startup.continent}
            </span>
            <span>Founded: {startup.founded}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="details-content-grid">
          <div className="details-description">
            <h3>Mission & Vision</h3>
            <p>
              {startup.description ||
                "The Atlas is currently gathering more description data for this startup."}
            </p>
          </div>

          <div className="details-sidebar">
            <div className="info-box">
              <h4>Industry Stats</h4>
              <ul>
                <li>
                  <strong>Industry:</strong> {startup.industry}
                </li>
                <li>
                  <strong>Stage:</strong>{" "}
                  {startup.has_mvp ? "Post-MVP" : "Pre-MVP"}
                </li>
                <li>
                  <strong>Investment:</strong>{" "}
                  {startup.is_seeking_funding ? "Open" : "Closed"}
                </li>
              </ul>
            </div>
            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noreferrer"
                className="detail-web-link"
              >
                Visit Official Site <BiGlobe />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupDetails;
