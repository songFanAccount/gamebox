import { Box, Stack } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './header/Header'

export default function DefaultLayout() {
    return (
        <Stack
            direction="column"
        >
            <Header/>
            <Box
                sx={{
                    width: '100%',
                    height: 'calc(100% - 100px)',
                    position: 'fixed',
                    top: 100,
                    left: 0,
                    backgroundColor: '#121212',
                }}
            >
                <Outlet/>
            </Box>
        </Stack>
    )
}
