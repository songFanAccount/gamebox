const { generateAlphanumericCode, isEmptyStr } = require('../generalHelpers')

const codeLen = 6
const rooms = {}
const socketidToRoom = {}
const defaultUsername = 'Anon Andy'

module.exports = (io, socket) => {
    function roomInfo(code) {
        return io.sockets.adapter.rooms.get(code)
    }
    function createPlayerObj(id, displayName) {
        const playerObj = {}
        playerObj[id] = { displayName : displayName }
        return playerObj
    }
    function createRoom(code, roomName, password, creatorName, creatorID) {
        // AVI: rooms does not already contain the code as a key
        const playersObj = createPlayerObj(creatorID, creatorName)
        rooms[code] = {
            roomName: isEmptyStr(roomName) ? 'Game Room' : roomName,
            password: password === '' ? null : password,
            players: playersObj
        }
        socketidToRoom[creatorID] = code
        console.log(socketidToRoom)
    }
    function joinRoom(code, userName, callback, userID) {
        // AVI: there exists a room with the code
        rooms[code].players[socket.id] = { displayName : userName }
        socketidToRoom[userID] = code
        console.log(socketidToRoom)
        callback({success: true})
    }
    function getPlayerInfoFromRoom(roomCode, playerID) {
        // AVI: room exists for the given room code, and the room has a player with the given player id
        return rooms[roomCode].players[playerID]
    }
    socket.on('create-room', ({roomName, password, creatorName}, callback) => {
        console.log('Attempting to create new room with name: ' + roomName)
        if(isEmptyStr(creatorName)) creatorName = defaultUsername
        /* Generate 6 letter alphanumeric room codes until one is valid (not already existing) */
        let roomCode
        do {
            roomCode = generateAlphanumericCode(codeLen)
        } while(roomInfo(roomCode))
        console.log('Generated room with code: ' + roomCode)
        socket.join(roomCode)
        createRoom(roomCode, roomName, password, creatorName, socket.id)
        console.log(rooms)
        callback({success: true, code: roomCode})
    })
    socket.on('join-room', ({code, password, userName}, callback) => {
        console.log('Attemping to join room with code: ' + code + ', password: ' + password)
        if(isEmptyStr(userName)) userName = defaultUsername
        let errorMsg = null
        /* Code validation */
        if(code.length !== codeLen) errorMsg = "Please enter a 6 letter code to an existing room!"
        /* Disallow joining non-existent rooms */
        else if(!roomInfo(code)) errorMsg = "No room exists with this code!"
        if(!errorMsg) {
            // Room exists, now check password matches if exists
            const roomPassword = rooms[code].password
            if(roomPassword && password !== roomPassword) errorMsg = 'Incorrect password!'
        }
        if(errorMsg) {
            callback({success: false, errorMsg: errorMsg})
            return
        }
        socket.join(code)
        joinRoom(code, userName, callback, socket.id)
        console.log(rooms)
    })
    socket.on('gameroom_sendMsgToChat', ({message}) => {
        const roomCode = socketidToRoom[socket.id]
        const playerName = getPlayerInfoFromRoom(roomCode, socket.id)
        console.log(`Message: ${message} from socketid: ${socket.id} from room with code: ${roomCode}`)
        io.to('testRoom').emit('gameroom_newChatMsg', {message, playerName})
    })
}