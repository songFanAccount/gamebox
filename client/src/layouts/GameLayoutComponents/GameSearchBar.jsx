import React from "react"
import { Box } from '@mui/material'
import { Button } from "@mui/material"

import { gamelist } from '../../games/gamelist'
import GameButton from "./GameButton"

export default function GameSearchBar({onClick, currGame}) {
    let gameButton = []
    gameButton = gamelist?.map(game => (
        <GameButton key={game} gameName={game} onClick={onClick}/>
    ))
    return (
        <Box
            sx={{
                minWidth: 250,
                m: 1,
                border: 1,
                borderRadius: 1
            }}
        >
            <Box>
                Current Game: {currGame}
            </Box>
            {gameButton}
        </Box>
    )
}