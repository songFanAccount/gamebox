import React, { useRef, useState } from 'react'
import { GBButton, GBText, GBTextInput } from './components/generalComponents'
import { Stack } from '@mui/material'
import { useAnimate } from 'framer-motion'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DoneIcon from '@mui/icons-material/Done';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GBToastContainer } from './components/toast';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const socket = global.socket
    const [userName, setUserName] = useState('')
    const [createJoinState, setCJState] = useState(0) // -1 for create, 0 for none selected, 1 for join
    /* Room creation data */
    const navigate = useNavigate()
    const [roomName, setRoomName] = useState('')
    const [password, setPassword] = useState('')
    /* Room joining data */
    const [joinCode, setJoinCode] = useState('')
    const [joinPassword, setJoinPassword] = useState('')
    /* Anim related */
    const busy = useRef(false)
    const [scope, animate] = useAnimate()
    const [optBorder, setOptBorder] = useState(0)

    const [loading, setLoading] = useState(false)
    
    function handleJoinCodeChange(value) {
        setJoinCode(value)
    }
    async function createToggle() {
        if(busy.current || createJoinState === -1) return
        busy.current = true
        setCJState(-1)
        setOptBorder(10)
        const anims = []
        anims.push(['.createButton', {width: ['45%', '100%']}, {duration: 0.5}])
        anims.push(['.joinButton', {width: ['45%', '0%'], opacity: [1, 0]}, {at: '<', duration: 0.5}])
        anims.push(['.options', {height: [0, 240], opacity: [0, 1]}, {duration: 0.5}])
        await animate(anims)
        busy.current = false
    }
    async function joinToggle() {
        if(busy.current || createJoinState === 1) return
        busy.current = true
        setCJState(1)
        setOptBorder(10)
        const anims = []
        anims.push(['.joinButton', {width: ['45%', '100%']}, {duration: 0.5}])
        anims.push(['.createButton', {width: ['45%', '0%'], opacity: [1, 0]}, {at: '<', duration: 0.5}])
        anims.push(['.options', {height: [0, 240], opacity: [0, 1]}, {duration: 0.5}])
        await animate(anims)
        busy.current = false
    }
    async function back() {
        if(busy.current || createJoinState === 0) return
        busy.current = true
        const anims = []
        anims.push(['.options', {opacity: [1, 0]}, {duration: 0.25}])
        anims.push(['.options', {height: [240, 0]}, {duration: 0.5, at: '<'}])
        anims.push([createJoinState === 1 ? '.createButton' : '.joinButton', {width: ['0%', '45%'], opacity: [0, 1]}, {duration: 0.5}])
        anims.push([createJoinState === -1 ? '.createButton' : '.joinButton', {width: ['100%', '45%'], opacity: [1, 1]}, {at: '<', duration: 0.5}])
        await animate(anims)
        busy.current = false
        setCJState(0)
    }
    function createAndJoinRoom() {
        setLoading(true)
        socket.emit('create-room', {roomName: roomName, password: password, creatorName: userName}, ({code}) => {
            toast.success('Room created! Redirecting...')
            setTimeout(() => {setLoading(false); navigate(`/game?code=${code}`,{state: {passwordChecked: true}})}, 2000)
        })
    }
    function joinRoom() {
        setLoading(true)
        socket.emit('join-room', {code: joinCode, password: joinPassword, userName: userName}, (response) => {
            if(!response) toast.error('Unexpected error!')
            if(response.success) {
                toast.success('Valid details! Redirecting...')
                setTimeout(() => {setLoading(false); navigate(`/game?code=${joinCode}`,{state: {passwordChecked: true}})}, 2000)
            }
            else toast.error(response.errorMsg)
            setLoading(false)
        })
    }
    return (
        <>
            <Stack
                direction="column" justifyContent="center" alignItems="center"
                className="contents"
                ref={scope}
                sx={{
                    height: 1,
                    width: 'fit-content',
                    mx: 'auto'
                }}
            >
                <Stack direction="row" columnGap={2} alignItems="center"
                    sx={{
                        mb: 5,
                    }}
                >
                    <GBText text="Your display name:"/>
                    <GBTextInput value={userName} onChange={setUserName} placeholder="Anon Andy" maxLength={20}/>
                </Stack>
                <Stack direction="row" justifyContent="space-between" width={1} mb={1}>
                    {createJoinState !== 1 &&
                        <GBButton
                            className="createButton"
                            onClick={createToggle}
                            width={0.45}
                            invert={createJoinState === -1}
                            disabled={createJoinState === -1}
                            noDisableFx
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
                            noDisableFx
                        >
                            Join Room
                        </GBButton>
                    }
                </Stack>
                <Stack
                    direction="column"
                    className="options"
                    sx={{
                        width: 1, height: 0, minHeight: 0,
                        border: optBorder, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, 
                        borderBottomStyle: 'groove', borderLeftStyle: 'dashed', borderRightStyle: 'dashed',
                        borderTop: 0,
                        borderColor: '#FFFFFF',
                        boxSizing: 'border-box'
                    }}
                >
                    <Stack
                        direction="column"
                        rowGap={2}
                        mx={4}
                    >
                        {createJoinState === -1 && 
                            <>
                                <Stack direction="row" mt={3} justifyContent="space-between">
                                    <Stack direction="column" rowGap={3.5}>
                                        <GBText text="Room name: "/>
                                        <GBText text="Password: "/>
                                    </Stack>
                                    <Stack direction="column" rowGap={3}>
                                        <GBTextInput value={roomName} onChange={setRoomName} placeholder="Game Room" maxLength={25}/>
                                        <GBTextInput value={password} onChange={setPassword} placeholder="-" maxLength={25} type="password"/>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" mt={3.5} mb={1}>
                                    <GBButton disabled={loading} px={1.5} fs={16} onClick={back} endIcon={<ArrowBackIosIcon/>}>Back</GBButton>
                                    <GBButton disabled={loading} px={1.5} fs={16} onClick={createAndJoinRoom} endIcon={<DoneIcon/>}>Create</GBButton>
                                </Stack>
                            </>
                        }
                        {createJoinState === 1 && 
                            <>
                                <Stack direction="row" mt={3} justifyContent="space-between">
                                    <Stack direction="column" rowGap={3.5}>
                                        <GBText text="Room code: "/>
                                        <GBText text="Password: "/>
                                    </Stack>
                                    <Stack direction="column" rowGap={3}>
                                        <GBTextInput value={joinCode} onChange={handleJoinCodeChange} placeholder="6 digit code" maxLength={6}/>
                                        <GBTextInput value={joinPassword} onChange={setJoinPassword} placeholder="-" maxLength={25} type="password"/>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" mt={3.5} mb={1}>
                                    <GBButton disabled={loading} px={1.5} fs={16} onClick={back} endIcon={<ArrowBackIosIcon/>}>Back</GBButton>
                                    <GBButton disabled={loading} px={1.5} fs={16} onClick={joinRoom} endIcon={<ArrowForwardIcon/>}>Join</GBButton>
                                </Stack>
                            </>
                        }
                    </Stack>
                </Stack>
            </Stack>
            <GBToastContainer/>
        </>
    )
}
