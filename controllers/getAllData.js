import { startups } from "../data/data.js";

export const getAllData = (req, res) => {
  let filteredData = startups;

  const { industry, country, continent, is_seeking_funding, has_mvp } =
    req.query;

  if (industry) {
    filteredData = filteredData.filter((startup) => {
      return startup.industry.toLowerCase() === industry.toLowerCase();
    });
  }

  if (country) {
    filteredData = filteredData.filter((startup) => {
      return startup.country.toLowerCase() === country.toLowerCase();
    });
  }
  if (continent) {
    filteredData = filteredData.filter((startup) => {
      return startup.continent.toLowerCase() === continent.toLowerCase();
    });
  }

  if (is_seeking_funding) {
    filteredData = filteredData.filter((startup) => {
      return (
        startup.is_seeking_funding ===
        JSON.parse(is_seeking_funding.toLowerCase())
      );
    });
  }
  if (has_mvp) {
    filteredData = filteredData.filter((startup) => {
      return startup.has_mvp === JSON.parse(has_mvp.toLowerCase());
    });
  }
};
