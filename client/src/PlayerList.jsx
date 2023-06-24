import React from 'react'
import { GBFormalText } from './components/generalComponents'
import { Box } from '@mui/material'

export default function PlayerList({host, players}) {
    return (
        <Box>
            <GBFormalText text="Player list:"/>
        </Box>
    )
}