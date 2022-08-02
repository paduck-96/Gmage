"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startKakaoLogin = exports.postSignup = exports.postLogin = exports.login = exports.kakaoLogout = exports.getSignup = exports.finishKakaoLogin = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _User = _interopRequireDefault(require("../models/User.js"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _init = _interopRequireDefault(require("../init.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var login = function login(req, res) {
  res.render("login", {
    pageTitle: "로그인"
  });
};

exports.login = login;

var postLogin = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, email, password, pageTitle, socialUser, user, ok;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, email = _req$body.email, password = _req$body.password;
            pageTitle = "로그인";
            _context.next = 4;
            return _User.default.findOne({
              email: email,
              socialKakao: true
            });

          case 4:
            socialUser = _context.sent;
            _context.next = 7;
            return _User.default.findOne({
              email: email,
              socialKakao: false
            });

          case 7:
            user = _context.sent;

            if (!socialUser) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", res.status(400).render("login", {
              pageTitle: pageTitle,
              errorMessage: "카카오 로그인으로 이용해주세요"
            }));

          case 10:
            if (user) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", res.status(400).render("login", {
              pageTitle: pageTitle,
              errorMessage: "해당 이메일은 존재하지 않습니다"
            }));

          case 12:
            _context.next = 14;
            return _bcrypt.default.compare(password, user.password);

          case 14:
            ok = _context.sent;

            if (ok) {
              _context.next = 17;
              break;
            }

            return _context.abrupt("return", res.status(400).render("login", {
              pageTitle: pageTitle,
              errorMessage: "비밀번호 오류입니다"
            }));

          case 17:
            req.session.loggedIn = true;
            req.session.user = user;

            _init.default.once("login", function (socket) {
              socket.data.user = req.session.user;
            });

            return _context.abrupt("return", res.redirect("/game"));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function postLogin(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.postLogin = postLogin;

var getSignup = function getSignup(req, res) {
  res.render("signup");
};

exports.getSignup = getSignup;

var postSignup = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body2, nickname, email, password, confirmPassword, eExists, nExists;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body2 = req.body, nickname = _req$body2.nickname, email = _req$body2.email, password = _req$body2.password, confirmPassword = _req$body2.confirmPassword;

            if (!(password !== confirmPassword)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", res.status(400).render("signup", {
              pageTitle: "회원가입",
              errorMessage: "비밀번호 확인 오류"
            }));

          case 3:
            _context2.next = 5;
            return _User.default.exists({
              email: email
            });

          case 5:
            eExists = _context2.sent;

            if (!eExists) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt("return", res.status(400).render("signup", {
              pageTitle: "회원가입",
              errorMessage: "이미 가입되어 있는 이메일입니다!"
            }));

          case 8:
            _context2.next = 10;
            return _User.default.exists({
              nickname: nickname
            });

          case 10:
            nExists = _context2.sent;

            if (!nExists) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt("return", res.status(400).render("signup", {
              pageTitle: "회원가입",
              errorMessage: "이미 가입되어 있는 닉네임입니다!"
            }));

          case 13:
            _context2.prev = 13;
            _context2.next = 16;
            return _User.default.create({
              nickname: nickname,
              email: email,
              password: password,
              socialKakao: false,
              image_url: "https://api.multiavatar.com/45678945/".concat(Math.round(Math.random() * 1000), ".png")
            });

          case 16:
            return _context2.abrupt("return", res.redirect("/"));

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](13);
            return _context2.abrupt("return", res.status(400).render("signup", {
              pageTitle: "회원가입",
              errorMessage: _context2.t0._message
            }));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[13, 19]]);
  }));

  return function postSignup(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postSignup = postSignup;

var startKakaoLogin = function startKakaoLogin(req, res) {
  try {
    var baseUrl = "https://kauth.kakao.com/oauth/authorize";
    var options = {
      client_id: process.env.CLIENT_ID,
      redirect_uri: "http://localhost:5000/login/finish",
      response_type: "code"
    };
    var params = new URLSearchParams(options).toString();
    var finalUrl = "".concat(baseUrl, "?").concat(params);
    return res.redirect(finalUrl);
  } catch (err) {
    return res.send(err);
  }
};

exports.startKakaoLogin = startKakaoLogin;

var finishKakaoLogin = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var baseUrl, options, params, finalUrl, tokenRequest, _$set, access_token, userRequest, user, updateUser;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            baseUrl = "https://kauth.kakao.com/oauth/token";
            options = {
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              grant_type: "authorization_code",
              redirect_uri: "http://localhost:5000/login/finish",
              code: req.query.code
            };
            params = new URLSearchParams(options).toString();
            finalUrl = "".concat(baseUrl, "?").concat(params);
            _context3.next = 6;
            return (0, _nodeFetch.default)(finalUrl, {
              method: "POST",
              "Content-type": "application/json"
            });

          case 6:
            _context3.next = 8;
            return _context3.sent.json();

          case 8:
            tokenRequest = _context3.sent;

            if (!("access_token" in tokenRequest)) {
              _context3.next = 36;
              break;
            }

            access_token = tokenRequest.access_token;
            _context3.next = 13;
            return (0, _nodeFetch.default)("https://kapi.kakao.com/v2/user/me", {
              headers: {
                Authorization: "Bearer ".concat(access_token),
                "Content-type": "application/json",
                property_keys: ["kakao_account.email"]
              }
            });

          case 13:
            _context3.next = 15;
            return _context3.sent.json();

          case 15:
            userRequest = _context3.sent;
            _context3.next = 18;
            return _User.default.findOne({
              email: userRequest.kakao_account.email
            });

          case 18:
            user = _context3.sent;

            if (user) {
              _context3.next = 27;
              break;
            }

            _context3.next = 22;
            return _User.default.create({
              email: userRequest.email,
              password: "",
              user_id: userRequest.id,
              socialKakao: true,
              nickname: userRequest.properties.nickname,
              image_url: userRequest.properties.profile_image
            });

          case 22:
            user = _context3.sent;
            req.session.loggedIn = true;
            req.session.user = user;

            _init.default.once("login", function (socket) {
              socket.data.user = req.session.user;
            });

            return _context3.abrupt("return", res.redirect("/game"));

          case 27:
            _context3.next = 29;
            return _User.default.findOneAndUpdate(user, {
              $set: (_$set = {
                socialKakao: true,
                email: userRequest.email,
                password: "",
                user_id: userRequest.id
              }, _defineProperty(_$set, "socialKakao", true), _defineProperty(_$set, "nickname", userRequest.properties.nickname), _defineProperty(_$set, "image_url", userRequest.properties.profile_image), _$set)
            }, {
              new: true
            });

          case 29:
            updateUser = _context3.sent;
            req.session.loggedIn = true;
            req.session.user = updateUser;

            _init.default.once("login", function (socket) {
              socket.data.user = req.session.user;
            });

            return _context3.abrupt("return", res.redirect("/game"));

          case 36:
            return _context3.abrupt("return", res.redirect("/"));

          case 37:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function finishKakaoLogin(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.finishKakaoLogin = finishKakaoLogin;

var kakaoLogout = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var baseUrl, options, params, finalUrl;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            req.session.destroy();
            baseUrl = "https://kauth.kakao.com/oauth/logout";
            options = {
              client_id: process.env.CLIENT_ID,
              logout_redirect_uri: "http://localhost:5000/"
            };
            params = new URLSearchParams(options).toString();
            finalUrl = "".concat(baseUrl, "?").concat(params);
            return _context4.abrupt("return", res.redirect(finalUrl));

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function kakaoLogout(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
/*
export const kakaoExit = async (req, res) => {
  req.session.destroy();
  const baseUrl = "https://kapi.kakao.com/v1/user/unlink";
  const Exist = await (
    await fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
        property_keys: ["kakao_account.email"],
      },
    })
  ).json();
};
*/


exports.kakaoLogout = kakaoLogout;