import { Stack } from '@mui/material'
import React from 'react'

export default function Header() {
    return (
        <Stack direction="row"
            sx={{
                height: 100, width: '100%',
                position: 'fixed', top:0, left:0,
                color: '#FFFFFF', backgroundColor: '#121212',
                borderBottom: 1, borderColor: '#FFFFFF', boxSizing: 'border-box'
            }}
        >
            <h1>GameBox</h1>
        </Stack>
    )
}
