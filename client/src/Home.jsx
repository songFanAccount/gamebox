import React, { useEffect, useState } from 'react'
import { GBButton, GBTextInput } from './components/generalComponents'
import { Stack } from '@mui/material'

export default function Home() {
    const socket = global.socket
    const [joinCode, setJoinCode] = useState('')
    function handleJoinCodeChange(value) {
        setJoinCode(value)
    }
    function createAndJoinRoom() {
        socket.emit('create-room', {roomName: 'Test Room'})
    }
    function joinRoom() {
        socket.emit('join-room', {code: joinCode}, joinResponse)
    }
    function joinResponse(res) {
        console.log(res)
    }
    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
                width: '100%',
                height: 'calc(100% - 100px)',
                position: 'fixed',
                top: 100,
                left: 0,
                backgroundColor: '#121212',
            }}
        >
            <GBButton
                onClick={createAndJoinRoom}
            >
                Create Room
            </GBButton>
            <Stack direction="row" columnGap={2}>
                <GBTextInput value={joinCode} onChange={handleJoinCodeChange} placeholder="Enter the unique room id"/>
                <GBButton
                    onClick={joinRoom}
                >
                    Join Room
                </GBButton>
            </Stack>
        </Stack>
    )
}
