import express from "express";
import { home } from "../controllers/gameControllers.js";

const gameRouter = express.Router();

gameRouter.get("/lobby", home);

export default gameRouter;
