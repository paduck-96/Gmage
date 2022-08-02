"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionMiddleware = exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _rootRouter = _interopRequireDefault(require("./routers/rootRouter.js"));

var _userRouter = _interopRequireDefault(require("./routers/userRouter.js"));

var _gameRouter = _interopRequireDefault(require("./routers/gameRouter.js"));

var _middlewares = require("./middlewares.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//서버사이드 프로그램 코딩
//server 연결시키기
var app = (0, _express.default)(); //pug 활용

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
var sessionMiddleware = (0, _expressSession.default)({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: _connectMongo.default.create({
    mongoUrl: process.env.DB_URL
  })
}); //express 설정
//미들웨어 설정

exports.sessionMiddleware = sessionMiddleware;
app.use((0, _morgan.default)("dev"));
app.use(sessionMiddleware);
app.use(_express.default.urlencoded({
  extended: true
}));
app.use(_middlewares.localsMiddleware);
app.use(_express.default.static(process.cwd() + "/src/assets"));
app.use(_express.default.static(process.cwd() + "/src/static"));
app.use(_express.default.static(process.cwd() + "/src/models"));
app.use("/", _rootRouter.default);
app.use("/game", _gameRouter.default);
app.use("/users", _userRouter.default);
var _default = app;
exports.default = _default;