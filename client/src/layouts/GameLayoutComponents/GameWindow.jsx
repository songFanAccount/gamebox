import React from 'react'

import { Box } from '@mui/material'
import GameStat from './GameStat'
import { Name2Game } from '../../games/gamelist'

export default function GameWindow({roomCode, roomName, gameName}) {
    const game = Name2Game(gameName)
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex", flexDirection: "column",
                m: 1, ml: 0
            }}
        >
            <GameStat roomCode={roomCode} roomName={roomName}/>
            <Box
                sx={{
                    height: "100%",
                    border: 1, borderRadius: 1,
                    mt: 1
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        height: '100%',
                        pt: 5, // alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {game}
                </Box>
            </Box>
        </Box>
    )
}