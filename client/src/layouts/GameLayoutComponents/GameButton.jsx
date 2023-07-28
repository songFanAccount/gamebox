import {React} from "react"
import { GBButton } from "../../components/generalComponents"
import { Box, IconButton, Tooltip } from "@mui/material"
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

export default function GameButton({gameName, onClickGame, onClickRecommend, onClickCancel, isHost, isPlayNext=false, playerId, recommenders}) {
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
                    onClick={() => onClickRecommend(gameName, playerId)}
                    size='small'
                >
                    <ThumbUpOffAltIcon/>
                </IconButton>}
                {isPlayNext &&
                <Tooltip title={`${recommenders.map((recommender) => (recommender['name']))}`}>
                    <IconButton
                        aria-label="recommender"
                        size='small'
                        disableRipple
                    >
                        <PeopleAltIcon sx={{color: '#FFFFFF'}}/>
                    </IconButton>
                </Tooltip>}
                {isPlayNext &&
                <IconButton 
                    aria-label="cancel"
                    color="fail"
                    onClick={() => onClickCancel(gameName, playerId)}
                    size='small'
                >
                    <ThumbDownOffAltIcon sx={{color: '#d50000'}}/>
                </IconButton>}
            </Box>
        </Box>
    )
}