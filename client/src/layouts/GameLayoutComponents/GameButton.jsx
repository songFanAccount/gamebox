import React from "react"
import { GBButton } from "../../components/generalComponents"
import { Box, IconButton } from "@mui/material"
import RecommendIcon from '@mui/icons-material/Recommend';

export default function GameButton({gameName, onClick, isHost}) {
    return (
        <Box>
            <GBButton children={gameName} onClick={() => onClick(gameName)} disabled={!isHost}/>
            <IconButton aria-label="recommend" color="primary" onClick={() => console.log('recommending '+gameName)}>
                <RecommendIcon/>
            </IconButton>
        </Box>
    )
}