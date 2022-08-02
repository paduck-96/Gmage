"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//유저 저장
//테스트 위해 임의 구현, DB에서 가져와야함
var sockets = [];
var rooms = [];
var inProgress = false;
var word = null;
var leader = null;
var timeout = null; //시간 설정
//시간 설정

var times = {
  startTime: 5000,
  wordTime: 5000,
  paintTime: 30000
};
var roomType = {
  SET_LEADER: "SET_LEADER",
  INSERT_SOCKET: "INSERT_SOCKET",
  DELETE_SOCKET: "DELETE_SOCKET",
  UPDATE_PROGRESS: "UPDATE_PROGRESS"
}; //방 정보 얻기
//DB에서 가져와야함

var getRoom = function getRoom(roomName) {
  return rooms.filter(function (room) {
    return room.roomName === roomName;
  })[0];
};

var setRoom = function setRoom(roomName, type, data) {
  rooms = rooms.map(function (room) {
    if (room.roomName === roomName) {
      switch (type) {
        case roomType.SET_LEADER:
          room.roomLeader = data;
          break;

        case roomType.INSERT_SOCKET:
          room.sockets.push(data);
          break;

        case roomType.DELETE_SOCKET:
          room = room.sockets.filter(room.roomName !== roomName);
          break;

        case roomType.UPDATE_PROGRESS:
          room.inProgress = data;
          break;

        default:
          break;
      }
    }

    return room;
  });
};

var chooseLeader = function chooseLeader(roomSockets) {
  return roomSockets[Math.floor(Math.random() * roomSockets.length)];
};

