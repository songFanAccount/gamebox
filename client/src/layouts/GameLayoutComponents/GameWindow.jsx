import React from "react"

import { Box } from '@mui/material'
import GameStat from "./GameStat"

export default function GameWindow() {
    return (
        <Box
            sx={{
                color: "white",
                backgroundColor: "grey",
                width: 1000
            }}
        >
            <GameStat />
            GameWindow
        </Box>
    )
}