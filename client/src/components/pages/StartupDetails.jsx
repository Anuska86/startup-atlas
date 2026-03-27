import React from "react";
import "../../styles/StartupDetails.css";
import Button from "../common/Button.jsx";

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
  BiTargetLock,
  BiExclude,
  BiCodeBlock,
  BiStats
} from "react-icons/bi";

function StartupDetails({ startups }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const startup = startups.find((startup) => startup.id == id);

  if (!startup) {
    return (
      <div className="loader-div">
        <p>Loading startup intelligence...</p>
        <Button
          variant="secondary"
          onClick={() => navigate("/list")}
          icon={BiArrowBack}
        >
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="details-page-container">
      <Button
        className="back-nav-btn"
        onClick={() => navigate(-1)}
        icon={BiArrowBack}
      >
        Back to Atlas
      </Button>

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
              <BiCalendarAlt className="meta-icon calendar-color" />
              Founded: {startup.founded}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="details-content-grid">
          <div className="details-description">
            {/* 1. Main Mission & Vision */}
            <section className="info-block">
              <h3>Mission & Vision</h3>
              <p>{startup.description || "Gathering mission data..."}</p>
            </section>

            {/* Problem Solved */}
            {startup.problem_solved && (
              <section className="info-block problem-section">
                <h3>
                  <BiExclude /> The Problem
                </h3>
                <p>{startup.problem_solved}</p>
              </section>
            )}

            {/* Deep Dive / Long Description */}
            {startup.long_description && (
              <section className="info-block deep-dive-section">
                <h3>Detailed Analysis</h3>
                <p className="long-desc-text">{startup.long_description}</p>
              </section>
            )}
          </div>

          <div className="details-sidebar">
            {/* Leadership Section */}
            <section className="info-section sidebar-box">
              <h3>
                <BiUserVoice /> Leadership
              </h3>
              <p className="founders-text">
                {startup.founders || "Information being updated..."}
              </p>
            </section>

            {/* Target Market */}
            {startup.target_market && (
              <div className="info-box market-box">
                <h4>
                  <BiTargetLock /> Target Market
                </h4>
                <p>{startup.target_market}</p>
              </div>
            )}

            {/* Tech Stack  */}
            {startup.tech_stack && startup.tech_stack.length > 0 && (
              <div className="info-box tech-box">
                <h4>
                  <BiCodeBlock /> Core Tech
                </h4>
                <div className="tech-badge-container">
                  {startup.tech_stack.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="info-box">
              <h4> <BiStats /> Industry Stats</h4>
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
                  </span>{" "}
                  {startup.has_mvp ? "Post-MVP" : "Pre-MVP"}
                </li>
                <li>
                  <span>
                    <BiDollarCircle /> <strong>Investment:</strong>
                  </span>{" "}
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
