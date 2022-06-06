import { initSocket } from "./sockets.js";

const body = document.querySelector("body");

const socket = io();
socket.on("userLogin", (data) => {
  if (!data) {
    body.className = "loggedOut";
  } else {
    body.className = "loggedIn";
    socket.emit("setNickname", {
      nickname: data.nickname,
      avatar: data.image_url,
    });
    initSocket(socket);
  }
});
