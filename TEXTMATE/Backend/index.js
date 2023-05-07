const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { userJoin, getRoomUsers, getCurrentUser, userLeave, formateMessage} = require('./users')
const mongoose = require("mongoose")
const { userRouter } = require('./routes/user.route')
const { paymentRouter } = require('./routes/payment.route')
const cors=require('cors')
require("dotenv").config()


const app = express()
app.use(express.json())
const server = http.createServer(app)
const io = socketio(server)

app.use(cors())


app.use("/user",userRouter);
app.use("/payment",paymentRouter)

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    console.log(user)
    socket.join(user.room)

    // Welcome message
    socket.emit('message', `Chat AI :- Welcome to ${room}`)

    // Broadcasting other users
    socket.broadcast.to(room).emit('message', `Chat AI :- ${username} has joined the room`)

    // getting room users.
    const users = getRoomUsers(user.room)
    io.to(room).emit('roomUsers', {
      room: user.room,
      users
    })
  })
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('chatMessage',formateMessage(user.username,msg))
  })
  socket.on('typing', (username) => {
    const user = getCurrentUser(socket.id)
    socket.broadcast.to(user.room).emit('typing',username)
  })
  socket.on('chat', (chat) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('chat',formateMessage(user.username,chat))
  })
  socket.on('stream', ({room, status}) => {
    const user = getCurrentUser(socket.id)
    io.to(room).emit('stream', {user,status});
  });
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    console.log('one user left')

    if(user){
      // Broadcastion other users on leaving
      io.to(user.room).emit('message', `Chat AI :- ${user.username} has left the chat`)

      // getting room users.
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  })
})


server.listen(8080,async () => {

  try {

    await mongoose.connect(process.env.mongoURL)
    console.log("connected to database..")

  } catch (error) {

    console.log({msg:error.message})
  }

  console.log('Server listening on port 8080')

})
