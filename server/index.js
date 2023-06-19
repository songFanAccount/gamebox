// https://www.youtube.com/watch?v=djMy4QsPWiI
const express = require('express') // Creating express server
const app = express() // Creates an instance of express server to use as backend server
const http = require('http') // Create an instance of the http library
const { Server } = require('socket.io')
const cors = require('cors')
const { generateAlphanumericCode } = require('./generalHelpers')

app.use(cors())

const server = http.createServer(app) // Our server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
}) // Socket io instance

function roomExists(code) {
    return io.sockets.adapter.rooms[code]
}
io.on('connection', (socket) => {
    console.log('User connected with id: ' + socket.id)
    socket.on('create-room', ({roomName}) => {
        console.log('Attempting to create new room with name: ' + roomName)
        /* Generate 6 letter alphanumeric room codes until one is valid (not already existing) */
        let roomCode
        do {
            roomCode = generateAlphanumericCode(6)
        } while(roomExists(roomCode))
        console.log('Generated room with code: ' + roomCode)
        socket.join(roomCode)
    })
    socket.on('join-room', ({code}, callback) => {
        console.log('Attemping to join room with code: ' + code)
        /* Disallow joining non-existent rooms */
        if(!roomExists(code)) {
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