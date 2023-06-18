import React from 'react'
import { Button } from '@mui/material'
export default function Test() {
    function sendTestMessage(msg) {
        global.socket.emit('hello', msg)
    }
    return (
        <Button onClick={() => sendTestMessage('hello')}>Send</Button>
    )
}
