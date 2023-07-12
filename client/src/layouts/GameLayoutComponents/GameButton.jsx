import React from "react"
import { GBButton } from "../../components/generalComponents"
import { Box, IconButton } from "@mui/material"
import RecommendIcon from '@mui/icons-material/Recommend';

export default function GameButton({gameName, onClickGame, onClickRecommend, isHost}) {
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
                <IconButton 
                    aria-label="recommend"
                    color="primary"
                    onClick={() => onClickRecommend(gameName)}
                    size='large'
                    disableRipple
                >
                    <RecommendIcon/>
                </IconButton>
            </Box>
        </Box>
    )
}