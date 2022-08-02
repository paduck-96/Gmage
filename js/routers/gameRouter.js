"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gameRouter = _express.default.Router();

gameRouter.get("/", function (req, res) {
  res.render("game");
});
var _default = gameRouter;
exports.default = _default;