import request from "supertest";
import express from "express";

import { apiRouter } from "../routes/apiRoutes.js";

//Mock app to test the routes

//getDataByParams - PATH PARAMETERS

const app = express();
app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found. Please check the API documentation.",
  });
});

describe("Startup Atlas - Path Parameters", () => {
  //Valid industry search
  test("Success: should find startups by industry", async () => {
    const res = await request(app).get("/api/industry/AI");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.some((startup) => startup.name === "Mistral AI")).toBe(
      true,
    );
  });

  test("Failure:should block invalid fields with 400 error", async () => {
    const res = await request(app).get("/api/employees/50");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("Invalid field");
  });

  //Non-exist term

  test("Success:should return an empty array if the term is not found", async () => {
    const res = await request(app).get("/api/industry/Pizza");

    expect(res.statusCode).toBe(200); //Because the req is valid
    expect(Array.isArray(res.body)).toBe(true); //It should be an array
    expect(res.body.length).toBe(0); //but empty
  });
});

//getAllData QUERY PARAMETERS

describe("Startup Atlas - Query Parameters", () => {
  test("Success:should filter by multiple queries(industry and has_mvp", async () => {
    const res = await request(app)
      .get("/api")
      .query({ industry: "AI", has_mvp: "true" });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    res.body.forEach((startup) => {
      expect(startup.industry.toLowerCase()).toBe("ai");
      expect(startup.has_mvp).toBe(true);
    });
  });

  test("Success:should filter boolean fields like is_seeking_funding", async () => {
    const res = await request(app)
      .get("/api")
      .query({ is_seeking_funding: "false" });

    expect(res.statusCode).toBe(200);

    expect(
      res.body.every((startup) => startup.is_seeking_funding === false),
    ).toBe(true);
  });
});

//404 Not Found

describe("Startup Atlas - Global Error Handling", () => {
  test("Failure: should return 404 for a non-existent endpoint", async () => {
    const res = await request(app).get("/api/this/is/not/a/route");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(
      "Endpoint not found. Please check the API documentation.",
    );
  });
});
