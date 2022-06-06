import { handleNewUser, handleDisconnected } from "./notifications.js";
import { handleNewMessage } from "./chat.js";
import { handleBeganPath, handleStrokedPath, handleFilled } from "./paint.js";
import {
  handlePlayerUpdate,
  handleGameStarted,
  handleLeaderNotif,
  handleGameEnded,
  handleGameStarting,
  handleSetWord,
  handleLeaderTurn,
} from "./player.js";
import { appendRoomNames } from "./room.js";

let socket = null;

export const getSocket = () => socket;

export const initSocket = (aSocket) => {
  socket = aSocket;
  socket.on("newUser", handleNewUser);
  socket.on("disconnected", handleDisconnected);
  socket.on("newMsg", handleNewMessage);
  socket.on("beganPath", handleBeganPath);
  socket.on("strokedPath", handleStrokedPath);
  socket.on("filled", handleFilled);
  socket.on("playerUpdate", handlePlayerUpdate);
  socket.on("gameStarted", handleGameStarted);
  socket.on("writeWord", handleSetWord);
  socket.on("leaderNotif", handleLeaderNotif);
  socket.on("leaderTurn", handleLeaderTurn);
  socket.on("gameEnded", handleGameEnded);
  socket.on("gameStarting", handleGameStarting);
  socket.on("getRoomNames", appendRoomNames);
};
