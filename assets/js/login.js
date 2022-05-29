import { login } from "../../src/controllers/userControllers.js";
import { initSocket } from "./sockets.js";

const body = document.querySelector("body");

const {
  nickname,
} = (req, res) => {
  req.session.user;
};

const logIn = (nickname) => {
  const socket = io();
  socket.emit("setNickname", { nickname });
  initSocket(socket);
};

if (nickname === null) {
  body.className = "loggedOut";
} else {
  body.className = "loggedIn";
  logIn(nickname);
}
