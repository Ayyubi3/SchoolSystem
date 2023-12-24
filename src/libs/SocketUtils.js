const io = require('socket.io')(process.env.SOCKETPORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})

const users = {}

io.on('connection', socket => {

  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })


  socket.on("join-room", room => {
    socket.join(room)
  })


  socket.on('send-chat-message', ({ name, room, message }) => {

    
    socket.to(room).emit("chat-message",
      {
        message,
        name
      }
    )


  })







  /*



  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })*/

})