"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _userControllers = require("../controllers/userControllers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootRouter = _express.default.Router();

rootRouter.get("/", function (req, res) {
  res.render("home");
});
rootRouter.route("/login").get(_userControllers.login).post(_userControllers.postLogin);
rootRouter.route("/login/start").get(_userControllers.startKakaoLogin);
rootRouter.route("/login/finish").get(_userControllers.finishKakaoLogin);
rootRouter.get("/logout", _userControllers.kakaoLogout);
rootRouter.route("/signup").get(_userControllers.getSignup).post(_userControllers.postSignup);
var _default = rootRouter;
exports.default = _default;