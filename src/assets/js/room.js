import { getSocket } from "./sockets.js";

// 생성된 룸들을 표시할 리스트
const jsCreateRoom = document.getElementById("jsCreateRoom");
const jsRooms = document.getElementById("jsRooms");
const body = document.querySelector("body");
const quit = document.getElementById("quit");

//접속 이벤트 전달
const joinRoom = (roomName) => {
  getSocket().emit("joinGameRoom", { roomName });
  body.className = "enterRoom";
};

//방 목록 추가
export const appendRoomNames = (rooms) => {
  jsRooms.innerHTML = "";
  rooms.map((room) => {
    const span = document.createElement("span");
    span.innerHTML = `
      <span>✅ Room: ${room.roomName}  (${room.sockets.length})</span>
    `;
    span.className = "roomList";
    jsRooms.appendChild(span);
  });
};

//방 생성
//없는 방 목록 작성 시
const handlecreateRoom = (e) => {
  e.preventDefault();
  const input = jsCreateRoom.querySelector("input");
  const { value } = input;
  joinRoom(value);
  input.value = "";
};

const handleQuit = () => {
  leaveRoom;
};
//모든 방 제목 입력 창에
if (jsCreateRoom) {
  jsCreateRoom.addEventListener("submit", handlecreateRoom);
}

if (quit) {
  quit.addEventListener("click", handleQuit);
}
