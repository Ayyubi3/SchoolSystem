const { DatabaseUtils } = require("../libs/DatabaseUtils")


const io = require("socket.io")(process.env.SOCKETPORT, {

  cors: {
    origin: "http://localhost:3000 ",
    credentials: true
  }

})


const { SessionInstance } = require("../index")
const { passport } = require("./PassportUtils")

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// FIXME could cause problems (multiple initializing)
io.use(wrap(SessionInstance));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));


io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    
    next(new Error('unauthorized'))
  }
});



io.on('connection', socket => {

  socket.on("join-room", async (room) => {


    
    const user = await socket.request.user
    logger.info("user " + user.email + " tries to join room " + room)

    
    const userCourse = await DatabaseUtils.getUserCourses(user.id)

    console.log(userCourse)


    const valid = userCourse.some(element => {
      return element.id == room
    })



    if(!valid)
    {
      return //FIXME add error checking
    }
    
    logger.info("JOINED")
    socket.join(room)

  })


  socket.on('send-chat-message', async ({ room, message }) => {


    const senderRaw = await socket.request.user
    const sender = {
      firstname: senderRaw.firstname,
      lastname: senderRaw.lastname,
      id: senderRaw.id
    }

    await DatabaseUtils.createMessage(message, sender.id, room)
    
    socket.to(room).emit("chat-message",
    {
      message,
      sender
    }

    )


  
  
  })






  
})



module.exports = { io }