import React from 'react'
import { GBFormalText } from './components/generalComponents'
import { Box, Stack } from '@mui/material'
import StarSharpIcon from '@mui/icons-material/StarSharp';

export default function PlayerList({host, players}) {
    const Host = () => {
        return (
            <Stack direction="row" alignItems="center" columnGap={1} flexWrap="nowrap">
                <GBFormalText fs={16} text={host}/>
                <StarSharpIcon 
                    sx={{
                        fontSize: 16,
                        color: '#FFFFFF'
                    }}
                />
            </Stack>
        )
    }
    const Players = () => {
        return (
            <>
                {players?.map((player) => {
                    return <GBFormalText fs={16} text={player}/>
                })}
            </>
        )
    }
    return (
        <Box
            sx={{
                width: 250,
                border: 1, borderColor: '#FFFFFF', boxSizing: 'border-box', borderRadius: 3
            }}
        >
            <Box
                sx={{
                    mb: 1.5,
                    width: 1, height: 50,
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 10, borderTopRightRadius: 10,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}
            >
                <GBFormalText color='#121212' text="Players" center/>
            </Box>
            <Stack direction="column"
                sx={{
                    mx: 2, my: 1,
                }}
            >
                <Host/>
                <Players/>
            </Stack>
        </Box>
    )
}