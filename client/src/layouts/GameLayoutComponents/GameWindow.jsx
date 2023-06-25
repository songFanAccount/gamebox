import React from "react"

import { Box } from '@mui/material'
import GameStat from "./GameStat"

export default function GameWindow({roomCode}) {
    return (
        <Box
            sx={{
                width: "100%",
                border: 1,
                borderRadius: 1,
                m: 1,
                ml: 0
            }}
        >
            <GameStat roomCode={roomCode}/>
            GameWindow
        </Box>
    )
}