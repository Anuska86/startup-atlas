import "./App.css";

import { useState, useEffect } from "react";

function App() {
  const [startups, setStartups] = useState([]);

  //Fetching the data
  useEffect(() => {
    fetch("http://localhost:8000/api")
      .then((res) => res.json())
      .then((data) => setStartups(data))
      .catch((err) => console.error("Error connecting to API:", err));
  }, []);

  //handle the search

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    //If search is empty, then get all the data
    if (!searchTerm) {
      const res = await fetch("http://localhost:8000/api");
      const data = await res.json();
      setStartups(data);
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
    }
  };

  return (
    <div className="App-div">
      <h1>Startup Atlas</h1>
      <div className="card-container">
        {startups.map((startup, index) => (
          <div key={index} className="startup-card">
            <h2>{startup.name}</h2>
            <p>
              <strong>Industry:</strong> {startup.industry}
            </p>
            <p>
              <strong>Location:</strong> {startup.country}, {startup.continent}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
