//유저 저장
//테스트 위해 임의 구현, DB에서 가져와야함
let sockets = [];
/*
let rooms = [
  {
    inProgress:false,
    roomName:"A",
    roomLeader:null,
    sockets:[]
  },{
    inProgress:false,
    roomName : "B",
    roomLeader:null,
    sockets:[]
  }
]

let inProgress = false;
*/

let word = null;
let leader = null;
let timeout = null;

//시간 설정
const times = {
  startTime: 5000,
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
        console.log("Room Info...", room);
        setRoom(roomName, roomType.SET_LEADER, chooseLeader(room.sockets));
        //word = 사용자 입력할 수 있게 만들기
        //사용자 input 생성하기
        roomSocketEmit(roomName, "gameStarting");
        setTimeout(() => {
          roomSocketEmit(roomName, "gameStarted");
          io.to(room.roomLeader.id).emit("leaderNotif", { word });
          // 게임 종료
          timeout = setTimeout(() => {
            //못 맞추면 점수 추가
            addPoints(room.roomLeader.id, 5, roomName);
            endGame(roomName);
          }, times.paintTime);
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
  const addPoints = (id, point, roomName) => {
    const room = getRoom(roomName);
    room.sockets = room.sockets.map((socket) => {
      if (socket.id === id) {
        socket.points += point;
      }
      return socket;
    });
    roomSocketEmit(roomName, "playerUpdate", { sockets: room.sockets });
    endGame(roomName);
    clearTimeout(timeout);
  };

  //닉네임 설정
  //User 모델에서 가져오기
  //사실상 없는 이벤트로 카카오톡 로그인 data에서 가져와야함
  socket.on("setNickname", ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, points: 0, nickname });
    superBroadcast("getRoomNames", rooms);
  });

  //방 접속시
  socket.on("joinGameRoom", ({ roomName }) => {
    socket.roomName = roomName;
    // 해당 유저를 특정이름의 방에 입장시키기.
    socket.join(roomName);
    // 새로 생성한 방이라면...
    if (rooms.filter((room) => room.roomName === roomName).length === 0) {
      //db 모델 가져와서 적용시키기 (user 처럼)
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
        });
      }
      return room;
    });
    const room = getRoom(roomName);
    // 같은 방 인원들에게 알리기.
    roomSocketEmit(roomName, "newUser", { nickname: socket.nickname });
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
    if (message === word) {
      roomSocketEmit(socket.roomName, "newMsg", {
        message: `🥇 Winner is ${socket.nickname}, word was: ${word}`,
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
