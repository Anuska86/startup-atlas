import "../../styles/HomePage.css";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import { BiRocket, BiMapAlt, BiListUl } from "react-icons/bi";

const ChartSkeleton = () => (
  <div className="skeleton-container">
    {[1, 2, 3, 4, 5].map((n) => (
      <div key={n} className="skeleton-row">
        <div className="skeleton-label"></div>
        <div className="skeleton-bar-wrapper">
          <div
            className="skeleton-bar"
            style={{ width: `${100 - n * 15}%` }}
          ></div>
        </div>
      </div>
    ))}
  </div>
);

function HomePage({ startups }) {
  const totalStartups = startups.length;
  const isLoading = startups.length === 0;

  const industries = [...new Set(startups.map((startup) => startup.industry))]
    .length;

  //totals
  const totalCountries = new Set(
    startups.map((startup) => startup.country).filter((country) => country),
  ).size;

  const totalIndustries = new Set(
    startups.map((s) => s.industry).filter((i) => i),
  ).size;

  const totalEmployees = startups.reduce(
    (sum, s) => sum + (Number(s.employees) || 0),
    0,
  );
  //chartData
  const chartData = useMemo(() => {
    const counts = startups.reduce((acc, startup) => {
      acc[startup.industry] = (acc[startup.industry] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts)
      .map((key) => ({
        name: key,
        value: counts[key],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); //Top 5
  }, [startups]);

  return (
    <div className="home-container">
      {/* SECTION 1: HERO (Top) */}
      <section className="hero-section">
        <BiRocket className="hero-icon" />
        <h1>Explore the Global Startup Ecosystem</h1>
        <p>
          The Startup Atlas tracks <strong>{totalStartups}</strong> innovative
          companies across <strong>{industries}</strong> industries worldwide.
        </p>

        <div className="home-description-actions">
          <div className="action-card">
            <BiListUl size={48} className="action-icon" />
            <h3>Deep Discovery</h3>
            <p>
              Filter by industry, funding status, or MVP stage to find exactly
              what you're looking for.
            </p>
            <Link to="/list" className="home-text-link">
              Explore the List →
            </Link>
          </div>

          <div className="action-card">
            <BiMapAlt size={48} className="action-icon" />
            <h3>Proximity Search</h3>
            <p>
              Visualize the ecosystem and find innovative enterprises near your
              current location.
            </p>
            <Link to="/map" className="home-text-link">
              View the Map →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTRODUCTION (Middle) */}
      <section className="intro-section">
        <div className="intro-content">
          <h2>Your Window into Global Innovations</h2>
          <p>
            The Startup Atlas tracks emerging tech hubs across the globe,
            mapping the industries shaping our future.
          </p>
        </div>

        <div className="features-highlights">
          <div className="feature-item">
            <div className="feature-dot purple"></div>

            <span>Dynamic Data</span>
          </div>
          <div className="feature-item">
            <div className="feature-dot blue"></div>
            <span>Global Coverage</span>
          </div>
          <div className="feature-item">
            <div className="feature-dot pink"></div>
            <span>Industry Insights</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: CHARTS */}
      <section className="industry-distribution">
        <h3>Top Industry Distribution</h3>
        <div className="chart-wrapper">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 30, right: 30 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-color)", fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--sky-aqua)",
                    borderRadius: "10px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index % 2 === 0
                          ? "var(--sky-aqua)"
                          : "var(--neon-purple)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* SECTION 4: STATS (Bottom) */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Companies Tracked</h3>
            <p>{totalStartups}</p>
          </div>
          <div className="stat-card">
            <h3>Sectors</h3>
            <p>{totalIndustries} Industries</p>
          </div>
          <div className="stat-card">
            <h3>Global</h3>
            <p>{totalCountries} + Countries</p>
          </div>
          <div className="stat-card">
            <h3>Community</h3>
            <p>{totalEmployees.toLocaleString()} Employees</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
