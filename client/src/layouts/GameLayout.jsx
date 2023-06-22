import { Box } from '@mui/material'
import { color } from 'framer-motion'
import React from 'react'
import { Outlet } from 'react-router-dom'

import GameSearchBar from './GameLayoutComponents/GameSearchBar'
import GameWindow from './GameLayoutComponents/GameWindow'
import UserInteractionBar from './GameLayoutComponents/UserInteractionBar'

export default function GameLayout() {
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
                justifyContent: 'space-around'
            }}
        >
            <GameSearchBar/>
            <GameWindow/>
            <UserInteractionBar/>
            <Outlet/> {/* Should be replaced by GameWindow when it's completed */}
        </Box>
    )
}
