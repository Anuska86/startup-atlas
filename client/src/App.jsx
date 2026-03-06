import "./styles/App.css";
import HomePage from "./components/HomePage.jsx";
import MapPage from "./components/MapPage.jsx";
import ListPage from "./components/ListPage.jsx";

import { useState, useEffect } from "react";
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

function App() {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();

  //Theme
  const [theme, setTheme] = useState(
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  );

  //Filters
  const [filters, setFilters] = useState({
    industry: "All",
    continent: "All",
    is_seeking_funding: false,
    has_mvp: false,
  });

  const uniqueIndustries = [
    "All",
    ...new Set(startups.map((startup) => startup.industry)),
  ];
  const uniqueContinents = [
    "All",
    ...new Set(startups.map((startup) => startup.continent)),
  ];

  const filteredStartups = startups.filter((startup) => {
    const matchSearch =
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchIndustry =
      filters.industry === "All" || startup.industry === filters.industry;
    const matchContinent =
      filters.continent === "All" || startup.continent === filters.continent;
    const matchFunding =
      filters.is_seeking_funding === false ? true : startup.is_seeking_funding;
    const matchMVP = filters.has_mvp === false ? true : startup.has_mvp;

    return (
      matchSearch && matchIndustry && matchContinent && matchFunding && matchMVP
    );
  });

  //Screen mode

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  //Fetching the data
  useEffect(() => {
    fetch("http://localhost:8000/api")
      .then((res) => res.json())
      .then((data) => setStartups(data))
      .catch((err) => console.error("Error connecting to API:", err));
  }, []);

  //Handle the search

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    //If search is empty, then get all the data
    if (!searchTerm) {
      const res = await fetch("http://localhost:8000/api");
      const data = await res.json();
      setStartups(data);
      setIsLoading(false);
      return;
    }

    //Flexible path

    try {
      const res = await fetch(
        `http://localhost:8000/api/industry/${searchTerm}`,
      );
      const data = await res.json();
      setStartups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Reset the search bar

  const handleReset = async () => {
    setSearchTerm("");
    setFilters({
      industry: "All",
      continent: "All",
      is_seeking_funding: false,
      has_mvp: false,
    });
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api");
      const data = await res.json();
      setStartups(data);
    } catch (error) {
      console.error("Error resetting atlas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-div">
      <header className="app-header">
        <div className="header-top">
          <h1>Startup Atlas</h1>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
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
            🏠 Home
          </NavLink>
          <NavLink
            to="/list"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            📋 List View
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? "nav-link icon-link active" : "nav-link icon-link"
            }
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="neon-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Map View
          </NavLink>
        </nav>

        {location.pathname !== "/" && (
          <>
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
                  X Clear
                </button>
              )}
            </div>

            <div className="filter-bar">
              {/* Industry Select */}
              <select
                onChange={(e) =>
                  setFilters({ ...filters, industry: e.target.value })
                }
              >
                {uniqueIndustries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>

              {/* Continent Select */}
              <select
                onChange={(e) =>
                  setFilters({ ...filters, continent: e.target.value })
                }
              >
                {uniqueContinents.map((con) => (
                  <option key={con} value={con}>
                    {con}
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
                💰 Seeking Funding
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setFilters({ ...filters, has_mvp: e.target.checked })
                  }
                />
                🚀 Has MVP
              </label>
            </div>
          </>
        )}
      </header>

      <main>
        <Routes>
          {/* Home Route */}

          <Route path="/" element={<HomePage startups={startups} />}></Route>

          {/* Startups List Route */}
          <Route
            path="/list"
            element={
              <ListPage startups={filteredStartups} isLoading={isLoading} />
            }
          />

          {/*Startups Map Route */}
          <Route
            path="/map"
            element={<MapPage startups={filteredStartups} theme={theme} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
