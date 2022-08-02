"use strict";

var _sockets = require("./sockets.js");

var body = document.querySelector("body");
var socket = io();
socket.on("userLogin", function (data) {
  if (!data) {
    body.className = "loggedOut";
  } else {
    body.className = "loggedIn";
    socket.emit("setNickname", {
      nickname: data.nickname,
      avatar: data.image_url
    });
    (0, _sockets.initSocket)(socket);
  }
});