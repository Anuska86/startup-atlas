import "./styles/App.css";
import axios from "axios";
import { useMemo } from "react";

import { useTheme } from "./contexts/ThemeContext.jsx";
import { startups as fallbackData } from "./data/data.js";
import { supabase } from "./supabaseClient.js";
import { calculateDistance } from "./utils/geoUtils.js";

import HomePage from "./components/pages/HomePage.jsx";
import MapPage from "./components/pages/MapPage.jsx";
import ListPage from "./components/pages/ListPage.jsx";
import StartupDetails from "./components/pages/StartupDetails.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";

import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//Axios defaults
axios.defaults.headers.common["User-Agent"] = "StartupAtlas/1.0";
axios.defaults.timeout = 5000;

//Console.logs in production/main

const isProduction = import.meta.env.MODE === "production";

if (isProduction) {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

function App() {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [globalStats, setGlobalStats] = useState({
    total_startups: 0,
    total_countries: 0,
    total_industries: 0,
    total_employees: 0,
  });

  const location = useLocation();

  const PROXIMITY_RADIUS = 50;

  //Theme
  const { theme, toggleTheme } = useTheme();

  //DATE CLEANING

  //Fetch real data numbers

  const fetchStats = async () => {
    const { data, error } = await supabase.rpc("get_global_stats");

    if (!error && data) {
      setGlobalStats(data);
    } else {
      console.error("Error fetching global stats:", error);
    }
  };

  //Filters
  const [filters, setFilters] = useState({
    industry: "All Industries",
    country: "All Countries",
    category: "All Categories",
    is_seeking_funding: false,
    has_mvp: false,
  });

  const uniqueCountries = useMemo(() => {
    //Clean list of countries

    const rawCountryList = startups
      .map((startup) => {
        if (!startup.regions) return null;

        return startup.regions
          .replace(/[{}[\]"']/g, "")
          .split(",")[0]
          .trim();
      })
      .filter((c) => c && c !== "Unspecified" && c !== "Remote");

    // Get unique values and sort them ALPHABETICALLY
    const sortedCountries = [...new Set(rawCountryList)].sort();

    return ["Remote", ...sortedCountries];
  }, [startups]);

  const uniqueIndustries = useMemo(
    () =>
      [
        "All Industries",
        ...new Set(
          startups
            .map((s) => s.industry)
            .filter((i) => i && i !== "Unspecified"),
        ),
      ].sort(),
    [startups],
  );

  const uniqueCategories = useMemo(
    () =>
      [
        "All Categories",
        ...new Set(
          startups
            .flatMap((startup) => {
              if (typeof startup.tags === "string") {
                return startup.tags
                  .replace(/[{}[\]"']/g, "")
                  .split(",")
                  .map((tag) => tag.trim());
              }
              return startup.tags || [];
            })
            .filter((tag) => tag && tag !== "" && tag !== "Unspecified"),
        ),
      ].sort(),
    [startups],
  );

  //FILTER LOGIC

  const filteredStartups = startups.filter((startup) => {
    //Industry

    const matchSearch =
      (startup.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (startup.industry?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );

    const matchIndustry =
      filters.industry === "All Industries" ||
      startup.industry === filters.industry;

    //Country
    const currentCountry = startup.regions
      ? startup.regions
          .replace(/[{}[\]"']/g, "")
          .split(",")[0]
          .trim()
      : "";

    const matchCountry =
      filters.country === "All Countries" || currentCountry === filters.country;

    //Category

    const matchCategory =
      filters.category === "All Categories" ||
      (startup.tags && startup.tags.includes(filters.category));

    //Seeking Funding

    const isSeekingFunding = startup.stage === "Early";

    const matchFunding =
      filters.is_seeking_funding === false ? true : isSeekingFunding;

    //MVP

    const matchMVP =
      filters.has_mvp === false ? true : startup.has_mvp === true;

    //Proximity Logic

    const matchLocation =
      !userCoords ||
      (startup.lat &&
        startup.lng &&
        calculateDistance(
          userCoords.lat,
          userCoords.lng,
          startup.lat,
          startup.lng,
        ) < PROXIMITY_RADIUS);

    return (
      matchSearch &&
      matchIndustry &&
      matchCountry &&
      matchCategory &&
      matchFunding &&
      matchMVP &&
      matchLocation
    );
  });

  //Are checkbox active

  const isFilterActive =
    filters.industry !== "All Industries" ||
    filters.country !== "All Countries" ||
    filters.category !== "All Categories" ||
    filters.is_seeking_funding !== false ||
    filters.has_mvp !== false ||
    userCoords !== null ||
    searchTerm !== "";

  //SETUP EFFECTS

  //Scroll to top

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  //Initial get data: first supabase, then fallback data.js

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        fetchStats();

        //query

        let query = supabase.from("startups").select("*");

        //Searching in all the startups

        if (searchTerm) {
          query = query.ilike("name", `%{searchTerm}%`);
        }

        if (filters.industry !== "All Industries") {
          query = query.eq("industry", filters.industry);
        }

        //Fetching the data order by ID

        const { data, error } = await query
          .order("id", { ascending: false })
          .limit(200);

        if (error) throw error;

        if (data && data.length > 0) {
          setStartups(data || []);
        } else {
          setStartups(fallbackData);
        }
      } catch (error) {
        console.warn("Primary database failed, using fallback logic.");
        setStartups(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, filters]);

  //Handle the search: fist supabase, else fallback data

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    console.log("Local search triggered for:", searchTerm);
  };

  //Reset the search bar

  const handleReset = async () => {
    setSearchTerm("");
    setFilters({
      industry: "All Industries",
      country: "All Countries",
      category: "All Categories",
      is_seeking_funding: false,
      has_mvp: false,
    });
    setUserCoords(null);
  };

  //Checking if some data is filtering

  const isFiltering =
    searchTerm !== "" ||
    filters.industry !== "All Industries" ||
    filters.country !== "All Countries" ||
    filters.category !== "All Categories" ||
    filters.is_seeking_funding !== false ||
    filters.has_mvp !== false;

  //Checking if the users in on searchable pages
  const isSearchPage =
    location.pathname === "/map" || location.pathname === "/list";

  //Get the user location

  //Geolocation

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not allowed by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => alert("Unable to retrieve your location"),
    );
  };

  //Manual location

  const handleManualLocationSearch = async (locationName) => {
    if (!locationName) {
      setUserCoords(null);
      return;
    }
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: locationName,
            format: "json",
            limit: 1,
          },
        },
      );

      if (response.data && response.data.length > 0) {
        setUserCoords({
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon),
        });
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error.response?.data || error.message);
      alert("There was an error finding that location.");
    }
  };

  return (
    <div className="app-div">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        filters={filters}
        setFilters={setFilters}
        uniqueIndustries={uniqueIndustries}
        uniqueCountries={uniqueCountries}
        uniqueCategories={uniqueCategories}
        filteredCount={
          isFilterActive ? filteredStartups.length : globalStats.total_startups
        }
        isFiltering={isFiltering}
        isFilterActive={isFilterActive}
        filteredStartups={filteredStartups}
        showFilters={isSearchPage}
        detectLocation={detectLocation}
        handleManualLocationSearch={handleManualLocationSearch}
        userCoords={userCoords}
        setUserCoords={setUserCoords}
        proximityRadius={PROXIMITY_RADIUS}
      />
      <main>
        <Routes>
          {/* Home Route */}

          <Route
            path="/"
            element={<HomePage startups={startups} globalStats={globalStats} />}
          ></Route>

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
            element={
              <MapPage startups={filteredStartups} userCoords={userCoords} />
            }
          />

          {/*Startup Details*/}
          <Route
            path="/startup/:id"
            element={<StartupDetails startups={startups} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
