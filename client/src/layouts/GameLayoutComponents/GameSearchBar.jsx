import React, {useState, useEffect, useCallback } from "react"
import { Box, Typography } from '@mui/material'

import { gamelist } from '../../games/gamelist'
import GameButton from "./GameButton"
import { GBNakedInput } from "../../components/generalComponents"

export default function GameSearchBar({onClickGame, currGame, isHost, roomCode, currGameRecommendation}) {
    const socket = global.socket
    // list of recommended games and functions to add or remove game from the list
    const recommendGame = useCallback((gameName) => {
        socket.emit('recommend-game', {roomCode, gameName})
    }, [roomCode, socket])
    const cancelRecommendGame = useCallback((gameName) => {
        socket.emit('cancel-game', {roomCode, gameName})
    }, [roomCode, socket])
    function covert2Button(gameList) {
        return gameList?.map(game => (<GameButton key={game} gameName={game} onClickGame={onClickGame} onClickCancel={cancelRecommendGame} isHost={isHost} isPlayNext={true}/>))
    }

    const [recommendedGame, setRecommendedGame] = useState(covert2Button(currGameRecommendation))
    useEffect(()=>{
        setRecommendedGame(covert2Button(currGameRecommendation))
    // eslint-disable-next-line
    }, [currGameRecommendation])
    
    socket.on('gameroom_newRecommendation', (newRocommendation) => {
        setRecommendedGame(covert2Button(newRocommendation.toPlayNext))
    })

    socket.on('gameroom_cancelRecommendation', (newRocommendation) => {
        setRecommendedGame(covert2Button(newRocommendation.toPlayNext))
    })

    // With a given list of games searched, create game buttons.
    const [gameButton, setGameButton] = useState([])
    const changeGameList = useCallback((games) => {
        setGameButton(games?.map(game => (
            <GameButton key={game} gameName={game} onClickGame={onClickGame} onClickRecommend={recommendGame} isHost={isHost}/>
        )))
    // eslint-disable-next-line
    }, [onClickGame, recommendGame, isHost])

    // Whenever user input is changed, search gamelist with modified input.
    const [searchedContent, setSearchedContent] = useState('')
    useEffect(() => {
        let matchingGames = gamelist.filter(game => (game.toLowerCase().includes(searchedContent.toLowerCase())))
        changeGameList(matchingGames)
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
                {recommendedGame}
            </Box>
        </Box>
    )
}