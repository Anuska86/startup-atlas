import express from "express";

const PORT = 8000;

const app = express();

app.listen(PORT, () =>
  console.log(`Server working on http://localhost:${PORT}`),
);

const celebrity = {
  type: "action hero",
  name: "JSON Statham",
};

app.get("/", (req, res) => {
  res.json(celebrity);
});
