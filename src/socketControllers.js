//socket event들 처리

const socketController = (socket) => {
  socket.on("setNickname", ({ nickname }) => {
    socket.nickname = nickname;
    socket.broadcast.emit("newUser", { nickname });
  });
};

export default socketController;
