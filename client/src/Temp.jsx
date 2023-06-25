import React from 'react'
import { GBText } from './components/generalComponents'
import { Box, Stack } from '@mui/material'
import PlayerList from './layouts/GameLayoutComponents/PlayerList'
import Chat from './layouts/GameLayoutComponents/Chat'

export default function Temp() {
    return (
        <Box>
            <GBText text="EVERYTHING TEMPORARY DISPLAYED HERE."/>
            <Stack direction="row" columnGap={3}>
                <PlayerList host="Host" players={['Ben', 'Jerry']}/>
                <Chat/>
            </Stack>
        </Box>
    )
}