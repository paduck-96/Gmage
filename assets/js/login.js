//server의 kakao 로그인 옮길 예정
import { initSocket } from "./sockets";

const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";
const nickname = localStorage.getItem(NICKNAME);
const logIn = (nickname) => {
  // 소켓을 연결해 줌
  // eslint-disable-next-line no-undef
  const socket = io("/");
  socket.emit(window.events.setNickname, { nickname });
  initSocket(socket);
};

if (nickname === null) {
  body.className = LOGGED_OUT;
} else {
  // 로그인이 되어있는 상태
  body.className = LOGGED_IN;
  logIn(nickname);
}
const handleFormSubmit = (e) => {
  e.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  input.value = "";
  // local저장소에 nickname값을 저장
  localStorage.setItem(NICKNAME, value);
  body.className = LOGGED_IN;
  logIn(value);
};
if (loginForm) {
  loginForm.addEventListener("submit", handleFormSubmit);
}
