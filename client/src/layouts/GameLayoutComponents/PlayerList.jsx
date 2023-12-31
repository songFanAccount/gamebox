import React, { useEffect, useState } from 'react'
import { GBText } from '../../components/generalComponents'
import { Box, Stack } from '@mui/material'
import StarSharpIcon from '@mui/icons-material/StarSharp';

export default function PlayerList({roomCode}) {
    const socket = global.socket
    const [host, setHost] = useState(null)
    const [players, setPlayers] = useState(null)
    /* Using the room code, retrieve the host and the list of players from server */
    useEffect(() => {
        socket.emit('gameroom_requestPlayerNames', {roomCode})
    // eslint-disable-next-line
    }, [])
    socket.on('gameroom_getPlayerNames', ({hostName, playersNames}) => {
        setHost(hostName)
        setPlayers(playersNames)
    })
    const Host = () => {
        return (
            <Stack direction="row" alignItems="center" columnGap={1} flexWrap="nowrap">
                <GBText fs={18} text={host}/>
                <StarSharpIcon 
                    sx={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        mt: 0.5
                    }}
                />
            </Stack>
        )
    }
    const Players = () => {
        return (
            <>
                {players?.map((player) => {
                    return <GBText fs={18} text={player}/>
                })}
            </>
        )
    }
    return (
        <Box
            sx={{
                width: 1, maxWidth: 1, height: 0.5,
                border: 1, borderColor: '#FFFFFF', boxSizing: 'border-box', borderTopLeftRadius: 15, borderTopRightRadius: 15,
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
                <GBText color='#121212' text="Players" fs={22}/>
            </Box>
            <Stack direction="column"
                sx={{
                    mx: 2, my: 1, 
                    maxWidth: 1, height: 'calc(100% - 80px)',
                    overflowY: 'auto',
                    wordBreak: 'break-word'
                }}
            >
                <Host/>
                <Players/>
            </Stack>
        </Box>
    )
}