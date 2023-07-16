import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import GameSearchBar from './GameLayoutComponents/GameSearchBar'
import GameWindow from './GameLayoutComponents/GameWindow'
import UserInteractionBar from './GameLayoutComponents/UserInteractionBar'

export default function GameLayout() {

    const socket = global.socket
    const navigate = useNavigate()
    const roomCode = useQuery().get("code")
    const [isHost, setIsHost] = useState(false)
    const [roomName, setRoomName] = useState('')
    const [currGame, setCurrGame] = useState('')
    function selectGame(gamename) {
        /* If clicking on the same game, do nothing */
        if(!gamename || gamename === currGame) return
        /* Only the host should be able to call this, should open up a modal to confirm changing game, as all current game progress will be deleted. */

        /* If successful, should terminate current game properly before switching to new game. */
        socket.emit(`${currGame}_terminate`, {roomCode})
        /* Change game on server-side, which will notify all other people in the room */
        socket.emit('gameroom_changeGame', {roomCode, gamename})
    }
    useEffect(() => {
        socket.on('gameroom_newHost', () => {
            setIsHost(true)
        })
        socket.on('gameroom_newGame', ({gamename}) => {
            console.log('newGame called')
            setCurrGame(gamename)
            if(gamename) socket.emit("registerGameHandlers", {roomCode, gamename})
        })
        socket.emit("gameroom_validation", {roomCode}, ({validCode, hasThisUser, roomName}) => {
            if(!validCode) {
                navigate('/') // If room code isn't valid, just go back home
                return
            }
            if(!hasThisUser) { // If game room doesn't recognise this user, attempt reconnect via localstorage data
                const storedRoomCode = localStorage.getItem('roomCode')
                if(!storedRoomCode || storedRoomCode !== roomCode) {
                    navigate('/') // No cached data to try || Cached room code different from code in url
                    return
                }
                const storedPassword = localStorage.getItem('password')
                const storedUserID = localStorage.getItem('userID')
                socket.emit("gameroom_attempt_reconnect", {roomCode: storedRoomCode, password: storedPassword, userID: storedUserID}, ({success}) => {
                    if(!success) {
                        navigate('/')
                        return
                    }
                })
            }
            /* If everything is successful, we have successfully joined the room. Now acquire the current room info */
            socket.emit("gameroom_isHost", {roomCode}, ({host}) => {
                setIsHost(host)
            })
            socket.emit("gameroom_requestPlayerNames", {roomCode})
            socket.emit("gameroom_curGameName", {roomCode}, ({gamename}) => {
                setCurrGame(gamename)
                if(gamename) socket.emit("registerGameHandlers", {roomCode, gamename})
            })
            setRoomName(roomName)
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
            <GameSearchBar onClickGame={selectGame} currGame={currGame} isHost={isHost}/>
            <GameWindow roomCode={roomCode} roomName={roomName} gameName={currGame}/>
            <UserInteractionBar roomCode={roomCode}/>
        </Box>
    )
}

function useQuery() {
    return new URLSearchParams(useLocation().search)
}