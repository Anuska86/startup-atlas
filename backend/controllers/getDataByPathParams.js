import { startups } from "../data/data.js";

export const getDataByParams = (req, res) => {
  const { field, term } = req.params;

  const allowedFields = ["country", "continent", "industry", "name"];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({
      error: `Invalid field: '${field}'.Please use one of: ${allowedFields.join(",")} `,
    });
  }

  const filteredDataParams = startups.filter((startup) => {
    return startup[field]?.toString().toLowerCase() === term.toLowerCase();
  });
  res.json(filteredDataParams);
};
