let socket = null;

export const logInSocket = (aSocket) => {
  socket = aSocket;
  socket.on("newUser", handleNewUser);
  socket.on("disconnected", handleDisconnected);
  socket.on("newMsg", handleNewMessage);
  socket.on("beganPath", handleBeganPath);
  socket.on("strokedPath", handleStrokedPath);
  socket.on("filled", handleFilled);
  socket.on("playerUpdate", handlePlayerUpdate);
  socket.on("gameStarted", handleGameStarted);
  socket.on("leaderNotif", handleLeaderNotif);
  socket.on("gameEnded", handleGameEnded);
  socket.on("gameStarting", handleGameStarting);
  socket.on("getRoomNames", appendRoomNames);
};
