import "../../styles/Header.css";
import Button from "../common/Button.jsx";

import { runThemeTransition } from "../../utils/themeTransition.js";
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
  BiChevronDown,
  BiMenu,
} from "react-icons/bi";
import { useState, useEffect, useRef } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();

  const onThemeToggle = (e) => {
    runThemeTransition(e, toggleTheme);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleManualLocationSearch(tempLocation);
  };

  const handleClearLocation = () => {
    setUserCoords(null);
    setTempLocation("");
  };

  //Handle Click Outside the dropdown (phone)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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

          <div
            className={`nav-dropdown ${menuOpen ? "open" : ""}`}
            ref={dropdownRef}
          >
            <button
              className="dropdown-toggle-btn nav-link"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <BiMenu size={20} /> Views <BiChevronDown />
            </button>

            <div className="dropdown-menu" onClick={() => setMenuOpen(false)}>
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
            </div>
          </div>
        </nav>

        <div className="theme-btn">
          <Button
            className="theme-toggle-action"
            variant="secondary"
            onClick={onThemeToggle}
            icon={theme === "light" ? BiMoon : BiSun}
            aria-label="Toggle Theme"
          ></Button>
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
                {/* MOBILE FILTER TRIGGER */}
                <button
                  className="mobile-filter-trigger"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <BiMenu size={20} /> Filters{" "}
                  {isFilterActive && <span className="active-dot"></span>}
                </button>

                <Button
                  className="desktop-search-btn"
                  variant="primary"
                  onClick={handleSearch}
                  icon={BiSearch}
                >
                  Search
                </Button>

                {searchTerm && (
                  <Button variant="secondary" onClick={handleReset} icon={BiX}>
                    Clear
                  </Button>
                )}
              </div>

              {/* Proximity Location Controls */}
              <div className="location-control-group">
                <Button
                  className={`location-gps-btn ${userCoords ? "active" : ""}`}
                  variant="secondary"
                  onClick={userCoords ? handleClearLocation : detectLocation}
                  icon={BiTargetLock}
                  title={
                    userCoords ? "Clear location" : "Use my current location"
                  }
                >
                  Near Me
                </Button>

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

            {/* Results info */}
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
                <Button
                  className="reset-all-filters-btn"
                  variant="secondary"
                  onClick={handleReset}
                  icon={BiX}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
            <div
              className={`filter-sidebar-overlay ${showMobileFilters ? "open" : ""}`}
              onClick={() => setShowMobileFilters(false)}
            >
              <div className="filter-bar" onClick={(e) => e.stopPropagation()}>
                <div
                  className="sidebar-header"
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border-color)",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", margin: 0 }}>Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <BiX size={24} />
                  </button>
                </div>

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
                <Button
                  variant="primary"
                  className="apply-filters-btn"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
    </header>
  );
}

export default Header;
