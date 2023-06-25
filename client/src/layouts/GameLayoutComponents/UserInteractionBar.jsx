import React from "react"

import { Box } from '@mui/material'

import Chat from "./Chat"
import PlayerList from "./PlayerList"

export default function UserInteractionBar({roomCode}) {
    return (
        <Box
            sx={{
                border: 1,
                borderRadius: 1,
                m: 1,
                ml: 0,
                minWidth: 250
            }}
        >
            <PlayerList roomCode={roomCode}/>
            <Chat roomCode={roomCode}/>
        </Box>
    )
}