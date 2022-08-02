"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleNewUser = exports.handleDisconnected = void 0;

var _sockets = require("./sockets.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var gameBox = document.getElementById("jsGame");
var socket; //알림 보여주기 위한 칸 구성

var fireNotification = function fireNotification(text, color) {
  var notification = document.createElement("div");
  notification.innerHTML = text;
  notification.style.backgroundColor = color;
  notification.className = "notification";
  gameBox.appendChild(notification);
}; //어떤 알림?
//새로운 유저 입장


var handleNewUser = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var nickname, rooms, roomsNick;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nickname = _ref.nickname, rooms = _ref.rooms;
            roomsNick = rooms.map(function (room) {
              return room.nickname;
            });

            if (roomsNick.indexOf(nickname) < 0) {
              fireNotification(" \uC0C8\uB85C\uC6B4 \uCC38\uC5EC\uC790 ".concat(nickname, "\uC774 \uC785\uC7A5\uD588\uC2B5\uB2C8\uB2E4"), "rgb(0,122,125)");
            }

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleNewUser(_x) {
    return _ref2.apply(this, arguments);
  };
}(); //유저 로그아웃


exports.handleNewUser = handleNewUser;

var handleDisconnected = function handleDisconnected(_ref3) {
  var nickname = _ref3.nickname;
  fireNotification("".concat(nickname, "\uC774 \uB5A0\uB0AC\uC2B5\uB2C8\uB2E4"), "rgb(255,149,0");
};

exports.handleDisconnected = handleDisconnected;