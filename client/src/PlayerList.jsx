import React from 'react'
import { GBFormalText } from './components/generalComponents'
import { Box, Stack } from '@mui/material'

export default function PlayerList({host, players}) {
    const Host = () => {
        return <GBFormalText text={host}/>
    }
    const Players = () => {
        return (
            <>
                {players?.map((player) => {
                    return <GBFormalText text={player}/>
                })}
            </>
        )
    }
    return (
        <Box>
            <GBFormalText text="Player list:"/>
            <Stack direction="column"
                sx={{
                    border: 1, borderColor: '#FFFFFF'
                }}
            >
                <Host/>
                <Players/>
            </Stack>
        </Box>
    )
}