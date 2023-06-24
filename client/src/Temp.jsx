import React from 'react'
import { GBText } from './components/generalComponents'
import { Box } from '@mui/material'
import PlayerList from './PlayerList'

export default function Temp() {
    return (
        <Box>
            <GBText text="EVERYTHING TEMPORARY DISPLAYED HERE."/>
            <PlayerList host="Host" players={['Ben', 'Jerry']}/>
        </Box>
    )
}