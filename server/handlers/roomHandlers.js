const { generateAlphanumericCode, isEmptyStr } = require('../generalHelpers')

const codeLen = 6
const rooms = {}
global.rooms = rooms
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
            gamename: null,
            recentDisconnects: {},
            toPlayNext: {}
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
    function leaveRoom(roomCode, socket) {
        const room = rooms[roomCode]
        if(!room) return
        /* Check that the user actually is in our rooms object */
        if(!room.players.hasOwnProperty(socket.id)) return
        /* Cache this player info in the recent disconnects */
        room.recentDisconnects[socket.id] = room.players[socket.id]
        /* Remove user's recommendation of the games */
        for (const gameName in room.toPlayNext) {
            rooms[roomCode].toPlayNext[gameName] = room.toPlayNext[gameName].filter(user => user['id'] !== socket.id)
            if (rooms[roomCode].toPlayNext[gameName].length === 0) delete rooms[roomCode].toPlayNext[gameName]
        }
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
            if(potentialHost) {
                room.hostID = potentialHost
                io.to(potentialHost).emit('gameroom_newHost')
            } else {
                delete rooms[roomCode]
            }
        }
        /* Notify players in the room to update player list, toPlayNext, as well as sending an appropriate announcement in the chat */
        if(rooms.hasOwnProperty(roomCode)) {
            updatePlayerList(roomCode)
            sendAnnouncementToRoom(roomCode, `${userName} has left.`)
            sendNewRecommendationToRoom(roomCode, rooms[roomCode].toPlayNext)
        }
    }
    function getPlayerInfoFromRoom(roomCode, playerID) {
        // AVI: room exists for the given room code, and the room has a player with the given player id
        return rooms[roomCode].players[playerID]
    }
    function updatePlayerList(roomCode) {
        const room = rooms[roomCode]
        if(!room) return
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
    function sendNewRecommendationToRoom(roomCode, toPlayNext) {
        io.to(roomCode).emit('gameroom_updateRecommendation', {toPlayNext})
    }
    function sendRecommendationAlarm(message) {
        io.to(socket.id).emit('gameroom_recommendationAlarm', {message})
    }
    socket.on('create-room', ({roomName, password, creatorName}, callback) => {
        if(isEmptyStr(creatorName)) creatorName = defaultUsername
        /* Generate 6 letter alphanumeric room codes until one is valid (not already existing) */
        let roomCode
        do {
            roomCode = generateAlphanumericCode(codeLen)
        } while(roomInfo(roomCode))
        socket.join(roomCode)
        createRoom(roomCode, roomName, password, creatorName, socket.id)
        callback({success: true, code: roomCode})
    })
    socket.on('join-room', ({code, password, userName}, callback) => {
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
        io.to(socket.id).emit('update_localStorage_room', {roomCode: code, password: isEmptyStr(password) ? null : password, userID: socket.id})
    })
    socket.on('leave_room', ({roomCode}) => {
        leaveRoom(roomCode, socket)
    })
    socket.on('gameroom_isHost', ({roomCode}, callback) => {
        const roomHostID = rooms[roomCode]?.hostID
        if(!roomHostID) return
        callback({host: roomHostID === socket.id})
    })
    socket.on('gameroom_requestPlayerNames', ({roomCode}) => {
        updatePlayerList(roomCode)
    })
    socket.on('gameroom_changeGame', ({roomCode, gamename}) => {
        rooms[roomCode].gamename = gamename
        delete rooms[roomCode].toPlayNext[gamename]
        sendNewRecommendationToRoom(roomCode, rooms[roomCode].toPlayNext)
        io.to(roomCode).emit('gameroom_newGame', {gamename})
    })
    socket.on('gameroom_curGameName', ({roomCode}, callback) => {
        const gamename = rooms[roomCode]?.gamename
        callback({gamename})
    })
    socket.on('gameroom_sendMsgToChat', ({roomCode, message}) => {
        const playerName = getPlayerInfoFromRoom(roomCode, socket.id).displayName
        sendMsgToRoom(roomCode, playerName, message)
    })
    socket.on('gameroom_validation', ({roomCode}, callback) => {
        const room = rooms[roomCode]
        const validCode = room !== undefined
        if (!validCode) {
            callback({validCode: false, hasThisUser: false, roomName: null})
            return
        }
        const hasThisUser = room.players.hasOwnProperty(socket.id)
        const roomName = room.roomName
        const toPlayNext = room.toPlayNext
        callback({validCode, hasThisUser, roomName, toPlayNext})
    })
    socket.on('gameroom_attempt_reconnect', ({roomCode, password, userID}, callback) => {
        /* Assumes room code belongs to an existing room */
        const room = rooms[roomCode]
        /* If room has a password, first check the password */
        if(room.password !== null && password !== room.password) { callback({success: false}); return }
        /* Then attempt to fetch disconnected user info */
        const cachedData = room.recentDisconnects[userID]
        if(!cachedData) { callback({success: false}); return }
        /* Successful reconnect, rejoin the user to room */
        room.players[socket.id] = cachedData
        socketidToRoom[socket.id] = roomCode
        const playerReconnectMsg = `${cachedData.displayName} has reconnected!`
        sendAnnouncementToRoom(roomCode, playerReconnectMsg)
        socket.join(roomCode)
        /* Remove this data from cache */
        delete room.recentDisconnects[userID]
        callback({success: true})
        io.to(socket.id).emit('update_localStorage_room', {roomCode, password, userID: socket.id})
    })
    socket.on('disconnecting', () => {
        console.log(`${socket.id} disconnected.`)
        /* Get the room the user belongs to, if none, do nothing */
        const roomCode = socketidToRoom[socket.id]
        leaveRoom(roomCode, socket)
    })
    socket.on('recommend-game', ({roomCode, gameName, playerId}) => {
        if (rooms[roomCode].gamename === gameName) {
            sendRecommendationAlarm(`you are playing ${gameName} now!`)
            return
        }

        let message = `voting for ${gameName}!`
        let toPlayNext = rooms[roomCode].toPlayNext
        const userDetails = {'id': playerId, 'name': getPlayerInfoFromRoom(roomCode, playerId).displayName}
        
        if (!(gameName in toPlayNext)) {
            toPlayNext[gameName] = [userDetails]
        }
        else {
            const matchingUserFound = toPlayNext[gameName].filter((details) => details['id'] === userDetails['id']).length > 0
            if (!matchingUserFound) {
                toPlayNext[gameName] = [...toPlayNext[gameName], userDetails]
            }
            else {
                message = "You've already voted!"
            }
        }
        rooms[roomCode].toPlayNext = toPlayNext
        sendNewRecommendationToRoom(roomCode, toPlayNext)
        sendRecommendationAlarm(message)
        
    })
    socket.on('cancel-game', ({roomCode, gameName, playerId}) => {
        let message = "you are not a voter for this game!"
        let toPlayNext = rooms[roomCode].toPlayNext

        if (gameName in toPlayNext) {
            const userDetails = {'id': playerId, 'name': getPlayerInfoFromRoom(roomCode, playerId).displayName}
            const matchingUserFound = toPlayNext[gameName].filter((details) => details['id'] === userDetails['id']).length > 0

            if (matchingUserFound) {
                toPlayNext[gameName] = toPlayNext[gameName].filter((details) => details['id'] !== userDetails['id'])
                if (toPlayNext[gameName].length === 0) {
                    delete toPlayNext[gameName]
                }
                message = 'vote removed'
            }
            rooms[roomCode].toPlayNext = toPlayNext
            sendNewRecommendationToRoom(roomCode, toPlayNext)
            sendRecommendationAlarm(message)
        }
    })
}