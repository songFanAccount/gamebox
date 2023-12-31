import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { GBButton, GBRequestModal, GBStandardConfirmModal, GBText } from '../components/generalComponents'
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function TicTacToe() {
    const socket = global.socket
    /* Game related info */
    const [board, setBoard] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ])
    const [turn, setTurn] = useState(-1) // -1 for X, 1 for O
    const [winner, setWinner] = useState(0) // -1 for X, 1 for O, 0 for undetermined
    const [draw, setDraw] = useState(false)
    const [forfeit, setForfeit] = useState(null) // null for no forfeit, others should store the display name of the player who forfeited
    const [rowWin, setRowWin] = useState(-1) // -1 for no row win, otherwise 0,1,2 for which row won
    const [colWin, setColWin] = useState(-1) // -1 for no column win, otherwise 0,1,2 for which column won
    const [leftDiagWin, setLeftDiagWin] = useState(false)
    const [rightDiagWin, setRightDiagWin] = useState(false)
    /* Room related info */
    const [playSide, setPlaySide] = useState(0) // -1 for X, 1 for O, 0 for not playing
    const [isPlaying, setIsPlaying] = useState(0) // -1 for left, 1 for right, 0 for not playing - spectating
    const [players, setPlayers] = useState({
        left: {
            displayName: null,
            side: null
        },
        right: {
            displayName: null,
            side: null
        }
    })
    const [curVsStats, setCurVsStats] = useState({
        leftWins: 0,
        rightWins: 0
    })
    /* Modals stuff */
    const [restartReq, setRestartReq] = useState(false)
    const [restartConf, setRestartConf] = useState(false)
    const [forfeitConf, setForfeitConf] = useState(false)
    /* Cleaning up if the player unexpectedly leaves the room (like closing browser) */
    useEffect(() => {
        return () => {
            socket.emit('tictactoe_leaveAsPlayer')
            socket.emit('tictactoe_unsubscribe')
            socket.removeAllListeners('tictactoe_setGameState')
            socket.removeAllListeners('tictactoe_newGame')
            socket.removeAllListeners('tictactoe_newPlayerJoin')
            socket.removeAllListeners('tictactoe_setXSide')
            socket.removeAllListeners('tictactoe_setPlaySide')
            socket.removeAllListeners('tictactoe_restartReq')
            socket.removeAllListeners('tictactoe_restartReqCancel')
            socket.removeAllListeners('tictactoe_declineRestart')
            socket.removeAllListeners('tictactoe_playerLeft')
            socket.removeAllListeners('tictactoe_clickResponse')
        }
    }, [])
    const JoinButton = () => {
        if(isPlaying) return <GBButton onClick={leaveAsPlayer}>Leave</GBButton>
        else if(players.right.displayName) return <></>
        else return <GBButton width={120} onClick={joinAsPlayer}>Join</GBButton>
    }
    const Versus = () => {
        let leftText = players.left.displayName
        if(!leftText) leftText = '?'
        else {
            const leftSide = players.left.side
            if(leftSide) {
                leftText += ` (${leftSide === -1 ? 'X' : 'O'})`
            } else {
                leftText += ' (?)'
            }
        }
        let rightText = players.right.displayName
        if(!rightText) rightText = '?'
        else {
            const rightSide = players.right.side
            if(rightSide) {
                rightText += ` (${rightSide === -1 ? 'X' : 'O'})`
            } else {
                rightText += ' (?)'
            }
        }
        return (
            <Stack
                direction="row"
                columnGap={2}
            >
                <Stack
                    direction="column"
                    rowGap={2}
                    alignItems="end"
                >
                    <GBText text={leftText}/>
                    <GBText text={curVsStats.leftWins}/>
                </Stack>
                <Stack
                    direction="column"
                    rowGap={2}
                    alignItems="center"
                >
                    <GBText text="vs"/>
                    <GBText text=":"/>
                </Stack>
                <Stack
                    direction="column"
                    rowGap={2}
                    alignItems="start"
                >
                    <GBText text={rightText}/>
                    <GBText text={curVsStats.rightWins}/>
                </Stack>
            </Stack>
        )
    }
    const RestartButton = () => {
        /* Restart button should only show up for current players, and only when in game (2 players) */
        const show = isPlaying && players.right.displayName
        return show
        ?
            <GBButton onClick={requestNewGame}>
                Restart
            </GBButton>
        :
            <></>
    }
    const Modals = () => {
        return (
            <>
                <GBRequestModal
                    open={restartReq}
                    title="Awaiting response..."
                    desc="Both players need to agree in order to restart the game."
                    cancelFunc={() => 
                        {
                            setRestartReq(false)
                            socket.emit('tictactoe_newGameReqCancel')
                        }
                    }
                />
                <GBStandardConfirmModal
                    open={restartConf}
                    onClose={() => setRestartConf(false)}
                    title="Restart request"
                    desc="Your opponent has requested to restart the game, what do you say?"
                    cancelText="Decline"
                    cancelFunc={
                        () => {
                            setRestartConf(false)
                            socket.emit('tictactoe_restartRes', {restart: false})
                        }
                    }
                    confirmFunc={() => 
                        {
                            setRestartConf(false)
                            socket.emit('tictactoe_restartRes', {restart: true})
                        }
                    }
                />
                <GBStandardConfirmModal
                    open={forfeitConf}
                    onClose={() => setForfeitConf(false)}
                    title="Forfeit?"
                    desc="Leaving mid game will count as a forfeit! Are you sure?"
                    cancelText="Cancel"
                    cancelFunc={() => setForfeitConf(false)}
                    confirmText="Forfeit"
                    confirmFunc={() => 
                        {
                            setForfeitConf(false)
                            leaveGame()
                        }
                    }
                />
            </>
        )
    }
    socket.on('tictactoe_setGameState', ({game, curPlayers}) => {
        if(!game) return
        setPlayers({
            left: {
                displayName: curPlayers.leftName,
                side: game.xSide
            },
            right: {
                displayName: curPlayers.rightName,
                side: -game.xSide
            }
        })
        setBoard(game.board)
        setTurn(game.turn)
        if(game.winner !== 0) {
            if(game.rowWin) setRowWin(game.lastRowIndex)
            if(game.colWin) setColWin(game.lastColIndex)
            setLeftDiagWin(game.leftDiagWin)
            setRightDiagWin(game.rightDiagWin)
            setWinner(game.winner)
        } else if(game.draw) setDraw(true)
        /* Set game stats */
        setCurVsStats({
            leftWins: game.stats.leftWins,
            rightWins: game.stats.rightWins
        })
    })
    function resetGame() {
        setRestartReq(false)
        setBoard([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ])
        setTurn(-1)
        setWinner(0)
        setDraw(false)
        setRowWin(-1)
        setColWin(-1)
        setLeftDiagWin(false)
        setRightDiagWin(false)
    }
    socket.on('tictactoe_newGame', () => {
        resetGame()
    })
    socket.on('tictactoe_newPlayerJoin', ({displayName, xSide}) => {
        if(!players.left.displayName) {
            /* 1/2 player join */
            setPlayers({...players, left: {
                displayName,
                side: null
            }})
        } else {
            /* 2/2 player join, since game starts, reset board and forfeit state */
            resetGame()
            setForfeit(null)
            setPlayers({
                left: {
                    displayName: players.left.displayName,
                    side: xSide
                },
                right: {
                    displayName,
                    side: -xSide
                }
            })
        }
    })
    socket.on('tictactoe_setXSide', ({xSide}) => {
        setPlayers({
            left: {
                displayName: players.left.displayName,
                side: xSide
            },
            right: {
                displayName: players.right.displayName,
                side: -xSide
            }
        })
    })
    socket.on('tictactoe_setPlaySide', ({side}) => { setPlaySide(side) })
    socket.on('tictactoe_restartReq', () => { setRestartConf(true) })
    socket.on('tictactoe_restartReqCancel', () => { setRestartConf(false) })
    socket.on('tictactoe_declineRestart', () => { setRestartReq(false) })
    socket.on('tictactoe_playerLeft', ({side, midGame}) => {
        /* If someone left mid game, reset relevant info, and display the forfeit in game status */
        if(midGame) {
            const player = side === -1 ? players.left : players.right
            setForfeit(player.displayName)
            setTurn(-1)
            if(winner) {
                setRowWin(-1)
                setColWin(-1)
                setLeftDiagWin(false)
                setRightDiagWin(false)
            }
            setWinner(0)
            setDraw(false)
            setPlaySide(0)
        }
        /* Side should be either -1 (left) or 1 (right) */
        if(side === -1) {
            setPlayers({
                left: players.right.displayName ? {displayName: players.right.displayName, side: null} : {displayName: null, side: null},
                right: {displayName: null, side: null}
            })
            /* Additionally, if this user is the player on the right side, we need to set isPlaying to now the left side (-1) */
            if(isPlaying === 1) setIsPlaying(-1)
        } else if(side === 1) {
            setPlayers({
                left: {displayName: players.left.displayName, side: null},
                right: {displayName: null, side: null}
            })
        }
        /* Reset stats to 0 */
        setCurVsStats({
            leftWins: 0,
            rightWins: 0
        })
    })
    socket.on('tictactoe_clickResponse', ({rowIndex, colIndex, winner, draw, rowWin, colWin, leftDiagWin, rightDiagWin}) => {
        const newBoardState = 
        board.map((row, rIndex) => (
            rIndex === rowIndex 
            ? row.map((el, cIndex) => cIndex === colIndex ? turn : el)
            : row
        ))
        setBoard(newBoardState)
        /* Update win condition states if won */
        if(winner !== 0) {
            if(rowWin) setRowWin(rowIndex)
            if(colWin) setColWin(colIndex)
            setLeftDiagWin(leftDiagWin)
            setRightDiagWin(rightDiagWin)
            setWinner(winner)
            /* Update stats */
            const winnerSide = turn === players.left.side ? -1 : 1
            setCurVsStats({
                leftWins: winnerSide === -1 ? curVsStats.leftWins + 1 : curVsStats.leftWins,
                rightWins: winnerSide === 1 ? curVsStats.rightWins + 1 : curVsStats.rightWins
            })
        /* Process draw if applicable */
        } else if(draw) setDraw(true)
        else setTurn(-turn)
    })
    function clickSquare(rowIndex, colIndex) {
        socket.emit('tictactoe_click', {rowIndex, colIndex})
    }
    function requestNewGame() {
        /* If game has finished (win/draw), this should just skip the request and just restart */
        if(winner !== 0) {
            socket.emit('tictactoe_restartRes', {restart: true})
            return
        }
        /* Open up a modal while waiting for the other player to respond to this request */
        setRestartReq(true)
        socket.emit('tictactoe_newGameReq')
    }
    function joinAsPlayer() {
        setIsPlaying(players.left.displayName ? 1 : -1)
        socket.emit('tictactoe_joinAsPlayer')
    }
    function leaveGame() {
        setIsPlaying(0)
        socket.emit('tictactoe_leaveAsPlayer')
    }
    function leaveAsPlayer() {
        /* If there is an ongoing game, this action should result in a forfeit. Prompt the user with a modal */
        if(playSide !== 0 && winner === 0 && !draw) {
            setForfeitConf(true)
            return
        }
        leaveGame()
    }
    const squareWidth = 100
    const Element = ({el}) => {
        /* el can be -1 (X), 0 (None), or 1 (O) */
        const crossSx = {
            color: '#FFFFFF',
            fontSize: 60
        }
        const circleSx = {
            color: '#FFFFFF',
            fontSize: 50
        }
        switch(el) {
            case 0:
                return <></>
            case -1:
                return <CloseIcon sx={crossSx}/>
            case 1: 
                return <RadioButtonUncheckedIcon sx={circleSx}/>
            default:
                throw new Error('TicTacToe: Unexpected element!')
        }
    }
    const GameStatus = () => {
        if(forfeit) return <GBText text={`${forfeit} forfeited!`}/>
        if(!players.right.displayName) {
            /* Game does not have two players yet, game not in progress */
            return <GBText text="Join the game to start!"/>
        }
        const curPlayer = turn === players.left.side ? players.left : players.right
        let displayMsg
        if(winner === 0) {
            if(draw) displayMsg = 'Draw!'
            else displayMsg = turn === playSide ? 'Your turn!' : `${curPlayer.displayName}'s turn!`
        } else displayMsg = turn === playSide ? 'You win!' : `${curPlayer.displayName} wins!`
        return <GBText text={displayMsg}/>
    }
    const drawAnim = {
        hidden: { pathLength: 0, opacity: 0, stroke: "#FFFFFF", strokeWidth: 5 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { type: "tween", duration: 0.5, bounce: 0 },
              opacity: { duration: 0.01 }
            }
        }
      };
    return (
        <Stack
            direction="column"
            alignItems="center"
            rowGap={5}
        >
            <GBText text="Tic Tac Toe"/>
            <Stack
                direction="row"
                alignItems="center"
                columnGap={10}
                sx={{
                    height: 'fit-content'
                }}
            >
                <Stack
                    direction="column"
                    alignItems="center"
                    rowGap={3}
                >
                    <GameStatus/>
                    <Stack direction="column"
                        sx={{
                            width: 300, height: 300,
                            border: 1, borderColor: '#FFFFFF'
                        }}
                        >
                        <Box
                            component={motion.svg}
                            initial="hidden"
                            animate="visible"
                            sx={{
                                width: 300, height: 300,
                                position: 'absolute',
                            }}
                            >
                            {rowWin !== -1 && 
                                <motion.line
                                    x1="18"
                                    y1={50 + rowWin * 100}
                                    x2="282"
                                    y2={50 + rowWin * 100}
                                    variants={drawAnim}
                                />
                            }
                            {colWin !== -1 && 
                                <motion.line
                                    x1={50 + colWin * 100}
                                    y1="18"
                                    x2={50 + colWin * 100}
                                    y2="282"
                                    variants={drawAnim}
                                    />
                                }
                            {leftDiagWin && 
                                <motion.line
                                    x1="20"
                                    y1="20"
                                    x2="280"
                                    y2="280"
                                    variants={drawAnim}
                                    />
                                }
                            {rightDiagWin && 
                                <motion.line
                                    x1="280"
                                    y1="20"
                                    x2="20"
                                    y2="280"
                                    variants={drawAnim}
                                />
                            }
                        </Box>
                        {board.map((row, rowIndex)=> (
                            <Stack direction="row">
                                {row.map((el, colIndex) => (
                                    <Button
                                    className={`tictactoe-${rowIndex}-${colIndex}`}
                                    disableRipple
                                        disabled={isPlaying === 0 || !players.right.displayName || turn !== playSide || el !== 0 || winner !== 0}
                                        onClick={() => clickSquare(rowIndex, colIndex)}
                                        sx={{
                                            p:0, m:0, 
                                            width: squareWidth, height: squareWidth,
                                            border: 1, borderColor: '#FFFFFF', boxSizing: 'border-box', borderRadius: 0,
                                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            }
                                        }}
                                        >
                                        <Element el={el}/>
                                    </Button>
                                ))}
                            </Stack>
                        ))}
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent={isPlaying && players.right.displayName ? "space-between" : 'center'}
                        sx={{
                            width: 1
                        }}
                    >
                        <JoinButton/>
                        <RestartButton/>
                    </Stack>
                </Stack>
                <Versus/>
            </Stack>
            <Modals/>
        </Stack>
    )
}
