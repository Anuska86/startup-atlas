import "../styles/HomePage.css";

import { Link } from "react-router-dom";
import { BiRocket, BiMapAlt, BiListUl } from "react-icons/bi";

function HomePage({ startups }) {
  const totalStartups = startups.length;
  const industries = [...new Set(startups.map((startup) => startup.industry))]
    .length;

  return (
    <div className="home-container">
      {/* SECTION 1: HERO (Top) */}
      <section className="hero-section">
        <BiRocket className="hero-icon" />
        <h1>Explore the Global Startup Ecosystem</h1>
        <p>
          Discover {totalStartups} innovative companies across {industries}{" "}
          industries worlwide{" "}
        </p>

        <div className="home-actions">
          <Link to="/map" className="home-btn primary">
            <BiMapAlt size={26} /> Launch Interactive Map
          </Link>
          <Link to="/list" className="home-btn secondary">
            <BiListUl size={26} /> Browse List
          </Link>
        </div>
      </section>

      {/* SECTION 2: INTRODUCTION (Middle) */}
      <section className="intro-section">
        <div className="intro-content">
          <h2>Your Window into Global Innovations</h2>
          <p>
            The Startup Atlas tracks emerging tech hubs across the globe,
            mapping the industries shaping our future.
          </p>
        </div>

        <div className="features-highlights">
          <div className="feature-item">
            <div className="feature-dot purple"></div>

            <span>Real-time Data</span>
          </div>
          <div className="feature-item">
            <div className="feature-dot blue"></div>
            <span>Global Coverage</span>
          </div>
          <div className="feature-item">
            <div className="feature-dot pink"></div>
            <span>Industry Insights</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATS (Bottom) */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{totalStartups}</h3>
            <p>Companies Tracked</p>
          </div>
          <div className="stat-card">
            <h3>{industries}</h3>
            <p>Unique Industries</p>
          </div>
          <div className="stat-card">
            <h3>Global</h3>
            <p>5+ Continents</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
