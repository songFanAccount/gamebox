import React from "react"
import { GBButton } from "../../components/generalComponents"
import { Box, IconButton } from "@mui/material"
import RecommendIcon from '@mui/icons-material/Recommend';
import CancelIcon from '@mui/icons-material/Cancel';

export default function GameButton({gameName, onClickGame, onClickRecommend, onClickCancel, isHost, isPlayNext=false}) {
    return (
        <Box
            sx={{
                m: 1,
                display: 'flex'
            }}
        >
            <GBButton children={gameName} onClick={() => onClickGame(gameName)} disabled={!isHost} />
            <Box
                sx={{ml: 'auto', my: 'auto'}}
            >
                {!isPlayNext &&
                <IconButton 
                    aria-label="recommend"
                    color="primary"
                    onClick={() => onClickRecommend(gameName)}
                    size='large'
                    disableRipple
                >
                    <RecommendIcon/>
                </IconButton>}
                {isPlayNext &&
                <IconButton 
                    aria-label="cancel"
                    color="fail"
                    onClick={() => onClickCancel(gameName)}
                    size='large'
                    disableRipple
                >
                    <CancelIcon sx={{color: '#d50000'}}/>
                </IconButton>}
            </Box>
        </Box>
    )
}