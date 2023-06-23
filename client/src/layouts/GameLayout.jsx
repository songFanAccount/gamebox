import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function GameLayout() {
    return (
        <Box
            sx={{
                width: 1
            }}
        >
            <Outlet/>
        </Box>
    )
}
