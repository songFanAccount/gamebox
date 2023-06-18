import React, { useState } from 'react'

export default function TicTacToe() {
    const [board, setBoard] = useState([
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1]
    ])
    return (
        <div>TicTacToe</div>
    )
}
