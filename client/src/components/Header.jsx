import "../styles/Header.css";

import { NavLink, useLocation } from "react-router-dom";
import {
  BiSearch,
  BiHomeAlt,
  BiListUl,
  BiMapAlt,
  BiDollarCircle,
  BiRocket,
  BiMoon,
  BiSun,
  BiX,
} from "react-icons/bi";

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
  uniqueContinents,
  uniqueCategories,
  filteredCount,
  isFiltering,
  isFilterActive,
}) {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="header-top-row">
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

        <h1>Startup Atlas</h1>

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

      {location.pathname !== "/" &&
        !location.pathname.startsWith("/startup/") && (
          <div className="header-controls">
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
            {isFilterActive && (
              <div className="results-count-bar">
                <p>
                  Found <strong>{filteredCount}</strong>{" "}
                  {filteredCount === 1 ? "startup" : "startups"}
                </p>
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
                  {uniqueIndustries.map((ind, i) => (
                    <option key={`ind-${ind}-${i}`} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Continent Select */}
              <div className="filter-group">
                <span>Location</span>
                <select
                  value={filters.continent}
                  onChange={(e) =>
                    setFilters({ ...filters, continent: e.target.value })
                  }
                >
                  <option value="All">All Continents</option>
                  {uniqueContinents.map((con, i) => (
                    <option key={`con-${con}-${i}`} value={con}>
                      {con}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div className="filter-group">
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="All">All Categories</option>
                  {uniqueCategories.map((cat, i) => (
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
