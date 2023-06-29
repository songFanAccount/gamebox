import { Box } from '@mui/material'
import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import GameSearchBar from './GameLayoutComponents/GameSearchBar'
import GameWindow from './GameLayoutComponents/GameWindow'
import UserInteractionBar from './GameLayoutComponents/UserInteractionBar'

export default function GameLayout() {
    const initTime = useMemo(() => Date().toLocaleString(), [])
    console.log(initTime)

    const location = useLocation();
    const fromHome = location.state ? true : false

    const socket = global.socket
    const navigate = useNavigate()
    const roomCode = useQuery().get("code")

    const [currGame, setCurrGame] = useState('')
    function selectGame(gameName) {
        setCurrGame(gameName)
    }
    socket.emit("check_room_code", {code: roomCode}, ({valid}) => {
        if(!valid) navigate('/') // If code isn't valid, just go back home
        /* If valid and not from home page, then we can attempt to reconnect to the last room we were in via local storage data */
        if(valid && !fromHome) {
            const roomCode = localStorage.getItem('roomCode')
            if(roomCode) { // Only do something if we have a roomCode stored in the local storage
                const password = localStorage.getItem('password')
                const userID = localStorage.getItem('userID')
                socket.emit('gameroom_attempt_reconnect', {roomCode, password, userID}, ({success}) => {
                    console.log(success)
                })
            }
        }
    })
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
            <GameSearchBar onClick={selectGame}/>
            <GameWindow roomCode={roomCode} gameName={currGame}/>
            <UserInteractionBar roomCode={roomCode}/>
        </Box>
    )
}

function useQuery() {
    return new URLSearchParams(useLocation().search)
}