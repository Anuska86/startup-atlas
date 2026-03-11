import "./styles/App.css";
import HomePage from "./components/HomePage.jsx";
import MapPage from "./components/MapPage.jsx";
import ListPage from "./components/ListPage.jsx";
import StartupDetails from "./components/StartupDetails.jsx";
import Header from "./components/Header.jsx";

import { useState, useEffect } from "react";
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";

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
    category: "All",
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
  const uniqueCategories = [
    "All",
    ...new Set(startups.map((startup) => startup.category)),
  ];

  const filteredStartups = startups.filter((startup) => {
    const matchSearch =
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchIndustry =
      filters.industry === "All" || startup.industry === filters.industry;

    const matchContinent =
      filters.continent === "All" || startup.continent === filters.continent;

    const matchCategory =
      filters.category === "All" || startup.category === filters.category;

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
      category: "All",
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

  //Checking if some data is filtering

  const isFiltering =
    searchTerm !== "" ||
    filters.industry !== "All" ||
    filters.continent !== "All" ||
    filters.category !== "All" ||
    filters.is_seeking_funding !== false ||
    filters.has_mvp !== false;

  return (
    <div className="app-div">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        filters={filters}
        setFilters={setFilters}
        uniqueIndustries={uniqueIndustries}
        uniqueContinents={uniqueContinents}
        uniqueCategories={uniqueCategories}
        filteredCount={filteredStartups.length}
        isFiltering={isFiltering}
        filteredStartups={filteredStartups}
      />
      <main>
        <Routes>
          {/* Home Route */}

          <Route path="/" element={<HomePage startups={startups} />}></Route>

          {/* Startups List Route */}
          <Route
            path="/list"
            element={
              <ListPage
                startups={filteredStartups}
                isLoading={isLoading}
                onReset={handleReset}
              />
            }
          />

          {/*Startups Map Route */}
          <Route
            path="/map"
            element={<MapPage startups={filteredStartups} theme={theme} />}
          />

          {/*Startup Details*/}
          <Route
            path="/startup/:id"
            element={<StartupDetails startups={startups} theme={theme} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
