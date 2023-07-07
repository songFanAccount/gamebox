import React from "react"

import { Box, Button, Typography } from '@mui/material'
import { GBText } from "../../components/generalComponents"
import { GBToastContainer } from '../../components/toast';
import { toast } from "react-toastify"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function GameStat({roomCode, roomName}) {
    function CopyLinkAndNotify() {
        // toast.success('Copied link to the clipboard!')
        navigator.clipboard.writeText(roomCode).then(
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
                // borderBottom: 1,
                backgroundColor: '#121212',
                height: 50,
                display: "flex"
            }}
        >
            <Button
                sx={{
                    backgroundColor: "white", color: "black",
                    minWidth: 100,
                    borderRadius: 1,
                    m: 0.3, mb: 0, px: 2,
                    display: 'flex', flexWrap: 'no-wrap', justifyContent: 'center'
                }}
                disableRipple
                onClick={CopyLinkAndNotify}
                endIcon={<ContentCopyIcon/>}
            >
                <Typography sx={{fontSize: 10}}>CODE</Typography>
                <GBText text={roomCode} color={"black"} fs={17} ml={1.5}/>
            </Button>
            <Box
                sx={{
                    backgroundColor: "white", color: "black",
                    minWidth: 100,
                    borderRadius: 1,
                    m: 0.3, mb: 0, px: 2,
                    display: 'flex', flexWrap: 'no-wrap', alignItems: 'center'
                }}
            >
                <Typography sx={{fontSize: 10}}>ROOM NAME</Typography>
                <GBText text={roomName} color={"black"} fs={17} ml={1.5}/>
            </Box>
            <GBToastContainer/>
        </Box>
    )
}