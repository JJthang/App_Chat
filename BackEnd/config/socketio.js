import { Server } from "socket.io";

export const socketIo = (server) => {
  //todo Socket Server
  const io = new Server(server, {
    //todo nếu 60s ko có ai send request thì nó sẽ disconnect
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
      //todo credentials: true: Điều này cho phép truy cập với dữ liệu xác thực như cookie hoặc HTTP authentication.
      //   credentials: true,
    },
  });
  //todo Trong thư viện Socket.IO của JavaScript, sự kiện "on" được sử dụng để lắng nghe các sự kiện từ máy chủ hoặc từ máy khách
  io.on("connection", (socket) => {
    console.log("connected socket io success");
    socket.on("setup", (user) => {
      socket.join(user.user._id);
      //   console.log(user.user._id);
      //todo emit dùng để phát ra các sự kiện
      socket.emit("connected");
    });
    socket.on("typing", (roomId) => socket.to(roomId).emit("typing"));
    socket.on("stop typing", (roomId) => socket.to(roomId).emit("stop typing"));
    socket.on("join chat", (roomId) => {
      socket.join(roomId);
      //   console.log("Id Room : " + roomId);
    });
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
      if (!chat.users) return console.log("chat user is not defind");
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
        //todo socket.in gửi cho tất cả mọi người trong room bao gồm cả người gửi
        socket.in(user._id).emit("message received", newMessageRecieved);
      });
    });
    socket.off("setup", () => {
      console.log("DisConnect User");
      socket.leave(user.user._id);
    });
  });
};
