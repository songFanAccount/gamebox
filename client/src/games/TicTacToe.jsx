import { Box, Button, Stack } from '@mui/material'
import React, { useState } from 'react'
import { motion } from "framer-motion";
import { GBButton, GBText } from '../components/generalComponents'
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
    const [rowWin, setRowWin] = useState(-1) // -1 for no row win, otherwise 0,1,2 for which row won
    const [colWin, setColWin] = useState(-1) // -1 for no column win, otherwise 0,1,2 for which column won
    const [leftDiagWin, setLeftDiagWin] = useState(false)
    const [rightDiagWin, setRightDiagWin] = useState(false)
    /* Room related info */
    const [playSide, setPlaySide] = useState(0) // -1 for X, 1 for right, 0 for not playing
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
        return <GBText text={`${leftText} vs ${rightText}`}/>
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
    })
    socket.on('tictactoe_newGame', () => {
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
    })
    socket.on('tictactoe_newPlayerJoin', ({displayName, xSide}) => {
        if(!players.left.displayName) {
            /* 1/2 player join */
            setPlayers({...players, left: {
                displayName,
                side: null
            }})
        } else {
            /* 2/2 player join */
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
    socket.on('tictactoe_setPlaySide', ({side}) => {
        setPlaySide(side)
    })
    socket.on('tictactoe_playerLeft', ({side}) => {
        /* Side should be either -1 (left) or 1 (right) */
        if(side === -1) {
            setPlayers({
                left: players.right.displayName ? {...players.right} : {displayName: null, side: null},
                right: {displayName: null, side: null}
            })
        } else if(side === 1) {
            setPlayers({
                ...players,
                right: {displayName: null, side: null}
            })
        }
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
        /* Process draw if applicable */
        } else if(draw) setDraw(true)
        else setTurn(-turn)
    })
    function clickSquare(rowIndex, colIndex) {
        socket.emit('tictactoe_click', {rowIndex, colIndex})
    }
    function requestNewGame() {
        socket.emit('tictactoe_newGameReq')
    }
    function joinAsPlayer() {
        setIsPlaying(players.left.displayName ? 1 : -1)
        socket.emit('tictactoe_joinAsPlayer')
    }
    function leaveAsPlayer() {
        setIsPlaying(0)
        socket.emit('tictactoe_leaveAsPlayer')
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
        if(!players.right.displayName) {
            /* Game does not have two players yet, game not in progress */
            return <GBText text="Join the game to start!"/>
        }
        const curPlayer = turn === players.left.side ? players.left : players.right
        if(winner === 0) {
            return draw 
            ? (
                <GBText text='Draw!'/>
            )
            : (
                <GBText text={`${curPlayer.displayName}'s turn!`}/>
            )
        } else {
            return (
                <GBText text={`${curPlayer.displayName} wins!`}/>
            )
        }
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
                    <RestartButton/>
                </Stack>
                
                <Stack direction="column" alignItems="center"
                    sx={{
                        width: 300, height: 300
                    }}
                >
                    <Versus/>
                    <JoinButton/>
                </Stack>
            </Stack>
        </Stack>
    )
}
