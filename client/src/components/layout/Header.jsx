import "../../styles/Header.css";
import { StartupAtlasLogo } from "../common/Logo.jsx";

import { NavLink, useLocation } from "react-router-dom";
import {
  BiSearch,
  BiHomeAlt,
  BiListUl,
  BiMapAlt,
  BiMapPin,
  BiTargetLock,
  BiX,
  BiDollarCircle,
  BiRocket,
  BiMoon,
  BiSun,
} from "react-icons/bi";
import { useState } from "react";

function Header({
  theme,
  toggleTheme,
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleReset,
  filters,
  setFilters,
  uniqueIndustries,
  uniqueCountries,
  uniqueCategories,
  filteredCount,
  isFiltering,
  isFilterActive,
  detectLocation,
  handleManualLocationSearch,
  userCoords,
  setUserCoords,
  proximityRadius,
}) {
  const [tempLocation, setTempLocation] = useState("");

  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleManualLocationSearch(tempLocation);
  };

  const handleClearLocation = () => {
    setUserCoords(null);
    setTempLocation("");
  };

  return (
    <header className="app-header">
      <div className="header-top-row traditional-layout">
        <NavLink to="/" className="header-brand-link">
          <StartupAtlasLogo />
          <h1 className="header-title">Startup Atlas</h1>
        </NavLink>
        <nav className="view-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <BiHomeAlt size={20} /> Home
          </NavLink>
          <NavLink
            to="/list"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <BiListUl size={20} /> List View
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? "nav-link icon-link active" : "nav-link icon-link"
            }
          >
            <BiMapAlt size={20} /> Map View
          </NavLink>
        </nav>

        <div className="theme-btn">
          <button
            className="theme-btn-pill"
            onClick={toggleTheme}
            aria-label="Toggle"
          >
            {theme === "light" ? (
              <>
                <BiMoon size={18} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <BiSun size={18} />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SEARCH & LOCATION CONTROLS */}
      {location.pathname !== "/" &&
        !location.pathname.startsWith("/startup/") && (
          <div className="header-controls">
            <div className="search-and-location-row">
              <div className="search-container">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by industry (e.g.AI)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>
                  <BiSearch size={20} />
                  <span>Search</span>
                </button>
                {searchTerm && (
                  <button className="reset-btn" onClick={handleReset}>
                    <BiX size={20} /> Clear
                  </button>
                )}
              </div>

              {/* Proximity Location Controls */}
              <div className="location-control-group">
                <button
                  className={`location-gps-btn ${userCoords ? "active" : ""}`}
                  onClick={userCoords ? handleClearLocation : detectLocation}
                  title={
                    userCoords ? "Clear location" : "Use my current location"
                  }
                >
                  <BiTargetLock size={20} />
                  <span>Near Me</span>
                </button>

                <form className="location-manual-form" onSubmit={handleSubmit}>
                  <BiMapPin className="pin-icon" />
                  <input
                    type="text"
                    placeholder="City or Address..."
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                  />
                  {userCoords && (
                    <button
                      type="button"
                      className="loc-clear-btn"
                      onClick={handleClearLocation}
                      title="Clear location"
                    >
                      <BiX size={18} />
                    </button>
                  )}
                </form>
              </div>
            </div>

            {isFilterActive && (
              <div className="results-count-bar">
                <div className="results-info">
                  <p>
                    Found <strong>{filteredCount}</strong>{" "}
                    {filteredCount === 1 ? "startup" : "startups"}
                  </p>

                  {userCoords && (
                    <span className="proximity-badge">
                      Within {proximityRadius}km
                    </span>
                  )}
                </div>

                <button className="reset-all-filters-btn" onClick={handleReset}>
                  <BiX size={18} /> Reset All Filters
                </button>
              </div>
            )}

            <div className="filter-bar">
              {/* Industry Select */}
              <div className="filter-group">
                <span>Industry</span>
                <select
                  value={filters.industry}
                  onChange={(e) =>
                    setFilters({ ...filters, industry: e.target.value })
                  }
                >
                  <option value="All">All Industries</option>
                  {uniqueIndustries
                    .filter((ind) => ind !== "All")
                    .map((ind, i) => (
                      <option key={`ind-${ind}-${i}`} value={ind}>
                        {ind}
                      </option>
                    ))}
                </select>
              </div>

              {/* Location Select */}
              <div className="filter-group">
                <span>Location</span>
                <select
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                >
                  <option value="All">All Countries</option>
                  {uniqueCountries
                    .filter((con) => con !== "All")
                    .map((con, i) => (
                      <option key={`con-${con}-${i}`} value={con}>
                        {con}
                      </option>
                    ))}
                </select>
              </div>

              {/* Category Select */}
              <div className="filter-group">
                <span>Category</span>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="All">All Categories</option>
                  {uniqueCategories
                    .filter((cat) => cat !== "All")
                    .map((cat, i) => (
                      <option key={`cat-${cat}-${i}`} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              {/* Checkboxes */}
              {/* Seeking Funding Checkbox */}
              <label className="checkbox-label">
                <input
                  id="seeking-funding"
                  type="checkbox"
                  checked={filters.is_seeking_funding}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      is_seeking_funding: e.target.checked,
                    })
                  }
                />
                <BiDollarCircle size={20} /> Seeking Funding
              </label>
              {/* Has MVP Checkbox */}
              <label className="checkbox-label">
                <input
                  id="has-mvp"
                  type="checkbox"
                  checked={filters.has_mvp}
                  onChange={(e) =>
                    setFilters({ ...filters, has_mvp: e.target.checked })
                  }
                />
                <BiRocket size={20} /> Has MVP
              </label>
            </div>
          </div>
        )}
    </header>
  );
}

export default Header;
