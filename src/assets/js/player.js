import {
  disableCanvas,
  hideControls,
  enableCanvas,
  showControls,
  resetCanvas,
  resetAnswer,
  hideWord,
  showWord,
} from "./paint.js";
import { disableChat, enableChat } from "./chat.js";

const board = document.getElementById("jsBoard");
const notifs = document.getElementById("jsNotifs");

//플레이어 영역에 한 명씩 그리기`
//전체 room에 속한 socket 전부 받아와서 각각 뿌리기
const addPlayer = (players) => {
  board.innerHTML = "";
  players.forEach((player) => {
    const playerView = document.createElement("div");
    const playerElement = document.createElement("span");
    playerView.style.backgroundImage = `url(${player.avatar})`;
    playerElement.innerText = `${player.nickname} : ${player.points}`;
    playerView.appendChild(playerElement);
    board.appendChild(playerView);
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
export const handleLeaderNotif = () => {
  disableCanvas();
  hideControls();
  disableChat();
  hideWord();
  notifs.innerText = `당신 차례입니다 `;
};

export const handleLeaderTurn = () => {
  enableCanvas();
  showControls();
  disableChat();
  notifs.innerText = `그림을 그려주세요 ❗ `;
};

export const handleSetWord = () => {
  showWord();
  notifs.innerText = `무엇을 그리실건가요?`;
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
  resetAnswer();
};

export const handleGameStarting = () => {
  hideWord();
  notifs.innerText = "😀  Game will start soon!";
};
