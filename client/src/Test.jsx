import React from 'react'
import { Button } from '@mui/material'
export default function Test() {
    const socket = global.socket
    function sendTestMessage(msg) {
        socket.emit('hello', msg)
    }
    return (
        <Button onClick={() => sendTestMessage('hello')}>Send</Button>
    )
}
