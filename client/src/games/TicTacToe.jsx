import { Box } from '@mui/material'
import React, { useState } from 'react'

export default function TicTacToe() {
    const socket = global.socket
    const [board, setBoard] = useState([
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1]
    ])
    return (
        <Box>
            <div>TicTacToe</div>
            {board}
        </Box>
    )
}
