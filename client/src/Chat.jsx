import { Box } from '@mui/material'
import React, { useState } from 'react'
import { GBNakedInput } from './components/generalComponents'

export default function Chat() {
    const socket = global.socket
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    function sendMessage(message) {
        if(message.trimStart() === '') return // Don't send empty messages
        socket.emit('gameroom_sendMsgToChat', {message})
    }
    function handleKey(e) {
        if(e.keyCode === 13) sendMessage(message)
    }
    return (
        <Box
            sx={{
                width: 250, height: 400,
                border: 1, borderColor: '#FFFFFF', boxSizing: 'border-box',
                position: 'relative'
            }}
        >
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
