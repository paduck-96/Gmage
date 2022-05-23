import { logInSocket } from "./sockets.js";

const NICKNAME = "";
const nickname = (req, res) => {
  NICKNAME = req.session.user.nickname;
};

const logIn = (nickname) => {
  const socket = io();
  socket.emit("setNickname", { nickname });
  logInSocket(socket);
};

if (!nickname === null) logIn(nickname);
