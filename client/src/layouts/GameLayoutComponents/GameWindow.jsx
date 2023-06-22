import React from "react"

import { Box } from '@mui/material'
import GameStat from "./GameStat"

export default function GameWindow() {
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
            <GameStat />
            GameWindow
        </Box>
    )
}