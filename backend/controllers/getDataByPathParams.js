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
    const value = startup[field]?.toString().toLowerCase();
    const search = term.toLowerCase();
    return value && value.includes(search);
  });

  res.json(filteredDataParams);
};
