import { Box, Stack } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useState, useMemo, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

import GameSearchBar from './GameLayoutComponents/GameSearchBar'
import GameWindow from './GameLayoutComponents/GameWindow'
import UserInteractionBar from './GameLayoutComponents/UserInteractionBar'
import { GBText, GBTextInput, GBButton } from '../components/generalComponents'

export default function GameLayout() {
    const initTime = useMemo(() => Date().toLocaleString(), [])
    console.log(initTime)

    const location = useLocation();
    const fromHome = location.state ? true : false

    const socket = global.socket
    const navigate = useNavigate()
    const roomCode = useQuery().get("code")
    const [codeValidity, setCodeValidity] = useState(false)
    const [userName, setUserName] = useState('')
    const [joinPassword, setJoinPassword] = useState('')
    socket.emit("check_room_code", {code: roomCode}, ({valid}) => {
        setCodeValidity(valid)
    })
    function joinRoom() {
        socket.emit('join-room', {code: roomCode, password: joinPassword, userName: userName}, (response) => {
            if(!response) toast.error('Unexpected error!')
            if(response.success) {
                toast.success('Valid details! Redirecting...')
                setTimeout(() => {navigate(`/game/?code=${roomCode}`, {state: {fromHome: true}})}, 2000)
            }
            else toast.error(response.errorMsg)
        })
    }
    return (
        <Box>
            {!codeValidity &&
            <GBText text="Invalid room code."/>}
            {(codeValidity && !fromHome) &&
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
                    <GBText text="Your display name:"/>
                    <GBTextInput value={userName} onChange={setUserName} placeholder="Anon Andy"/>
                    <GBText text="Password: "/>
                    <GBTextInput value={joinPassword} onChange={setJoinPassword} placeholder="-" maxLength={25} type="password"/>
                    <GBButton onClick={joinRoom} endIcon={<ArrowForwardIcon/>}>Join</GBButton>

            </Box>
            }
            {(codeValidity && fromHome) &&
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