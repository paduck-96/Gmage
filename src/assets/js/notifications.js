import { getSocket } from "./sockets.js";

const gameBox = document.getElementById("jsGame");
let socket;

//알림 보여주기 위한 칸 구성
const fireNotification = (text, color) => {
  const notification = document.createElement("div");

  notification.innerHTML = text;
  notification.style.backgroundColor = color;
  notification.className = "notification";
  gameBox.appendChild(notification);
};
//어떤 알림?

//새로운 유저 입장
export const handleNewUser = async ({ nickname, rooms }) => {
  const roomsNick = rooms.map((room) => room.nickname);
  if (roomsNick.indexOf(nickname) < 0) {
    fireNotification(
      ` 새로운 참여자 ${nickname}이 입장했습니다`,
      "rgb(0,122,125)"
    );
  }
};

//유저 로그아웃
export const handleDisconnected = ({ nickname }) => {
  fireNotification(`${nickname}이 떠났습니다`, "rgb(255,149,0");
};
