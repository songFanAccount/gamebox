import { Box } from '@mui/material'
import React, { useState } from 'react'

export default function TicTacToe() {
    //eslint-disable-next-line
    const socket = global.socket
    //eslint-disable-next-line
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
