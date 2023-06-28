import React from 'react'

import { Box } from '@mui/material'
import GameStat from './GameStat'
import { Name2Game } from '../../games/gamelist'

export default function GameWindow({roomCode, gameName}) {
    const game = Name2Game(gameName)
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
            {game}
        </Box>
    )
}