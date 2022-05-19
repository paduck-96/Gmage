import express from "express";

const gameRotuer = express.Router();

gameRotuer.get("/game");

export default gameRotuer;
