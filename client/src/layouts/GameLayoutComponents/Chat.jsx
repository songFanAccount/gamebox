import { Box, Stack } from '@mui/material'
import React, { useState } from 'react'
import { GBNakedInput, GBText } from '../../components/generalComponents'

export default function Chat({roomCode}) {
    const socket = global.socket
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const msgFS = 14
    function sendMessage(message) {
        if(message.trimStart() === '') return // Don't send empty messages
        socket.emit('gameroom_sendMsgToChat', {roomCode, message})
    }
    function handleKey(e) {
        if(e.keyCode === 13) sendMessage(message)
    }
    function addMessage(msg) {
        setChatMessages([...chatMessages, msg])
    }
    const Message = ({playerName, msg}) => { 
        return (
            <Stack direction="row" flexWrap="nowrap">
                <GBText bold fs={msgFS} text={playerName + ': '}/>
                <GBText fs={msgFS} text={msg}/> 
            </Stack>
        )
    }
    const Announcement = ({msg}) => { return <GBText color='#B3B3B3' fs={msgFS} text={msg}/> }
    socket.on('gameroom_newChatMsg', ({message, playerName}) => {
        addMessage(<Message playerName={playerName} msg={message}/>)
    })
    socket.on('gameroom_newChatAnnouncement', ({message}) => {
        addMessage(<Announcement msg={message}/>)
    })
    return (
        <Box
            sx={{
                width: 250, height: 400,
                border: 1, borderColor: '#FFFFFF', boxSizing: 'border-box',
                position: 'relative'
            }}
        >
            <Stack direction="column"
                sx={{
                    mx: 1,
                    height: 340,
                    overflowY: 'auto'
                }}
            >
                {chatMessages.map((msg) => msg)}
            </Stack>
            <Box
                sx={{
                    borderTop: 1, borderColor: '#FFFFFF',
                    position: 'absolute',
                    bottom: 0
                }}
            >
                <GBNakedInput value={message} onChange={(e) => setMessage(e.target.value)} width={248} fs={msgFS} onKeyDown={handleKey}/>
            </Box>
        </Box>
    )
}
