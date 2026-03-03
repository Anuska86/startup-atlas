import express from "express";

import { getAllData } from "../controllers/getAllData.js";
import { getDataByParams } from "../controllers/getDataByPathParams.js";

export const apiRouter = express.Router();

apiRouter.get("/", getAllData);
apiRouter.get("/:field/:term", getDataByParams);
