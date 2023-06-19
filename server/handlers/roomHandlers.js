const { generateAlphanumericCode } = require('../generalHelpers')

const codeLen = 6
const rooms = {}
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
    function createRoom(code, roomName, creatorName, creatorID) {
        // AVI: rooms does not already contain the code as a key
        const playersObj = createPlayerObj(creatorID, creatorName)
        rooms[code] = {
            roomName: roomName,
            players: playersObj
        }
    }
    function joinRoom(code, userName) {
        // AVI: there exists a room with the code
        rooms[code].players[socket.id] = { displayName : userName }
    }
    socket.on('create-room', ({roomName, creatorName}, callback) => {
        console.log('Attempting to create new room with name: ' + roomName)
        if(creatorName === '') creatorName = defaultUsername
        /* Generate 6 letter alphanumeric room codes until one is valid (not already existing) */
        let roomCode
        do {
            roomCode = generateAlphanumericCode(codeLen)
        } while(roomInfo(roomCode))
        console.log('Generated room with code: ' + roomCode)
        socket.join(roomCode)
        createRoom(roomCode, roomName, creatorName, socket.id)
        console.log(rooms)
        callback({success: true, code: roomCode})
    })
    socket.on('join-room', ({code, userName}, callback) => {
        console.log('Attemping to join room with code: ' + code)
        if(userName === '') userName = defaultUsername
        let errorMsg = null
        /* Code validation */
        if(code.length !== codeLen) errorMsg = "Please enter a 6 letter code to an existing room!"
        /* Disallow joining non-existent rooms */
        else if(!roomInfo(code)) errorMsg = "No room exists with this code!"
        if(errorMsg) {
            callback({success: false, errorMsg: errorMsg})
            return
        }
        socket.join(code)
        joinRoom(code, userName)
        console.log(rooms)
        callback({success: true})
    })
}