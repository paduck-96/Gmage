"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSocket = exports.getSocket = void 0;

var _notifications = require("./notifications.js");

var _chat = require("./chat.js");

var _paint = require("./paint.js");

var _player = require("./player.js");

var _room = require("./room.js");

var socket = null;

var getSocket = function getSocket() {
  return socket;
};

exports.getSocket = getSocket;

var initSocket = function initSocket(aSocket) {
  socket = aSocket;
  socket.on("newUser", _notifications.handleNewUser);
  socket.on("disconnected", _notifications.handleDisconnected);
  socket.on("newMsg", _chat.handleNewMessage);
  socket.on("beganPath", _paint.handleBeganPath);
  socket.on("strokedPath", _paint.handleStrokedPath);
  socket.on("filled", _paint.handleFilled);
  socket.on("playerUpdate", _player.handlePlayerUpdate);
  socket.on("gameStarted", _player.handleGameStarted);
  socket.on("writeWord", _player.handleSetWord);
  socket.on("leaderNotif", _player.handleLeaderNotif);
  socket.on("leaderTurn", _player.handleLeaderTurn);
  socket.on("gameEnded", _player.handleGameEnded);
  socket.on("gameStarting", _player.handleGameStarting);
  socket.on("getRoomNames", _room.appendRoomNames);
};

exports.initSocket = initSocket;