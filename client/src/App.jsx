import "./styles/App.css";
import { startups as fallbackData } from "./data/data.js";
import { supabase } from "./supabaseClient.js";

import HomePage from "./components/HomePage.jsx";
import MapPage from "./components/MapPage.jsx";
import ListPage from "./components/ListPage.jsx";
import StartupDetails from "./components/StartupDetails.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
    country: "All",
    category: "All",
    is_seeking_funding: false,
    has_mvp: false,
  });

  const uniqueIndustries = [
    "All",
    ...new Set(
      startups
        .map((s) => s.industry)
        .filter((value) => value && value.trim() !== ""),
    ),
  ].sort();
  const uniqueCountries = [
    "All",
    ...new Set(
      startups
        .map((s) => s.country)
        .filter((value) => value && value.trim() !== ""),
    ),
  ].sort();
  const uniqueCategories = [
    "All",
    ...new Set(
      startups
        .map((s) => s.category)
        .filter((value) => value && value.trim() !== ""),
    ),
  ].sort();

  const filteredStartups = startups.filter((startup) => {
    const matchSearch =
      (startup.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (startup.industry?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );

    const matchIndustry =
      filters.industry === "All" || startup.industry === filters.industry;

    const matchCountry =
      filters.country === "All" || startup.country === filters.country;

    const matchCategory =
      filters.category === "All" || startup.category === filters.category;

    const matchFunding =
      filters.is_seeking_funding === false ? true : startup.is_seeking_funding;

    const matchMVP = filters.has_mvp === false ? true : startup.has_mvp;

    return (
      matchSearch &&
      matchIndustry &&
      matchCountry &&
      matchCategory &&
      matchFunding &&
      matchMVP
    );
  });

  //Are checkbox active

  const isFilterActive =
    filters.industry !== "All" ||
    filters.country !== "All" ||
    filters.category !== "All" ||
    filters.is_seeking_funding !== false ||
    filters.has_mvp !== false;

  //Screen mode

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  //Initial Fetch: first supabase, then fallback data.js

  useEffect(() => {
    const getInitialData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("startups").select("*");

        if (error) throw error;

        console.log("🚀 Supabase Success! Data found:", data);
        setStartups(data);
      } catch (error) {
        console.warn(
          "Supabase unreacheable.Using local data.js fallback",
          error,
        );
        setStartups(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };
    getInitialData();
  }, []);

  //Handle the search: fist supabase, else fallback data

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    //If search is empty, then get all the data
    if (!searchTerm) {
      handleReset();
      return;
    }

    //Search name OR industry for the search term

    try {
      const { data, error } = (await supabase.from("startups").select("*")).or(
        `name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%`,
      );

      if (error) throw error;
      setStartups(data);
    } catch (error) {
      //Vercel fallback Search: data.js

      console.log("Supabase search failed, searching locally...");
      const filtered = fallbackData.filter(
        (s) =>
          s.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setStartups(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  //Reset the search bar

  const handleReset = async () => {
    setSearchTerm("");
    setFilters({
      industry: "All",
      country: "All",
      category: "All",
      is_seeking_funding: false,
      has_mvp: false,
    });
    setIsLoading(true);

    try {
      const { data, error } = await supabase.from("startups").select("*");

      if (error) throw new Error();

      setStartups(data);
    } catch (error) {
      console.error("Error resetting atlas:", error);
      setStartups(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  //Checking if some data is filtering

  const isFiltering =
    searchTerm !== "" ||
    filters.industry !== "All" ||
    filters.country !== "All" ||
    filters.category !== "All" ||
    filters.is_seeking_funding !== false ||
    filters.has_mvp !== false;

  //Checking if the users in on searchable pages
  const isSearchPage =
    location.pathname === "/map" || location.pathname === "/list";

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
        uniqueCountries={uniqueCountries}
        uniqueCategories={uniqueCategories}
        filteredCount={filteredStartups.length}
        isFiltering={isFiltering}
        isFilterActive={isFilterActive}
        filteredStartups={filteredStartups}
        showFilters={isSearchPage}
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
      <Footer />
    </div>
  );
}

export default App;
