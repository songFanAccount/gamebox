import React, {useState, useEffect, useCallback } from "react"
import { Box, Typography } from '@mui/material'

import { gamelist } from '../../games/gamelist'
import GameButton from "./GameButton"
import { GBNakedInput } from "../../components/generalComponents"

export default function GameSearchBar({onClick, currGame, isHost}) {
    // With a given list of games searched, create game buttons.
    let [gameButton, setGameButton] = useState([])
    const changeGameList = useCallback((games) => {
        setGameButton(games?.map(game => (
            <GameButton key={game} gameName={game} onClick={onClick} isHost={isHost}/>
        )))
    }, [onClick])

    // Whenever user input is changed, search gamelist with modified input.
    const [searchedContent, setSearchedContent] = useState('')
    useEffect(() => {
        let games = searchGame(searchedContent)
        changeGameList(games)
    }, [searchedContent, changeGameList])
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
                {!currGame && <Typography fontFamily='orbit'>-</Typography>}
            </Box>
            <Box
                sx={{
                    borderBottom: 1,
                    height: '50%'
                }}
            >
                <Box
                    sx={{
                        borderBottom: 1, borderColor: '#494d52'
                    }}
                >
                    <GBNakedInput value={searchedContent} onChange={(e => setSearchedContent(e.target.value))} placeholder={'search'}/>
                </Box>
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

function searchGame(gameName) {
    return gamelist.filter(game => (game.toLowerCase().includes(gameName.toLowerCase())))
}