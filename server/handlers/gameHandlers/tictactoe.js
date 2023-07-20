/* Need to store multiple game instances so that many rooms can play their own game */
let games = {}
function newGame(room) {
    const game = games[room]
    if(!game) throw new Error('Unexpected newGame request from room ' + room)
    game.turn = -1
    game.numEmptySpaces = 9
    game.board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
}
module.exports = (io, socket, room) => {
    function initNewGameObj(roomCode) {
        if(games.hasOwnProperty(roomCode)) {
            const game = games[room]
            io.to(socket.id).emit('tictactoe_setGameState', {game})
            return
        }
        games[roomCode] = {
            lastRowIndex: -1, lastColIndex: -1, turn: -1,
            numEmptySpaces: 9,
            board: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            winner: 0, draw: false,
            rowWin: false, colWin: false, leftDiagWin: false, rightDiagWin: false,
            stats: {}
        }
    }
    initNewGameObj(room)
    socket.on('tictactoe_newGameReq', () => {
        newGame(room)
        io.to(room).emit('tictactoe_newGame')
    })
    function unsubscribeEvents() {
        socket.removeAllListeners('tictactoe_newGameReq')
        socket.removeAllListeners('tictactoe_terminate')
        socket.removeAllListeners('tictactoe_click')
        socket.removeAllListeners('tictactoe_unsubscribing')
    }
    socket.on('tictactoe_unsubscribe', () => {
        unsubscribeEvents()
    })
    socket.on('tictactoe_terminate', ({roomCode}) => {
        if(!games.hasOwnProperty(roomCode)) return
        delete games[roomCode]
    })
    socket.on('tictactoe_click', ({rowIndex, colIndex}) => {
        const game = games[room]
        if(!game) return
        if(game.numEmptySpaces === 0) throw new Error('TicTacToe: Unexpected error, numEmptySpaces === 0!')
        game.lastRowIndex = rowIndex
        game.lastColIndex = colIndex
        game.board[rowIndex][colIndex] = game.turn
        game.numEmptySpaces--
        /* 
        Should determine game status after each move, either:
        - Player wins: A row/column/diagonal of X or Os. From the clicked square, span out to check its row/column and diagonal if applicable
        - Draw: Previous case has not occurred, and board is now full. Detect fullness when 'emptySpaces' === 0
        - Otherwise just continue playing!
        */
        // NOTE: Storing every win condition for animation purposes
        const rowWin = game.board[rowIndex].every((el) => el === game.turn) // Check row
        const colWin = game.board.every((row) => row[colIndex] === game.turn) // Then check column
        // Now check diagonals
        const leftDiagWin = 
            game.board[0][0] === game.turn &&
            game.board[1][1] === game.turn &&
            game.board[2][2] === game.turn 
        const rightDiagWin = 
            game.board[0][2] === game.turn &&
            game.board[1][1] === game.turn &&
            game.board[2][0] === game.turn
        // Determine if won
        const win = rowWin || colWin || leftDiagWin || rightDiagWin
        const draw = !win && game.numEmptySpaces === 0
        /* Update game statistics if won */
        if(win) {
            game.winner = game.turn
            game.rowWin = rowWin
            game.colWin = colWin
            game.leftDiagWin = leftDiagWin
            game.rightDiagWin = rightDiagWin
        }
        /* If not, check if a draw has occurred (no more empty spaces) */
        else if(draw) game.draw = true
        /* Send response to each client in room */
        const response = win 
        ? {rowIndex, colIndex, winner: game.turn, rowWin, colWin, leftDiagWin, rightDiagWin}
        : {rowIndex, colIndex, winner: 0, draw}
        io.to(room).emit('tictactoe_clickResponse', response)
        if(!win && !draw) game.turn *= -1
    })
}