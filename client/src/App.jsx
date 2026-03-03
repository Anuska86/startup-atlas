import "./styles/App.css";
import MapPage from "./components/MapPage.jsx";

import { useState, useEffect } from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";

function App() {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  );

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

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by industry (e.g.AI)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
          {searchTerm && (
            <button className="reset-btn" onClick={handleReset}>
              X Clear
            </button>
          )}
        </div>
      </header>

      <main>
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              isLoading ? (
                <div className="loader-div">Searching the Atlas...</div>
              ) : (
                <div className="card-container">
                  {startups.length > 0 ? (
                    startups.map((startup, index) => (
                      <div key={index} className="startup-card">
                        <h2>{startup.name}</h2>
                        <p>
                          <strong>Industry:</strong> {startup.industry}
                        </p>
                        <p>
                          <strong>Location:</strong> {startup.country},{" "}
                          {startup.continent}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="no-results-p">
                      No startups found matching that criteria
                    </p>
                  )}
                </div>
              )
            }
          />

          {/*Map Route */}
          <Route
            path="/map"
            element={<MapPage startups={startups} theme={theme} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
