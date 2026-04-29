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
  BiStats,
  BiLinkExternal,
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

  const city = startup.all_locations ? startup.all_locations.split(",")[0] : "";
  const country = startup.regions
    ? startup.regions
        .replace(/[\[\]']/g, "")
        .split(",")[0]
        .trim()
    : "Global";
  const foundedYear = startup.launched_at
    ? startup.launched_at.substring(0, 4)
    : "N/A";
  const isSeekingFunding = startup.stage === "Early";
  const tagsList = startup.tags
    ? startup.tags
        .replace(/[\[\]']/g, "")
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "")
    : [];

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
              {isSeekingFunding && (
                <span className="funding-pill">Seeking Funding</span>
              )}
              {startup.has_mvp && <span className="mvp-pill">MVP Ready</span>}
              <span className="stage-pill">{startup.stage} Stage</span>
            </div>
          </div>
          <div className="details-meta">
            <span>
              <BiMap className="meta-icon map-pin-color" />{" "}
              {city && `${city}, `} {country}
            </span>
            <span>
              <BiCalendarAlt className="meta-icon calendar-color" />
              Founded: {foundedYear}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="details-content-grid">
          <div className="details-description">
            {/* 1. Main Mission & Vision */}
            <section className="info-block">
              <h3>Mission & Vision</h3>
              <p>{startup.one_liner || "Gathering mission data..."}</p>
            </section>

            {/* Deep Dive / Long Description */}
            <section className="info-block deep-dive-section">
              <h3>Detailed Analysis</h3>
              <p className="long-desc-text">
                {startup.long_description && startup.long_description.trim()
                  ? startup.long_description
                  : "Right now we don't have further information about this startup. Check back soon as we continuously update our database with detailed insights!"}
              </p>
            </section>

            <div className="details-website">
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
            </div>
          </div>

          <div className="details-sidebar">
            {/* Leadership Section */}
            <section className="info-section sidebar-box">
              <h3>
                <BiUserVoice /> Founders
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
            {tagsList.length > 0 && (
              <div className="info-box tech-box">
                <h4>
                  <BiCodeBlock /> Keywords & Stack
                </h4>
                <div className="tech-badge-container">
                  {tagsList.map((tag, index) => (
                    <span key={index} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="info-box">
              <h4>
                {" "}
                <BiStats /> Industry Stats
              </h4>
              <ul>
                <li>
                  <span>
                    <BiCheckShield /> <strong>Industry:</strong>
                  </span>{" "}
                  {startup.industry}
                </li>
                <li>
                  <span>
                    <BiRocket /> <strong>Status:</strong>
                  </span>
                  {startup.status}
                </li>
                <li>
                  <span>
                    <BiUserVoice /> <strong>Team Size:</strong>
                  </span>{" "}
                  {startup.team_size || "N/A"}
                </li>
                <li>
                  <span>
                    <BiDollarCircle /> <strong>Investment:</strong>
                  </span>{" "}
                  {isSeekingFunding ? "Open" : "Closed"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupDetails;
