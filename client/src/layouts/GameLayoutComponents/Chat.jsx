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
        return <GBText fs={msgFS} text={`${playerName}: ${msg}`}/>
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
                    wordBreak: 'break-all'
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
                <GBNakedInput value={message} onChange={(e) => setMessage(e.target.value)} width={348} maxLength={null} fs={msgFS} placeholder="Say something..." onKeyDown={handleKey}/>
            </Box>
        </Box>
    )
}
