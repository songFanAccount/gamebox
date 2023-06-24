import React from 'react'
import { GBText } from './components/generalComponents'
import { Box } from '@mui/material'
import Userlist from './Userlist'

export default function Temp() {
    return (
        <Box>
            <GBText text="EVERYTHING TEMPORARY DISPLAYED HERE."/>
            <Userlist/>
        </Box>
    )
}
