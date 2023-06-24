let turn = -1
const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
module.exports = (io, socket) => {
    socket.on('tictactoe-click', ({rowIndex, colIndex}) => {
        board[rowIndex][colIndex] = turn
        /* 
        Should determine game status after each move, either:
        - Player wins: A row/column/diagonal of X or Os. From the clicked square, span out to check its row/column and diagonal if applicable
        - Draw: Previous case has not occurred, and board is now full. Detect fullness when 'emptySpaces' === 0
        - Otherwise just continue playing!
        */
        // NOTE: Storing every win condition for animation purposes
        const rowWin = board[rowIndex].every((el) => el === turn) // Check row
        const colWin = board.every((row) => row[colIndex] === turn) // Then check column
        // Now check diagonals
        const leftDiagWin = 
            board[0][0] === turn &&
            board[1][1] === turn &&
            board[2][2] === turn 
        const rightDiagWin = 
            board[0][2] === turn &&
            board[1][1] === turn &&
            board[2][0] === turn
        // Determine if won
        const win = rowWin || colWin || leftDiagWin || rightDiagWin
        const response = win 
        ? {rowIndex, colIndex, win, rowWin, colWin, leftDiagWin, rightDiagWin}
        : {rowIndex, colIndex, win: false}
        io.to('testRoom').emit('tictactoe-clickResponse', response)
        turn *= -1
    })
}