import React, { useEffect, useState } from 'react'
import { GBButton, GBText, GBTextInput } from './components/generalComponents'
import { Box, Stack } from '@mui/material'

export default function Home() {
    const socket = global.socket
    const [userName, setUserName] = useState('')
    const [joinCode, setJoinCode] = useState('')
    function handleJoinCodeChange(value) {
        setJoinCode(value)
    }
    function createAndJoinRoom() {
        socket.emit('create-room', {roomName: 'Test Room', creatorName: userName}, createResponse)
    }
    function createResponse(res) {
        console.log(res)
    }
    function joinRoom() {
        socket.emit('join-room', {code: joinCode, userName: userName}, joinResponse)
    }
    function joinResponse(res) {
        console.log(res)
    }
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
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                rowGap={3}
                sx={{
                    height: 1,
                    width: 'fit-content'
                }}
            >
                <Stack direction="row" columnGap={2} alignItems="center">
                    <GBText text="Your display name:"/>
                    <GBTextInput value={userName} onChange={setUserName} placeholder="Anon Andy"/>
                </Stack>
                <Stack direction="row" columnGap={2} width={1}>
                    <GBButton
                        onClick={createAndJoinRoom}
                        width={0.5}
                    >
                        Create Room
                    </GBButton>
                    <GBButton
                        onClick={joinRoom}
                        width={0.5}
                    >
                        Join Room
                    </GBButton>
                </Stack>
                <Stack direction="row" columnGap={2}>
                    <GBTextInput value={joinCode} onChange={handleJoinCodeChange} placeholder="Enter the unique room id"/>
                    
                </Stack>
            </Stack>
        </Box>
    )
}
