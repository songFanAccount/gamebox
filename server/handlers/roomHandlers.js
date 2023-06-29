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
            password: isEmptyStr(password) ? null : password,
            hostID: creatorID, 
            players: playersObj,
            recentDisconnects: {}
        }
        socketidToRoom[creatorID] = code
        io.to(socket.id).emit('update_localStorage_room', {roomCode: code, password: isEmptyStr(password) ? null : password, userID: creatorID})
    }
    function joinRoom(code, userName, callback, userID) {
        // AVI: there exists a room with the code
        rooms[code].players[socket.id] = { displayName : userName }
        socketidToRoom[userID] = code
        const playerJoinMsg = `${userName} has joined!`
        sendAnnouncementToRoom(code, playerJoinMsg)
        callback({success: true})
    }
    function getPlayerInfoFromRoom(roomCode, playerID) {
        // AVI: room exists for the given room code, and the room has a player with the given player id
        return rooms[roomCode].players[playerID]
    }
    function updatePlayerList(roomCode) {
        const room = rooms[roomCode]
        if(!room) {console.log('updatePlayerList: no room exist with this room code!'); return}
        const hostID = room.hostID
        let hostName
        const playersNames = []
        Object.entries(room.players).forEach((entry) => {
            if(entry[0] === hostID) hostName = entry[1].displayName
            else playersNames.push(entry[1].displayName)
        })
        io.to(roomCode).emit('gameroom_getPlayerNames', {hostName, playersNames})
    }
    function sendMsgToRoom(roomCode, playerName, message) {
        io.to(roomCode).emit('gameroom_newChatMsg', {message, playerName})
    }
    function sendAnnouncementToRoom(roomCode, message) {
        io.to(roomCode).emit('gameroom_newChatAnnouncement', {message})
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
    })
    socket.on('gameroom_requestPlayerNames', ({roomCode}) => {
        updatePlayerList(roomCode)
    })
    socket.on('gameroom_sendMsgToChat', ({roomCode, message}) => {
        const playerName = getPlayerInfoFromRoom(roomCode, socket.id).displayName
        sendMsgToRoom(roomCode, playerName, message)
    })
    socket.on('check_room_code', ({code}, callback) => {
        callback({valid: rooms[code] !== undefined})
    })
    socket.on('gameroom_attempt_reconnect', ({roomCode, password, userID}, callback) => {
        console.log('Attempting to reconnect with details:')
        console.log(roomCode, password, userID)
        /* Assumes room code belongs to an existing room */
        const room = rooms[roomCode]
        /* Check whether the user is in the recent disconnects list */
        const cachedInfo = room.recentDisconnects[userID]
        if(!cachedInfo) {
            callback({success: false})
            return
        }
        /* Now check password matches, if room doesn't have a password, just let them in */
        callback({success: password === room.password || room.password === null})
    })
    socket.on('disconnecting', () => {
        console.log(`${socket.id} disconnected.`)
        /* Get the room the user belongs to, if none, do nothing */
        const roomCode = socketidToRoom[socket.id]
        const room = rooms?.[roomCode]
        if(!room) return
        /* Check that the user actually is in our rooms object */
        if(!room.players.hasOwnProperty(socket.id)) {
            console.log("Specified room already doesn't have this player!")
            return
        }
        /* Cache this player info in the recent disconnects */
        room.recentDisconnects[socket.id] = room.players[socket.id]
        /* Remove the user from this room */
        const userName = room.players[socket.id].displayName // Get display name before deleting it from rooms
        delete room.players[socket.id]
        socket.leave(roomCode)
        /* 
        If the user is the host, then: 
        - If there are still players in the room, reassign one of them to be host
        - Otherwise, all players have left the room, close the room
        */
        if(room.hostID === socket.id) {
            const potentialHost = Object.keys(room.players)[0]
            potentialHost ? room.hostID = potentialHost : delete rooms[roomCode]
        }
        /* Notify players in the room to update player list, as well as sending an appropriate announcement in the chat */
        if(rooms.hasOwnProperty(roomCode)) {
            updatePlayerList(roomCode)
            sendAnnouncementToRoom(roomCode, `${userName} has left.`)        }
    })
}