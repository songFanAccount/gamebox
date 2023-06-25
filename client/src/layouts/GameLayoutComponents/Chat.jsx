import { Box, Stack } from '@mui/material'
import React, { useState } from 'react'
import { GBNakedInput, GBText } from '../../components/generalComponents'

export default function Chat({roomCode}) {
    const socket = global.socket
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    function sendMessage(message) {
        if(message.trimStart() === '') return // Don't send empty messages
        socket.emit('gameroom_sendMsgToChat', {roomCode, message})
    }
    function handleKey(e) {
        if(e.keyCode === 13) sendMessage(message)
    }
    const Message = ({msg}) => {
        return (
            <GBText fs={16} text={msg}/>
        )
    }
    socket.on('gameroom_newChatMsg', ({message, playerName}) => {
        const newMsg = `${playerName}: ${message}`
        setChatMessages([...chatMessages, newMsg])
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
                {chatMessages.map((msg) => <Message msg={msg}/>)}
            </Stack>
            <Box
                sx={{
                    borderTop: 1, borderColor: '#FFFFFF',
                    position: 'absolute',
                    bottom: 0
                }}
            >
                <GBNakedInput value={message} onChange={(e) => setMessage(e.target.value)} width={248} fs={18} onKeyDown={handleKey}/>
            </Box>
        </Box>
    )
}
