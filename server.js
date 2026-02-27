import express from "express";
import {startups} from "./data/data.js"

const PORT = 8000;

const app = express();

app.listen(PORT, () =>
  console.log(`Server working on http://localhost:${PORT}`),
);



app.get("/api", (req, res) => {
  res.json(startups);
  console.log(startups)
});
