import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function GameLayout() {
    return (
        <Box>
            <h1>game layout temp</h1>
            <Outlet/>
        </Box>
    )
}
