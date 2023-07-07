import { Box } from '@mui/material'
import React, { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import GameSearchBar from './GameLayoutComponents/GameSearchBar'
import GameWindow from './GameLayoutComponents/GameWindow'
import UserInteractionBar from './GameLayoutComponents/UserInteractionBar'

export default function GameLayout() {
    const initTime = useMemo(() => Date().toLocaleString(), [])
    console.log(initTime)

    const socket = global.socket
    const navigate = useNavigate()
    const roomCode = useQuery().get("code")

    const [currGame, setCurrGame] = useState('')
    function selectGame(gameName) {
        setCurrGame(gameName)
        /* If clicking on the same game, do nothing */
        if(gameName === currGame) return
        /* Only the host should be able to call this, should open up a modal to confirm changing game, as all current game progress will be deleted. */

        /* If successful, should terminate current game properly before switching to new game. */
    }
    useEffect(() => {
        socket.emit("gameroom_validation", {roomCode}, ({validCode, hasThisUser}) => {
            if(!validCode) navigate('/') // If room code isn't valid, just go back home
            if(!hasThisUser) { // If game room doesn't recognise this user, attempt reconnect via localstorage data
                const storedRoomCode = localStorage.getItem('roomCode')
                if(!storedRoomCode || storedRoomCode !== roomCode) navigate('/') // No cached data to try || Cached room code different from code in url
                const storedPassword = localStorage.getItem('password')
                const storedUserID = localStorage.getItem('userID')
                socket.emit("gameroom_attempt_reconnect", {roomCode: storedRoomCode, password: storedPassword, userID: storedUserID}, ({success}) => {
                    if(success) socket.emit("gameroom_requestPlayerNames", {roomCode})
                    else navigate('/')
                })
            }
        })
    // eslint-disable-next-line
    }, [])
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