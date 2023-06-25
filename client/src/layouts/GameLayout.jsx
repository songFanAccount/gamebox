import { Box } from '@mui/material'
import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import GameSearchBar from './GameLayoutComponents/GameSearchBar'
import GameWindow from './GameLayoutComponents/GameWindow'
import UserInteractionBar from './GameLayoutComponents/UserInteractionBar'
import { GBText } from '../components/generalComponents'

export default function GameLayout() {
    const initTime = useMemo(Date().toLocaleString(), [])
    console.log(initTime)
    const socket = global.socket
    const roomCode = useQuery().get("code")
    const [codeValidity, setCodeValidity] = useState(false)
    socket.emit("check_room_code", {code: roomCode}, ({valid}) => {
        setCodeValidity(valid)
    })
    return (
        <Box>
            {!codeValidity &&
            <GBText text="Invalid room code."/>}
            {codeValidity &&
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
            </Box>}
        </Box>
    )
}

function useQuery() {
    return new URLSearchParams(useLocation().search)
}