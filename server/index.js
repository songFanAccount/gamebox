// https://www.youtube.com/watch?v=djMy4QsPWiI
const express = require('express') // Creating express server
const app = express() // Creates an instance of express server to use as backend server
const http = require('http') // Create an instance of the http library
const { Server } = require('socket.io')
const cors = require('cors')
app.use(cors())

const server = http.createServer(app) // Our server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
}) // Socket io instance

const registerRoomHandlers = require('./handlers/roomHandlers')
/* Game handlers */
const registerTictactoeHandlers = require('./handlers/gameHandlers/tictactoe')

io.on('connection', (socket) => {
    socket.join('testRoom')
    io.to(socket.id).emit('update_localStorage', {userID: socket.id})
    registerRoomHandlers(io, socket)
    registerTictactoeHandlers(io, socket, 'testRoom')
})

server.listen(3001, () => {
    console.log("server is running")
})

// https://stackoverflow.com/questions/32674391/io-emit-vs-socket-emit