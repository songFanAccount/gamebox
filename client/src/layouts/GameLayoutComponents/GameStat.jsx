import React from "react"

import { Box, Typography } from '@mui/material'
import { GBText } from "../../components/generalComponents"

export default function GameStat({roomCode}) {
    return (
        <Box
            sx={{
                borderBottom: 1,
                backgroundColor: '#121212',
                height: 50,
                display: "flex"
            }}
        >
            <Box
                sx={{
                    backgroundColor: "purple",
                    minWidth: 100,
                    borderRadius: 1,
                    m: 0.5
                }}
            >
                <Typography sx={{display: "flex", justifyContent: "center"}} variant="caption">Room Code</Typography>
                <GBText text={roomCode} fs={17} ml={1.5}/>
            </Box>
            <Box
                sx={{
                    backgroundColor: "purple",
                    minWidth: 100,
                    borderRadius: 1,
                    m: 0.5
                }}
            >
                <Typography sx={{display: "flex", justifyContent: "center"}} variant="caption">Play Time</Typography>
                <GBText text="q12hrj1" fs={17} ml={1.5}/>
            </Box>
            <Box
                sx={{
                    backgroundColor: "purple",
                    minWidth: 100,
                    borderRadius: 1,
                    m: 0.5
                }}
            >
                <Typography sx={{display: "flex", justifyContent: "center"}} variant="caption">Round</Typography>
                <GBText text="q12hrj1" fs={17} ml={1.5}/>
            </Box>
            <Box
                sx={{
                    backgroundColor: "purple",
                    minWidth: 100,
                    borderRadius: 1,
                    m: 0.5
                }}
            >
                <Typography sx={{display: "flex", justifyContent: "center"}} variant="caption">Ranking</Typography>
                <GBText text="q12hrj1" fs={17} ml={1.5}/>
            </Box>
        </Box>
    )
}