var socketEvents = function socketEvents(socket, io) {
  //session & socket 연결
  socket.user = socket.request.session.user;
  io.emit("userLogin", socket.user);

  var broadcast = function broadcast(event, data) {
    return socket.broadcast.emit(event, data);
  };

  var superBroadcast = function superBroadcast(event, data) {
    return io.emit(event, data);
  }; //특정 방에만 전달


  var roomSocketEmit = function roomSocketEmit(roomName, event, data) {
    return io.to(roomName).emit(event, data);
  };

  var startGame = function startGame(roomName) {
    var room = getRoom(roomName);

    if (room.sockets.length > 1) {
      if (!room.inProgress) {
        setRoom(roomName, roomType.UPDATE_PROGRESS, true);
        setRoom(roomName, roomType.SET_LEADER, chooseLeader(room.sockets)); //사용자 input 생성하기

        roomSocketEmit(roomName, "gameStarting");
        setTimeout(function () {
          roomSocketEmit(roomName, "gameStarted");
          io.to(room.roomLeader.id).emit("leaderNotif");
          setTimeout(function () {
            io.to(room.roomLeader.id).emit("writeWord");
            socket.on("setWord", function (_ref) {
              var word = _ref.word;
              var room = getRoom(socket.roomName);
              room.answer = word;
            });
            setTimeout(function () {
              io.to(room.roomLeader.id).emit("leaderTurn"); // 게임 종료

              timeout = setTimeout(function () {
                //못 맞추면 점수 추가
                addPoints(room.roomLeader.id, 5, roomName);
                endGame(roomName);
              }, times.paintTime); //단어 정하는 시간
            }, times.wordTime); //단어 입력 받는 시간
          }, 1000); //게임 시작하는 타이밍
        }, times.startTime);
      }
    }
  };

  var endGame = function endGame(roomName) {
    setRoom(roomName, roomType.UPDATE_PROGRESS, false);
    inProgress = false;
    roomSocketEmit(roomName, "gameEnded");

    if (timeout !== null) {
      clearTimeout(timeout);
    } //게임 재시작


    setTimeout(function () {
      return startGame(roomName);
    }, times.startTime);
  };

  var addPoints = function addPoints(id, point, roomName) {
    var room = getRoom(roomName);
    room.sockets = room.sockets.map(function (socket) {
      if (socket.id === id) {
        socket.points += point;
      }

      return socket;
    });
    roomSocketEmit(roomName, "playerUpdate", {
      sockets: room.sockets
    });
    endGame(roomName);
    clearTimeout(timeout);
  }; //닉네임 설정


  socket.on("setNickname", function (_ref2) {
    var nickname = _ref2.nickname,
        avatar = _ref2.avatar;
    socket.nickname = nickname;
    socket.avatar = avatar;
    sockets.push({
      id: socket.id,
      points: 0,
      nickname: nickname,
      avatar: avatar
    });
    superBroadcast("getRoomNames", rooms);
  }); //방 접속시

  socket.on("joinGameRoom", function (_ref3) {
    var roomName = _ref3.roomName;
    socket.roomName = roomName; // 해당 유저를 특정이름의 방에 입장시키기.

    socket.join(roomName); // 새로 생성한 방이라면...

    if (rooms.filter(function (room) {
      return room.roomName === roomName;
    }).length === 0) {
      var newRoom = {
        inProgress: false,
        roomName: roomName,
        roomLeader: null,
        sockets: []
      };
      rooms.push(newRoom);
      superBroadcast("getRoomNames", rooms);
    }

    rooms = rooms.map(function (room) {
      if (room.roomName === roomName) {
        room.sockets.push({
          id: socket.id,
          points: 0,
          nickname: socket.nickname,
          avatar: socket.avatar
        });
      }

      return room;
    });
    var room = getRoom(roomName); // 같은 방 인원들에게 알리기.

    roomSocketEmit(roomName, "newUser", {
      nickname: socket.nickname,
      rooms: rooms
    });
    roomSocketEmit(roomName, "playerUpdate", {
      sockets: room.sockets
    });
    startGame(socket.roomName);
  }); // 퇴장시... disconnect & disconnected

  socket.on("disconnect", function () {
    rooms = rooms.map(function (room) {
      if (room.roomName === socket.roomName) {
        room.sockets = room.sockets.filter(function (aSocket) {
          return aSocket.id !== socket.id;
        });
      }

      return room;
    });
    var room = getRoom(socket.roomName);

    if (room) {
      if (room.sockets.length === 1) {
        endGame(room.roomName);
      } else if (room.leader && socket.id === room.leader.id) {
        endGame(room.roomName);
      }

      roomSocketEmit(socket.roomName, "playerUpdate", {
        sockets: room.sockets
      });
    }

    roomSocketEmit(socket.roomName, "disconnected", {
      nickname: socket.nickname
    });
  }); // 메시지를 전송

  socket.on("sendMsg", function (_ref4) {
    var message = _ref4.message;
    var room = getRoom(socket.roomName);

    if (message === room.answer) {
      roomSocketEmit(socket.roomName, "newMsg", {
        message: "\uD83E\uDD47 Winner is ".concat(socket.nickname, ", word was: ").concat(room.answer),
        nickname: "😀 Bot"
      });
      addPoints(socket.id, 10, socket.roomName);
    } else {
      roomSocketEmit(socket.roomName, "newMsg", {
        message: message,
        nickname: socket.nickname
      });
    }
  }); // 그리기 시작좌표 받기

  socket.on("beginPath", function (_ref5) {
    var x = _ref5.x,
        y = _ref5.y;
    return roomSocketEmit(socket.roomName, "beganPath", {
      x: x,
      y: y
    });
  }); // 그리고 있는 좌표 받기(시작이후 좌표)

  socket.on("strokePath", function (_ref6) {
    var x = _ref6.x,
        y = _ref6.y,
        color = _ref6.color;
    roomSocketEmit(socket.roomName, "strokedPath", {
      x: x,
      y: y,
      color: color
    });
  });
  socket.on("fill", function (_ref7) {
    var color = _ref7.color;
    roomSocketEmit(socket.roomName, "filled", {
      color: color
    });
  });
};

var _default = socketEvents;
exports.default = _default;