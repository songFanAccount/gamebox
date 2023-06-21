import { Stack, Typography } from '@mui/material'
import React from 'react'
import { GBText } from './components/generalComponents'

export default function Header() {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{
                height: 100, width: '100%',
                position: 'fixed', top:0, left:0,
                color: '#FFFFFF', backgroundColor: '#121212',
                borderBottom: 1, borderColor: '#FFFFFF', boxSizing: 'border-box'
            }}
        >
            <GBText text="GameBox" fontFamily="Braah One" fs={40}/>
        </Stack>
    )
}
