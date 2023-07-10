import React from "react"
import { Box, Typography } from '@mui/material'

import { gamelist } from '../../games/gamelist'
import GameButton from "./GameButton"

export default function GameSearchBar({onClick, currGame}) {
    let gameButton = []
    gameButton = gamelist?.map(game => (
        <GameButton key={game} gameName={game} onClick={onClick}/>
    ))
    return (
        <Box
            sx={{
                minWidth: 250,
                m: 1,
                border: 1, borderTop: 0,
                borderRadius: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20,
                display: 'flex', flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    borderBottom: 1, borderTopLeftRadius: 15, borderTopRightRadius: 15,
                    backgroundColor: '#FFF', color: '#121212',
                }}
            >
                <Typography fontFamily='orbit' fontSize={18}> Currently Playing</Typography>
                <Typography fontFamily='orbit'>{currGame}</Typography>
            </Box>
            <Box
                sx={{
                    borderBottom: 1,
                    height: '50%'
                }}
            >
                <Typography fontFamily='orbit'>Search bar</Typography>
                {gameButton}
            </Box>
            <Box
                sx={{
                    height: '50%'
                }}
            >
                <Typography fontFamily='orbit'>To play next</Typography>
            </Box>
        </Box>
    )
}