const body = document.querySelector("body");

//알림 보여주기 위한 칸 구성
const fireNotification = (text, color) => {
  const notification = document.createElement("div");
  notification.innerHTML = text;
  notification.style.backgroundColor = color;
  notification.className = "notification";
  body.appendChild(notification);
};
//어떤 알림?

//새로운 유저 입장
export const handleNewUser = ({ nickname }) => {
  if (loggedInUser.nickname !== nickname) {
    fireNotification(
      ` 새로운 참여자 ${nickname}가 입장했습니다`,
      "rgb(0,122,125)"
    );
  }
};

//유저 로그아웃
export const handleDisconnected = ({ nickname }) => {
  fireNotification(`${nickname}이 떠났습니다`, "rgb(255,149,0");
};
