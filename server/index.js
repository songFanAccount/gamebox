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

io.on('connection', (socket) => {
    console.log('User connected with id: ' + socket.id)
    socket.on('hello', (data) => {
        console.log(data)
    })
    socket.on('join-room', ({code}, callback) => {
        console.log('Attemping to join room with code: ' + code)
        /* Disallow joining non-existent rooms */
        if(!io.sockets.adapter.rooms[code]) {
            callback({success: false})
            return
        }
        socket.join(code)
        callback({success: true})
    })
})

server.listen(3001, () => {
    console.log("server is running")
})