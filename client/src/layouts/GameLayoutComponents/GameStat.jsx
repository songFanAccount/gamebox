import React from "react"

import { Box, Button, Typography } from '@mui/material'
import { GBText } from "../../components/generalComponents"
import { GBToastContainer } from '../../components/toast';
import { toast } from "react-toastify"

export default function GameStat({roomCode, roomName}) {
    function CopyLinkAndNotify() {
        // toast.success('Copied link to the clipboard!')
        navigator.clipboard.writeText(window.location.href).then(
            () => {
                toast.success('Copied link to the clipboard!')
            },
            () => {
                toast.error('something went wrong :(')
            }
          );
    }
    return (
        <Box
            sx={{
                borderBottom: 1,
                backgroundColor: '#121212',
                height: 50,
                display: "flex"
            }}
        >
            <Button
                sx={{
                    backgroundColor: "purple",
                    minWidth: 100,
                    borderRadius: 1,
                    m: 0.5
                }}
                onClick={CopyLinkAndNotify}
            >
                <Typography sx={{display: "flex", justifyContent: "center"}} variant="caption">Room Code</Typography>
                <GBText text={roomCode} fs={17} ml={1.5}/>
            </Button>
            <Box
                sx={{
                    backgroundColor: "purple",
                    minWidth: 100,
                    borderRadius: 1,
                    m: 0.5
                }}
            >
                <Typography sx={{display: "flex", justifyContent: "center"}} variant="caption">Room Name</Typography>
                <GBText text={roomName} fs={17} ml={1.5}/>
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
            <GBToastContainer/>
        </Box>
    )
}