import { Stack } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { GBText } from '../components/generalComponents'

export default function InfoPageLayout() {
    return (
        <Stack>
            <GBText text="INFOPAGELAYOUT"/>
            <Outlet/>
        </Stack>
    )
}
