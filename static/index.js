const socket = io();

socket.on("getMsg", (msg) => {
  socket.emit("newMsg", msg);
  console.log(`me:${msg}`);
});
socket.on("sendMsg", (data) => {
  const { msg, nickname } = data;
  console.log(`${nickname} : ${msg}`);
});
