//유저 저장
//테스트 위해 임의 구현, DB에서 가져와야함
let sockets = [];
let rooms = [];

let inProgress = false;
let word = null;
let leader = null;
let timeout = null; //시간 설정
let newPoints = {}; // 아이템 활용 위한 점수 조건

//시간 설정
const times = {
  startTime: 5000,
  itemTime: 7000,
  wordTime: 10000,
  paintTime: 30000,
};
const roomType = {
  SET_LEADER: "SET_LEADER",
  INSERT_SOCKET: "INSERT_SOCKET",
  DELETE_SOCKET: "DELETE_SOCKET",
  UPDATE_PROGRESS: "UPDATE_PROGRESS",
};

//방 정보 얻기
//DB에서 가져와야함
const getRoom = (roomName) =>
  rooms.filter((room) => room.roomName === roomName)[0];
const setRoom = (roomName, type, data) => {
  rooms = rooms.map((room) => {
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

const chooseLeader = (roomSockets) =>
  roomSockets[Math.floor(Math.random() * roomSockets.length)];

const socketEvents = (socket, io) => {
  //session & socket 연결
  socket.user = socket.request.session.user;
  io.emit("userLogin", socket.user);
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const superBroadcast = (event, data) => io.emit(event, data);
  //특정 방에만 전달
  const roomSocketEmit = (roomName, event, data) =>
    io.to(roomName).emit(event, data);

  const startGame = (roomName) => {
    const room = getRoom(roomName);
    if (room.sockets.length > 1) {
      if (!room.inProgress) {
        setRoom(roomName, roomType.UPDATE_PROGRESS, true);
        setRoom(roomName, roomType.SET_LEADER, chooseLeader(room.sockets));

        //사용자 input 생성하기
        roomSocketEmit(roomName, "gameStarting");
        setTimeout(() => {
          ``;
          roomSocketEmit(roomName, "gameStarted");
          roomSocketEmit(roomName, "itemUsed");
          setTimeout(() => {
            io.to(room.roomLeader.id).emit("leaderNotif");
            setTimeout(() => {
              io.to(room.roomLeader.id).emit("writeWord");
              socket.on("setWord", ({ word }) => {
                const room = getRoom(socket.roomName);
                room.answer = word;
              });
              setTimeout(() => {
                io.to(room.roomLeader.id).emit("leaderTurn");
                // 게임 종료
                timeout = setTimeout(() => {
                  //못 맞추면 점수 추가
                  addPoints(room.roomLeader.id, 5, roomName);
                  addItems(roomName);
                  endGame(roomName);
                  //그림 그리는 시간
                }, times.paintTime);
                //단어 정하는 시간
              }, times.wordTime);
              //다음 단계 대기
            }, 1000);
            //아이템 사용 타이밍
          }, times.itemTime);
          //게임 시작하는 타이밍
        }, times.startTime);
      }
    }
  };

  const endGame = (roomName) => {
    setRoom(roomName, roomType.UPDATE_PROGRESS, false);
    inProgress = false;
    roomSocketEmit(roomName, "gameEnded");
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    //게임 재시작
    setTimeout(() => startGame(roomName), times.startTime);
  };
  //점수 추가
  const addPoints = (id, point, roomName) => {
    const room = getRoom(roomName);
    room.sockets = room.sockets.map((socket) => {
      if (socket.id === id) {
        socket.points += point;
      }
      return socket;
    });
    roomSocketEmit(roomName, "playerUpdate", { sockets: room.sockets });
  };
  //아이템 추가
  const addItems = (roomName) => {
    const room = getRoom(roomName);
    room.sockets.map((socket) => {
      newPoints[socket.id] = socket.points;
      return newPoints;
    });
    let arr = Object.values(newPoints);
    let min = Math.min(...arr);
    if (min) {
      const leastPlayer = Object.keys(newPoints).find(
        (key) => newPoints[key] === min
      );
      for (let i = 0; i < room.sockets.length; i++) {
        if (room.sockets[i].id == leastPlayer) {
          if (room.sockets[i].item === undefined) {
            room.sockets[i].item = "독점권" || "강제종료";
          }
        }
      }
    }
    roomSocketEmit(roomName, "playerUpdate", { sockets: room.sockets });
    endGame(roomName);
    clearTimeout(timeout);
  };
  //닉네임 설정
  socket.on("setNickname", ({ nickname, avatar }) => {
    socket.nickname = nickname;
    socket.avatar = avatar;
    sockets.push({
      id: socket.id,
      points: 0,
      nickname,
      avatar,
      item: socket.item,
    });
    superBroadcast("getRoomNames", rooms);
  });

  //방 접속시
  socket.on("joinGameRoom", ({ roomName }) => {
    socket.roomName = roomName;
    // 해당 유저를 특정이름의 방에 입장시키기.
    socket.join(roomName);
    // 새로 생성한 방이라면...
    if (rooms.filter((room) => room.roomName === roomName).length === 0) {
      const newRoom = {
        inProgress: false,
        roomName: roomName,
        roomLeader: null,
        sockets: [],
      };
      rooms.push(newRoom);
      superBroadcast("getRoomNames", rooms);
    }

    rooms = rooms.map((room) => {
      if (room.roomName === roomName) {
        room.sockets.push({
          id: socket.id,
          points: 0,
          nickname: socket.nickname,
          avatar: socket.avatar,
          item: socket.item,
        });
      }
      return room;
    });
    const room = getRoom(roomName);
    // 같은 방 인원들에게 알리기.
    roomSocketEmit(roomName, "newUser", {
      nickname: socket.nickname,
      rooms: rooms,
    });
    roomSocketEmit(roomName, "playerUpdate", { sockets: room.sockets });
    startGame(socket.roomName);
  });

  // 퇴장시... disconnect & disconnected
  socket.on("disconnect", () => {
    rooms = rooms.map((room) => {
      if (room.roomName === socket.roomName) {
        room.sockets = room.sockets.filter(
          (aSocket) => aSocket.id !== socket.id
        );
      }
      return room;
    });
    const room = getRoom(socket.roomName);
    if (room) {
      if (room.sockets.length === 1) {
        endGame(room.roomName);
      } else if (room.leader && socket.id === room.leader.id) {
        endGame(room.roomName);
      }
      roomSocketEmit(socket.roomName, "playerUpdate", {
        sockets: room.sockets,
      });
    }
    roomSocketEmit(socket.roomName, "disconnected", {
      nickname: socket.nickname,
    });
  });

  // 메시지를 전송
  socket.on("sendMsg", ({ message }) => {
    const room = getRoom(socket.roomName);
    if (message === room.answer) {
      roomSocketEmit(socket.roomName, "newMsg", {
        message: `🥇 Winner is ${socket.nickname}, word was: ${room.answer}`,
        nickname: "😀 Bot",
      });
      addPoints(socket.id, 10, socket.roomName);
    } else {
      roomSocketEmit(socket.roomName, "newMsg", {
        message,
        nickname: socket.nickname,
      });
    }
  });

  // 그리기 시작좌표 받기
  socket.on("beginPath", ({ x, y }) =>
    roomSocketEmit(socket.roomName, "beganPath", { x, y })
  );
  // 그리고 있는 좌표 받기(시작이후 좌표)
  socket.on("strokePath", ({ x, y, color }) => {
    roomSocketEmit(socket.roomName, "strokedPath", { x, y, color });
  });
  socket.on("fill", ({ color }) => {
    roomSocketEmit(socket.roomName, "filled", { color });
  });
};

export default socketEvents;
