"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleSetWord = exports.handlePlayerUpdate = exports.handleLeaderTurn = exports.handleLeaderNotif = exports.handleGameStarting = exports.handleGameStarted = exports.handleGameEnded = void 0;

var _paint = require("./paint.js");

var _chat = require("./chat.js");

var board = document.getElementById("jsBoard");
var notifs = document.getElementById("jsNotifs"); //플레이어 영역에 한 명씩 그리기`
//전체 room에 속한 socket 전부 받아와서 각각 뿌리기

var addPlayer = function addPlayer(players) {
  board.innerHTML = "";
  players.forEach(function (player) {
    var playerView = document.createElement("div");
    var playerElement = document.createElement("span");
    playerView.style.backgroundImage = "url(".concat(player.avatar, ")");
    playerElement.innerText = "".concat(player.nickname, " : ").concat(player.points);
    playerView.appendChild(playerElement);
    board.appendChild(playerView);
  });
};

var handlePlayerUpdate = function handlePlayerUpdate(_ref) {
  var sockets = _ref.sockets;
  return addPlayer(sockets);
}; //게임 시작
//알림 초기화 + 채팅 기능만 활성화


exports.handlePlayerUpdate = handlePlayerUpdate;

var handleGameStarted = function handleGameStarted() {
  notifs.innerText = "";
  (0, _paint.disableCanvas)();
  (0, _paint.hideControls)();
  (0, _paint.hideWord)();
  (0, _chat.enableChat)();
}; //게임 진행자(그림그리기)
//그림보드+그림기능 활성화


exports.handleGameStarted = handleGameStarted;

var handleLeaderNotif = function handleLeaderNotif() {
  (0, _paint.disableCanvas)();
  (0, _paint.hideControls)();
  (0, _chat.disableChat)();
  (0, _paint.hideWord)();
  notifs.innerText = "\uB2F9\uC2E0 \uCC28\uB840\uC785\uB2C8\uB2E4 ";
};

exports.handleLeaderNotif = handleLeaderNotif;

var handleLeaderTurn = function handleLeaderTurn() {
  (0, _paint.enableCanvas)();
  (0, _paint.showControls)();
  (0, _chat.disableChat)();
  notifs.innerText = "\uADF8\uB9BC\uC744 \uADF8\uB824\uC8FC\uC138\uC694 \u2757 ";
};

exports.handleLeaderTurn = handleLeaderTurn;

var handleSetWord = function handleSetWord() {
  (0, _paint.showWord)();
  notifs.innerText = "\uBB34\uC5C7\uC744 \uADF8\uB9AC\uC2E4\uAC74\uAC00\uC694?";
}; //게임 종료시
//채팅창만 초기화


exports.handleSetWord = handleSetWord;

var handleGameEnded = function handleGameEnded() {
  notifs.innerText = "";
  notifs.innerText = "😀  Game Ended!";
  (0, _paint.disableCanvas)();
  (0, _paint.hideControls)();
  (0, _paint.hideWord)();
  (0, _paint.resetCanvas)();
  (0, _paint.resetAnswer)();
};

exports.handleGameEnded = handleGameEnded;

var handleGameStarting = function handleGameStarting() {
  (0, _paint.hideWord)();
  notifs.innerText = "😀  Game will start soon!";
};

exports.handleGameStarting = handleGameStarting;