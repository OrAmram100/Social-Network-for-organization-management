const io = require("socket.io")(8900,{
    cors: {
        origin:"http://localhost:3000",
    },
});

let users = [];

const addUser = (userId, socketId) => {

    let userIndex = users.findIndex((user) => user.userId === userId);
  
    if (userIndex === -1) {
      users.push({ userId, socketId });
    } else {
      users[userIndex].socketId = socketId;
    }


  };

const removeUser = (socketId)=>{
    users = users.filter((user)=> user.socketId !== socketId);
}

const getUser = (userId)=>{
  console.log(users)
    return users.find(user=> user.userId === userId);
}



io.on("connection", (socket)=> {  
    //when connect
    console.log("a user connected.");
    //take userID and socketId from user
    socket.on("addUser", (userId) =>{
        addUser(userId,socket.id)
        io.emit("getUsers", users)
    });

    socket.on('updateComment', ({ postId, commentId, text }) => {
        // Emit the updated comment to all connected clients
        io.emit('commentUpdated', { postId, commentId, text });
      });

      socket.on('sendComment', ({ commentId }) => {
        io.emit('getComment',  commentId);
      });

      socket.on('updateVoteComment', ({ postId, commentId, votes }) => {
        io.emit('voteCommentUpdated', { postId, commentId, votes });
      });
      socket.on('resetVotes', ({commentId,postId}) => {
        console.log(commentId,postId)
        io.emit('resetingVotes', {commentId,postId});
      });

      socket.on('sendTask', (data) => {
        const user = getUser(data.recieverId);
        const senderId = data.senderId;
        const post = data.post;
        const operation = data.operation;
        if(user)
        {
          io.to(user.socketId).emit("getTaskNotifications", {
            operation,
            senderId,
            post
          });
      } else {
        console.log(`User with ID ${data.recieverId} not found`);
        }
      }
    );

    socket.on('sendTaskStatus', (data) => {
      const user = getUser(data.recieverId);
      const senderId = data.senderId;
      const post = data.post;
      const operation = data.operation;
      if (user) {
      io.to(user.socketId).emit("getTaskStatusNotifications", {
        operation,
        senderId,
        post
      });
  } else {
    console.log(`User with ID ${data.recieverId} not found`);
    }
  }
    );

      socket.on('correctAnswer', ({commentId,postId}) => {
       io.emit('getCorrectAnswer', { commentId,postId});
  });

  socket.on('updateUserScore', ({commentId,postId}) => {
   io.emit('getUpdatedUserScore', { commentId,postId});
});

socket.on('secondTimerStarted', ({commentId,postId}) => {
  io.emit('renderSecondTimer', { commentId,postId});
});


  socket.on('renderTop3ScoringUsers', ({commentId,postId}) => {
    io.emit('getRenderTop3ScoringUsers', { commentId,postId});
});

      socket.on('deleteComment', ({ postId, commentId }) => {
        // Emit the updated comment to all connected clients
        io.emit('deleteComment', { postId, commentId });
      });

      //send and get comment notifications
    socket.on("sendCommentsNotifications", (data)=>{
      const user = getUser(data.recieverId);
      const post = data.post;
      const senderId = data.senderId;
      const operation = data.operation;
      if (user) {
          io.to(user.socketId).emit("getCommentsNotifications", {
            operation,
            senderId,
            post
          });
        } else {
          console.log(`User with ID ${data.recieverId} not found`);
        }
  });

      //send and get likes notifications
    socket.on("sendLikesNotifications", (data)=>{
      const user = getUser(data.recieverId);
      const post = data.post;
      const senderId = data.senderId;
      const operation = data.operation;

      if (user) {
          io.to(user.socketId).emit("getLikesNotifications", {
            operation,
            senderId,
            post
          });
        } else {
          console.log(`User with ID ${data.recieverId} not found`);
        }
  });

    //send and get messages
    socket.on("sendMessage", ({senderId, recieverId,text})=>{
        const user = getUser(recieverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
              senderId,
              text,
            });
          } else {
            console.log(`User with ID ${recieverId} not found`);
          }
    });

    //send and get messages
    socket.on("sendMessagesNotification", ({senderId, recieverId,text})=>{
        const user = getUser(recieverId);
        io.to(user?.socketId).emit("getMessageNotifications",{
            senderId,
            text,
        });
    });

    //send and get messages
    socket.on("sendConnectionReqNotification", ({senderId, recieverId})=>{
      const user = getUser(recieverId);
      io.to(user?.socketId).emit("getConnectionReqNotification",{
          senderId,
      });
  });

  socket.on("sendRecvConnectionsReq", ({senderId, recieverId})=>{
    const user = getUser(recieverId);
    io.to(user?.socketId).emit("getRecvConnectionsReq",{
        senderId,
    });
});

socket.on("confirmConnecReqRecv", ({senderId, recieverId})=>{
  const user = getUser(recieverId);
  io.to(user?.socketId).emit("getConfirmConnecReqRecv",{
      senderId,
  });
});

socket.on("rejectConnectionReq", ({senderId, recieverId})=>{
  const user = getUser(recieverId);
  io.to(user?.socketId).emit("getRejectConnectionReq",{
      senderId,
  });
});

socket.on("sendPost", ({post, recieverId})=>{
  const user = getUser(recieverId);
  io.to(user?.socketId).emit("getPost",{
      post,
  });
});

socket.on("declineConnectionReq", ({senderId, recieverId})=>{
  const user = getUser(recieverId);
  io.to(user?.socketId).emit("getDeclineConnectionReq",{
      senderId,
  });
});

socket.on("unConnectReqNotification", ({senderId, recieverId})=>{
  const user = getUser(recieverId);
  io.to(user?.socketId).emit("getUnConnectReqNotification",{
      senderId,
  });
});


    socket.on("sendNotifications",({senderId,recieverId, type, recieverName})=>{
        const reciever = getUser(recieverId);
        io.to(reciever.socketId).emit("getNotifications",{
            senderId,
            type,
            recieverName
        });
    });

    socket.on("sendText",({senderId,recieverId, text})=>{
        const reciever = getUser(recieverId);
        io.to(reciever?.socketId).emit("getNotifications",{
            senderId,
            text,
        });
    });

    socket.on("disconnect",()=>{
            //when disconnect
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users)

    });

});