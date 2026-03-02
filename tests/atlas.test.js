import request from "supertest";
import express from "express";

import { apiRouter } from "../routes/apiRoutes.js";

//Mock app to test the routes

const app = express();
app.use("/api", apiRouter);

describe("Startup Atlas - Path Parameters", () => {
  //Valid industry search
  test("Success: should find startups by industry", async () => {
    const res = await request(app).get("/api/industry/AI");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.some((s) => s.name === "TechNova AI")).toBe(true);
  });

  test("Failure:should block invalid fields with 400 error", async () => {
    const res = await request(app).get("/api/employees/50");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("Invalid field");
  });
});
