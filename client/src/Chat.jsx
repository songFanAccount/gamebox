import { Box } from '@mui/material'
import React, { useState } from 'react'
import { GBNakedInput } from './components/generalComponents'

export default function Chat() {
    const [message, setMessage] = useState('')
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
                <GBNakedInput value={message} onChange={(e) => setMessage(e.target.value)} width={248} fs={18}/>
            </Box>
        </Box>
    )
}
