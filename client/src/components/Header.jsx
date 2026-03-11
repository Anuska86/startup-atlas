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
}) {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="header-top">
        <h1>Startup Atlas</h1>
        <button className="theme-btn" onClick={toggleTheme}>
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

      {location.pathname !== "/" && (
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
          {isFiltering && (
            <div className="results-count-bar">
              <p>
                Found <strong>{filteredCount}</strong>{" "}
                {filteredCount === 1 ? "startup" : "startups"}
              </p>
            </div>
          )}

          <div className="filter-bar">
            {/* Industry Select */}
            <select
              value={filters.industry}
              onChange={(e) =>
                setFilters({ ...filters, industry: e.target.value })
              }
            >
              {uniqueIndustries.map((ind, i) => (
                <option key={`ind-${ind}-${i}`} value={ind}>
                  {ind}
                </option>
              ))}
            </select>

            {/* Continent Select */}
            <select
              value={filters.continent}
              onChange={(e) =>
                setFilters({ ...filters, continent: e.target.value })
              }
            >
              {uniqueContinents.map((con, i) => (
                <option key={`con-${con}-${i}`} value={con}>
                  {con}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              {uniqueCategories.map((cat, i) => (
                <option key={`cat-${cat}-${i}`} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Checkboxes */}
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    is_seeking_funding: e.target.checked,
                  })
                }
              />
              <BiDollarCircle size={20} /> Seeking Funding
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
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
