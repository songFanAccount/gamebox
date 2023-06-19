const { generateAlphanumericCode } = require('../generalHelpers')

const codeLen = 6
const rooms = {

}

module.exports = (io, socket) => {
    function roomInfo(code) {
        return io.sockets.adapter.rooms.get(code)
    }
    socket.on('create-room', ({roomName}, callback) => {
        console.log('Attempting to create new room with name: ' + roomName)
        /* Generate 6 letter alphanumeric room codes until one is valid (not already existing) */
        let roomCode
        do {
            roomCode = generateAlphanumericCode(codeLen)
        } while(roomInfo(roomCode))
        console.log('Generated room with code: ' + roomCode)
        socket.join(roomCode)
        callback({success: true, code: roomCode})
    })
    socket.on('join-room', ({code}, callback) => {
        console.log('Attemping to join room with code: ' + code)
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
        callback({success: true})
    })
}