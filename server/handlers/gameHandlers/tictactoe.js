/* Need to store multiple game instances so that many rooms can play their own game */
let games = {}
function initNewGameObj(roomCode) {
    if(games.hasOwnProperty(roomCode)) throw new Error('initGameObj: This room already has a game instance running!')
    console.log(`Initiating new game instance for room ${roomCode}`)
    games[roomCode] = {
        turn: -1,
        numEmptySpaces: 9,
        board: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        stats: {}
    }
    console.log(games)
}
let turn = -1
let numEmptySpaces = 9
let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
let stats = {}
let numDraws = 0
function resetBoard() {
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    numEmptySpaces = 9
}
function resetGame() {
    resetBoard()
    turn = -1
}
module.exports = (io, socket, room) => {
    initNewGameObj(room)
    socket.on('tictactoe-newGameReq', () => {
        resetGame()
        io.to(room).emit('tictactoe-newGame')
    })
    socket.on('tictactoe-click', ({rowIndex, colIndex}) => {
        if(numEmptySpaces === 0) throw new Error('TicTacToe: Unexpected error, numEmptySpaces === 0!')
        const game = games[room]
        game.board[rowIndex][colIndex] = turn
        game.numEmptySpaces--
        /* 
        Should determine game status after each move, either:
        - Player wins: A row/column/diagonal of X or Os. From the clicked square, span out to check its row/column and diagonal if applicable
        - Draw: Previous case has not occurred, and board is now full. Detect fullness when 'emptySpaces' === 0
        - Otherwise just continue playing!
        */
        // NOTE: Storing every win condition for animation purposes
        const rowWin = game.board[rowIndex].every((el) => el === turn) // Check row
        const colWin = game.board.every((row) => row[colIndex] === turn) // Then check column
        // Now check diagonals
        const leftDiagWin = 
            game.board[0][0] === turn &&
            game.board[1][1] === turn &&
            game.board[2][2] === turn 
        const rightDiagWin = 
            game.board[0][2] === turn &&
            game.board[1][1] === turn &&
            game.board[2][0] === turn
        // Determine if won
        const win = rowWin || colWin || leftDiagWin || rightDiagWin
        const draw = !win && game.numEmptySpaces === 0
        /* Update game statistics if won */
        if(win) {
        }
        /* If not, check if a draw has occurred (no more empty spaces) */
        else if(draw) numDraws++
        /* Send response to each client in room */
        const response = win 
        ? {rowIndex, colIndex, winner: turn, rowWin, colWin, leftDiagWin, rightDiagWin}
        : {rowIndex, colIndex, winner: 0, draw}
        io.to(room).emit('tictactoe-clickResponse', response)
        game.turn *= -1
        console.log(game)
    })
}