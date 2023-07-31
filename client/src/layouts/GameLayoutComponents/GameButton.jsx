import {React} from "react"
import { GBButton, GBText } from "../../components/generalComponents"
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
            <GBButton children={gameName} onClick={() => onClickGame(gameName)} disabled={!isHost} fs={18}/>
            <Box
                sx={{ml: 'auto', my: 'auto', display: 'flex'}}
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
                <Box>
                    <GBText text={recommenders.length} fs={13}/>
                </Box>
                }
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