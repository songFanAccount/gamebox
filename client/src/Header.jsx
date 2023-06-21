import { Stack, Typography } from '@mui/material'
import React from 'react'

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
            <Typography
                sx={{
                    fontFamily: "Braah One",
                    fontSize: 40,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                GameBox
            </Typography>
        </Stack>
    )
}
