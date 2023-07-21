const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const cors=require('cors')
const passport = require("passport")
const mongoose = require("mongoose")

const { userJoin, getRoomUsers, getCurrentUser, userLeave, formateMessage} = require('./users')

const { userRouter } = require('./routes/user.route')
const { paymentRouter } = require('./routes/payment.route')
// const cors=require('cors')
require("dotenv").config()

const handlebars = require("express-handlebars");



const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(cors())

const socketsStatus = {};

const customHandlebars = handlebars.create({ layoutsDir: "./views" });

// --------------------------GOAuth------------------------


const { googleAuthentication } = require("./middlewares/G_OAuth.js")
const { CLIENT_RENEG_LIMIT } = require('tls')


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session:false }), googleAuthentication )


// --------------------------GOAuth------------------------



app.engine("handlebars", customHandlebars.engine);
app.set("view engine", "handlebars");

app.use("/files", express.static("public")); 


app.use("/user",userRouter);
app.use("/payment",paymentRouter)

io.on('connection', (socket) => {
  const socketId = socket.id;
  socketsStatus[socket.id] = {};

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
  socket.on("voice", function (data) {

    var newData = data.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    for (const id in socketsStatus) {

      if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
        socket.broadcast.to(id).emit("send", newData);
    }

  });
  socket.on("userInformation", function (data) {
    socketsStatus[socketId] = data;
  });
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    console.log('one user left')
    delete socketsStatus[socketId];

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
  console.log("Listening at 8080");
})