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
  BiCalendarAlt,
  BiUserVoice,
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
              <BiMap className="meta-icon map-pin-color" />{" "}
              {startup.city && `${startup.city}, `}
              {startup.country}
            </span>
            <span>
              {" "}
              <BiCalendarAlt className="meta-icon calendar-color" />
              Founded: {startup.founded}
            </span>
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
          {/* Founders Section */}
          <section className="info-section founders-section">
            <h3>
              <BiUserVoice /> Leadership
            </h3>
            <div className="founders-display">
              <p className="founders-text">
                {startup.founders ||
                  "Information currently being updated by the Atlas team."}
              </p>
            </div>
          </section>

          <div className="details-sidebar">
            <div className="info-box">
              <h4>Industry Stats</h4>
              <ul>
                <li>
                  <span>
                    <BiCheckShield /> <strong>Industry:</strong>
                  </span>{" "}
                  {startup.industry}
                </li>
                <li>
                  <span>
                    <BiRocket /> <strong>Stage:</strong>
                  </span>
                  {startup.has_mvp ? "Post-MVP" : "Pre-MVP"}
                </li>
                <li>
                  <span>
                    <BiDollarCircle /> <strong>Investment:</strong>
                  </span>
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
