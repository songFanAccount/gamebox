import React, { useRef, useState } from 'react'
import { GBButton, GBText, GBTextInput } from './components/generalComponents'
import { Box, Stack } from '@mui/material'
import { useAnimate } from 'framer-motion'

export default function Home() {
    const socket = global.socket
    const [userName, setUserName] = useState('')
    const [joinCode, setJoinCode] = useState('')
    const [createJoinState, setCJState] = useState(0) // -1 for create, 0 for none selected, 1 for join
    const [createOptBorder, setCreateOptBorder] = useState(0)
    const [roomName, setRoomName] = useState('')
    const busy = useRef(false)
    const [scope, animate] = useAnimate()
    
    function handleJoinCodeChange(value) {
        setJoinCode(value)
    }
    async function createToggle() {
        if(busy.current || createJoinState === -1) return
        busy.current = true
        setCJState(-1)
        const anims = []
        anims.push(['.createButton', {width: ['45%', '100%']}, {duration: 0.5}])
        anims.push(['.joinButton', {width: ['45%', '0%'], opacity: [1, 0]}, {at: '<', duration: 0.5}])
        setCreateOptBorder(10)
        anims.push(['.options', {height: ['0%', '30%'], opacity: [0, 1]}, {duration: 0.5}])
        await animate(anims)
        busy.current = false
    }
    async function joinToggle() {
        if(busy.current || createJoinState === 1) return
        busy.current = true
        setCJState(1)
        const anims = []
        anims.push(['.joinButton', {width: ['45%', '100%']}, {duration: 0.5}])
        anims.push(['.createButton', {width: ['45%', '0%'], opacity: [1, 0]}, {at: '<', duration: 0.5}])
        await animate(anims)
        busy.current = false
    }
    async function back() {
        if(busy.current || createJoinState === 0) return
        busy.current = true
        const anims = []
        anims.push(['.options', {height: ['30%', '0%'], opacity: [1, 0]}, {duration: 0.5}])
        anims.push([createJoinState === 1 ? '.createButton' : '.joinButton', {width: ['0%', '45%'], opacity: [0, 1]}, {duration: 0.5}])
        anims.push([createJoinState === -1 ? '.createButton' : '.joinButton', {width: ['100%', '45%'], opacity: [1, 1]}, {at: '<', duration: 0.5}])
        await animate(anims)
        busy.current = false
        setCJState(0)
    }
    const CreateOptions = ({roomName}) => {
        return (
            <>
                <Stack direction="row" columnGap={2}>
                    <GBText text="Room name: "/>
                    <GBTextInput value={roomName} onChange={setRoomName} placeholder="Game Room"/>
                </Stack>
            </>
        )
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
                direction="column" justifyContent="center" alignItems="center" rowGap={3}
                className="contents"
                ref={scope}
                sx={{
                    height: 1,
                    width: 'fit-content',
                }}
            >
                <Stack direction="row" columnGap={2} alignItems="center">
                    <GBText text="Your display name:"/>
                    <GBTextInput value={userName} onChange={setUserName} placeholder="Anon Andy"/>
                </Stack>
                <Stack direction="row" justifyContent="space-between" width={1}>
                    {createJoinState !== 1 &&
                        <GBButton
                            className="createButton"
                            onClick={createToggle}
                            width={0.45}
                            invert={createJoinState === -1}
                            disabled={createJoinState === -1}
                        >
                            Create Room
                        </GBButton>
                    }
                    {createJoinState !== -1 &&
                        <GBButton
                            className="joinButton"
                            onClick={joinToggle}
                            width={0.45}
                            ml="auto"
                            invert={createJoinState === 1}
                            disabled={createJoinState === 1}
                        >
                            Join Room
                        </GBButton>
                    }
                </Stack>
                <Box
                    className="options"
                    sx={{
                        width: 1,
                        height: 0,
                        minHeight: 0,
                        border: createOptBorder, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderStyle: 'groove',
                        borderTop: 0,
                        borderColor: '#FFFFFF',
                        boxSizing: 'border-box'
                    }}
                >
                    <Stack
                        direction="column"
                        rowGap={2}
                        sx={{
                            ml: 2
                        }}
                    >
                        {createJoinState === -1 && 
                            <Stack direction="row" columnGap={2}>
                                <GBText text="Room name: "/>
                                <GBTextInput value={roomName} onChange={setRoomName} placeholder="Game Room"/>
                            </Stack>
                        }
                    </Stack>
                </Box>
                {/* <Stack direction="row" columnGap={2}>
                    <GBTextInput value={joinCode} onChange={handleJoinCodeChange} placeholder="Enter the unique room id"/>
                    
                </Stack> */}
                <GBButton onClick={back}>Back</GBButton>
            </Stack>
        </Box>
    )
}
