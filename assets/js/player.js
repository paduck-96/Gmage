import {
  disableCanvas,
  hideControls,
  enableCanvas,
  showControls,
  resetCanvas,
  hideWord,
  showWord,
} from "./paint";
import { disableChat, enableChat } from "./chat";

const board = document.getElementById("jsPBoard");
const notifs = document.getElementById("jsNotifs");

//플레이어 영역에 한 명씩 그리기
//전체 room에 속한 socket 전부 받아와서 각각 뿌리기
const addPlayer = (players) => {
  board.innerHTML = "";
  players.forEach((player) => {
    const playerElement = document.createElement("span");
    playerElement.innerText = `${player.nickname} : ${player.points}`;
    board.appendChild(playerElement);
  });
};

export const handlePlayerUpdate = ({ sockets }) => addPlayer(sockets);
//게임 시작
//알림 초기화 + 채팅 기능만 활성화
export const handleGameStarted = () => {
  notifs.innerText = "";
  disableCanvas();
  hideControls();
  hideWord();
  enableChat();
};

//게임 진행자(그림그리기)
//그림보드+그림기능 활성화
export const handleLeaderNotif = ({ word }) => {
  enableCanvas();
  showControls();
  showWord();
  disableChat();
  notifs.innerText = `You are the leader❗, ⚡paint: ${word}`;
};

//게임 종료시
//채팅창만 초기화
export const handleGameEnded = () => {
  notifs.innerText = "";
  notifs.innerText = "😀  Game Ended!";
  disableCanvas();
  hideControls();
  hideWord();
  resetCanvas();
};

export const handleGameStarting = () =>
  (notifs.innerText = "😀  Game will start soon!");
