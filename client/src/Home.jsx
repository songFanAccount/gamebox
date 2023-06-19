import React, { useRef, useState } from 'react'
import { GBButton, GBText, GBTextInput } from './components/generalComponents'
import { Box, Stack } from '@mui/material'
import { useAnimate } from 'framer-motion'

export default function Home() {
    const socket = global.socket
    const [userName, setUserName] = useState('')
    const [joinCode, setJoinCode] = useState('')
    const [createJoinState, setCJState] = useState(0) // -1 for create, 0 for none selected, 1 for join
    const busy = useRef(false)
    const [scope, animate] = useAnimate()
    
    function handleJoinCodeChange(value) {
        setJoinCode(value)
    }
    async function createToggle() {
        if(busy.current || createJoinState === -1) return
        setCJState(-1)
        const anims = []
        anims.push(['.createButton', {width: ['45%', '100%']}, {duration: 0.5}])
        anims.push(['.joinButton', {width: ['45%', '0%'], opacity: [1, 0]}, {at: '<', duration: 0.5}])
        busy.current = true
        await animate(anims)
        busy.current = false
    }
    async function joinToggle() {
        if(busy.current || createJoinState === 1) return
        setCJState(1)
        const anims = []
        anims.push(['.joinButton', {width: ['45%', '100%']}, {duration: 0.5}])
        anims.push(['.createButton', {width: ['45%', '0%'], opacity: [1, 0]}, {at: '<', duration: 0.5}])
        busy.current = true
        await animate(anims)
        busy.current = false
    }
    async function back() {
        if(busy.current || createJoinState === 0) return
        const anims = []
        anims.push([createJoinState === 1 ? '.createButton' : '.joinButton', {width: ['0%', '45%'], opacity: [0, 1]}, {duration: 0.5}])
        anims.push([createJoinState === -1 ? '.createButton' : '.joinButton', {width: ['100%', '45%'], opacity: [1, 1]}, {at: '<', duration: 0.5}])
        busy.current = true
        await animate(anims)
        busy.current = false
        setCJState(0)
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
                    width: 'fit-content',
                }}
            >
                <Stack direction="row" columnGap={2} alignItems="center">
                    <GBText text="Your display name:"/>
                    <GBTextInput value={userName} onChange={setUserName} placeholder="Anon Andy"/>
                </Stack>
                <Stack direction="row" justifyContent="space-between" width={1} ref={scope}>
                    <GBButton
                        className="createButton"
                        onClick={createToggle}
                        width={0.45}
                        invert={createJoinState === -1}
                        disabled={createJoinState === -1}
                    >
                        Create Room
                    </GBButton>
                    <GBButton
                        className="joinButton"
                        onClick={joinToggle}
                        width={0.45}
                        invert={createJoinState === 1}
                        disabled={createJoinState === 1}
                    >
                        Join Room
                    </GBButton>
                </Stack>
                {/* <Stack direction="row" columnGap={2}>
                    <GBTextInput value={joinCode} onChange={handleJoinCodeChange} placeholder="Enter the unique room id"/>
                    
                </Stack> */}
                <GBButton onClick={back}>Back</GBButton>
            </Stack>
        </Box>
    )
}
