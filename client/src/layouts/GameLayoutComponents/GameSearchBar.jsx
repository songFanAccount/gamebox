import React, {useState, useEffect, useCallback } from "react"
import { Box } from '@mui/material'

import { gamelist } from '../../games/gamelist'
import GameButton from "./GameButton"
import { GBNakedInput, GBText } from "../../components/generalComponents"
import { toast } from "react-toastify"

export default function GameSearchBar({onClickGame, currGame, isHost, roomCode, currGameRecommendation, playerId}) {
    const socket = global.socket
    // list of recommended games and functions to add or remove game from the list
    const recommendGame = useCallback((gameName, playerId) => {
        socket.emit('recommend-game', {roomCode, gameName, playerId})
    }, [roomCode, socket])
    const cancelRecommendGame = useCallback((gameName, playerId) => {
        socket.emit('cancel-game', {roomCode, gameName, playerId})
    }, [roomCode, socket])
    function convert2ToPlayNextButton(gamesObject) {
        // sort keys(game name) by the number of up voters
        const keySorted = Object.keys(gamesObject).sort(function(a,b){return gamesObject[b].length - gamesObject[a].length})
        let buttons = []
        for (let i = 0; i < keySorted.length; i++) {
            const game = keySorted[i]
            const newButton = <GameButton key={game} gameName={game} onClickGame={onClickGame} onClickCancel={cancelRecommendGame} isHost={isHost} isPlayNext={true} playerId={playerId} recommenders={gamesObject[game]}/>
            buttons = [...buttons, newButton]
        }
        return buttons
    }

    const [recommendedGame, setRecommendedGame] = useState(convert2ToPlayNextButton(currGameRecommendation))
    useEffect(()=>{
        setRecommendedGame(convert2ToPlayNextButton(currGameRecommendation))
    // eslint-disable-next-line
    }, [currGameRecommendation])
    
    socket.on('gameroom_updateRecommendation', (newRocommendation) => {
        setRecommendedGame(convert2ToPlayNextButton(newRocommendation.toPlayNext))
        toast.success(newRocommendation.message)
        console.log("listener")
    })

    // With a given list of games searched, create game buttons.
    const [gameButton, setGameButton] = useState([])
    const changeGameList = useCallback((games) => {
        setGameButton(games?.map(game => (
            <GameButton key={game} gameName={game} onClickGame={onClickGame} onClickRecommend={recommendGame} isHost={isHost} playerId={playerId}/>
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
                <GBText text={' Currently Playing'} fs={18} color={'#121212'}/>
                <GBText text={currGame} color={'#121212'} fs={16}/>
                {!currGame && <GBText text={'-'} color={'#121212'} fs={16}/>}
            </Box>
            <Box
                sx={{
                    borderBottom: 1,
                    height: '50%',
                    overflowY: 'auto'
                }}
            >
                <Box
                    sx={{
                        borderBottom: 1, borderColor: '#494d52',
                        position: 'sticky', top: 0, left: 0, zIndex: 1,
                        backgroundColor: '#121212'
                    }}
                >
                    <GBNakedInput value={searchedContent} onChange={(e => setSearchedContent(e.target.value))} placeholder={'search'}/>
                </Box>
                {gameButton}
            </Box>
            <Box
                sx={{
                    height: '50%',
                    overflowY: 'auto'
                }}
            >
                <GBText text={'To play next'} fs={16} ml={0.5}/>
                {recommendedGame}
            </Box>
        </Box>
    )
}