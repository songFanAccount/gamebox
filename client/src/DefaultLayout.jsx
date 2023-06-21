import { Stack } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function DefaultLayout() {
    return (
        <Stack
            direction="column"
        >
            <Header/>
            <Outlet/>
        </Stack>
    )
}
