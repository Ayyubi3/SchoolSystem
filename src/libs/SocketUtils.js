const { Server } = require("socket.io");


const io = new Server(process.env.SOCKETPORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})

const users = {}

const {SessionInstance} = require("../index")

io.engine.use(SessionInstance)

io.on('connection', async socket => {

  const user = await socket.request.session.passport.user

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
})



module.exports = {io}