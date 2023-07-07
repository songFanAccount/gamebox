let stats = {}
module.exports = (io, socket, room) => {
    socket.on('tictactoe-terminate', () => {
    })
    socket.on('tictactoe-newGameReq', () => {
        io.to(room).emit('tictactoe-newGame')
    })
    socket.on('tictactoe-click', ({gameState}) => {
        io.to(room).emit('tictactoe-clickResponse', gameState)
    })
}