import {React} from "react"
import { GBButton } from "../../components/generalComponents"
import { Box, IconButton, Tooltip } from "@mui/material"
import RecommendIcon from '@mui/icons-material/Recommend';
import CancelIcon from '@mui/icons-material/Cancel';
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
                    size='large'
                >
                    <RecommendIcon/>
                </IconButton>}
                {isPlayNext &&
                <Tooltip title={`${recommenders.map((recommender) => (recommender))}`}>
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
                    size='large'
                >
                    <CancelIcon sx={{color: '#d50000'}}/>
                </IconButton>}
            </Box>
        </Box>
    )
}