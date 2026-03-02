import "./App.css";

import { useState, useEffect } from "react";

function App() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api")
      .then((res) => res.json())
      .then((data) => setStartups(data))
      .catch((err) => console.error("Error connecting to API:", err));
  }, []);

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
