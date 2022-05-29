import { getSocket } from "./sockets";

// 생성된 룸들을 표시할 리스트
const jsRooms = document.getElementById("jsRooms");
const jsCreateRoom = document.getElementById("jsCreateRoom");
const body = document.querySelector("body"); //안될수도 있음

//접속 이벤트 전달
const joinRoom = (roomName) => {
  getSocket().emit("joinGameRoom", { roomName });
  body.className = "enterRoom";
  console.log(roomName);
};

//방 목록 추가
export const appendRoomNames = (rooms) => {
  jsRooms.innerHTML = "";
  rooms.map((room) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>✅ Room: ${room.roomName}</span>
    `;
    jsRooms.appendChild(li);
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

//모든 방 제목 입력 창에
if (jsCreateRoom) {
  jsCreateRoom.addEventListener("submit", handlecreateRoom);
}
