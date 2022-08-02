"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendRoomNames = void 0;

var _sockets = require("./sockets.js");

// 생성된 룸들을 표시할 리스트
var jsCreateRoom = document.getElementById("jsCreateRoom");
var jsRooms = document.getElementById("jsRooms");
var body = document.querySelector("body");
var quit = document.getElementById("quit"); //접속 이벤트 전달

var joinRoom = function joinRoom(roomName) {
  (0, _sockets.getSocket)().emit("joinGameRoom", {
    roomName: roomName
  });
  body.className = "enterRoom";
};

var checkRoom = function checkRoom(roomName) {}; //방 목록 추가


var appendRoomNames = function appendRoomNames(rooms) {
  jsRooms.innerHTML = "";
  rooms.map(function (room) {
    var span = document.createElement("span");
    room.sockets.length == 4 ? span.innerHTML = "\n    <span>\u2705 Room: ".concat(room.roomName, "  (").concat(room.sockets.length, ") <span><strong>Full</strong></span> </span>\n  ") : span.innerHTML = "\n      <span>\u2705 Room: ".concat(room.roomName, "  (").concat(room.sockets.length, ")</span>\n    ");
    span.className = "roomList";
    jsRooms.appendChild(span);
  });
}; //방 생성
//없는 방 목록 작성 시


exports.appendRoomNames = appendRoomNames;

var handlecreateRoom = function handlecreateRoom(e) {
  e.preventDefault();
  var input = jsCreateRoom.querySelector("input");
  var value = input.value;
  checkRoom(value);
  joinRoom(value);
  input.value = "";
};

var handleQuit = function handleQuit() {
  leaveRoom;
}; //모든 방 제목 입력 창에


if (jsCreateRoom) {
  jsCreateRoom.addEventListener("submit", handlecreateRoom);
}

if (quit) {
  quit.addEventListener("click", handleQuit);
}