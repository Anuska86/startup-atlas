import "../styles/HomePage.css";

import { Link } from "react-router-dom";
import { BiRocket, BiMapAlt, BiListUl } from "react-icons/bi";

function HomePage({ startups }) {
  const totalStartups = startups.length;
  const industries = [...new Set(startups.map((startup) => startup.industry))]
    .length;

  return (
    <div className="home-container">
      <section className="hero-section">
        <BiRocket className="hero-icon" />
        <h1>Explore the Global Startup Ecosystem</h1>
        <p>
          Discover {totalStartups} innovative companies across {industries}{" "}
          industries worlwide{" "}
        </p>

        <div className="home-actions">
          <Link to="/map" className="home-btn primary">
            <BiMapAlt /> Launch Interactive Map
          </Link>
          <Link to="/list" className="home-btn secondary">
            <BiListUl /> Browse List
          </Link>
        </div>
      </section>

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
    </div>
  );
}

export default HomePage;
