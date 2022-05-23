//유저 저장
let sockets = [];

const socketEvents = (socket, io) => {
  const superBroadcast = (event, data) => io.emit(event, data);

  //닉네임 설정
  socket.on("setNickname", ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, points: 0, nickname });
    superBroadcast("getRoomNames", rooms);
  });
};

export default socketEvents;
