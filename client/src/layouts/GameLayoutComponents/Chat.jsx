import { Box, Stack } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { GBNakedInput, GBText } from '../../components/generalComponents'
import messageAudio from '../../assets/message.mp3'
import useSound from 'use-sound'

export default function Chat({roomCode}) {
    const socket = global.socket
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const chatEnd = useRef(null)
    const msgFS = 14
    /* Sounds */
    const [playMsgSound] = useSound(messageAudio, {volume: 0.2, interrupt: true})
    function sendMessage(message) {
        if(message.trimStart() === '') return // Don't send empty messages
        socket.emit('gameroom_sendMsgToChat', {roomCode, message})
    }
    function clearChatInput() { setMessage('') }
    function handleKey(e) {
        if(e.keyCode === 13) { sendMessage(message); clearChatInput() }
    }
    function addMessage(msg) {
        setChatMessages([...chatMessages, msg])
        playMsgSound()
    }
    const Message = ({playerName, msg}) => { 
        return <GBText fs={msgFS} text={`${playerName}: ${msg}`}/>
    }
    const Announcement = ({msg}) => { return <GBText color='#B3B3B3' fs={msgFS} text={msg}/> }
    socket.on('gameroom_newChatMsg', ({message, playerName}) => {
        addMessage(<Message playerName={playerName} msg={message}/>)
        console.log('new message is ' + message)
    })
    socket.on('gameroom_newChatAnnouncement', ({message}) => {
        addMessage(<Announcement msg={message}/>)
    })
    useEffect(() => {
        chatEnd.current?.scrollIntoView()
    }, [chatMessages])
    return (
        <Box
            sx={{
                width: 1, maxWidth: 1, height: 0.5,
                border: 1, borderTop: 0, borderColor: '#FFFFFF', boxSizing: 'border-box',
                position: 'absolute', bottom: 0
            }}
        >
            <Stack direction="column"
                sx={{
                    mx: 2, mt: 1,
                    height: 'calc(100% - 50px)',
                    overflowY: 'auto',
                    wordBreak: 'break-all',
                    '&::-webkit-scrollbar':{
                        width:0,
                    }
                }}
            >
                {chatMessages.map((msg) => msg)}
                <div ref={chatEnd}/>
            </Stack>
            <Box
                sx={{
                    borderTop: 1, borderColor: '#FFFFFF',
                    position: 'absolute',
                    bottom: 0
                }}
            >
                <GBNakedInput value={message} onChange={(e) => setMessage(e.target.value)} width={348} maxLength={null} fs={msgFS} placeholder="Say something..." onKeyDown={handleKey}/>
            </Box>
        </Box>
    )
}
