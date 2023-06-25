import { Box } from '@mui/material'
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import GameSearchBar from './GameLayoutComponents/GameSearchBar'
import GameWindow from './GameLayoutComponents/GameWindow'
import UserInteractionBar from './GameLayoutComponents/UserInteractionBar'

export default function GameLayout() {
    const roomCode = useQuery().get("code")
    return (
        <Box 
            sx={{
                width: '100%',
                height: 'calc(100% - 100px)',
                position: 'fixed',
                top: 100,
                left: 0,
                backgroundColor: '#121212',
                display: 'flex',
                color: "white"
            }}
        >
            <GameSearchBar/>
            <GameWindow roomCode={roomCode}/>
            <UserInteractionBar roomCode={roomCode}/>
            <Outlet/> {/* Should be replaced by GameWindow when it's completed */}
        </Box>
    )
}

function useQuery() {
    return new URLSearchParams(useLocation().search)
}