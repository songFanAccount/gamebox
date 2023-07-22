import { Box, Button, Stack } from '@mui/material'
import React, { useState } from 'react'
import { motion } from "framer-motion";
import { GBButton, GBText } from '../components/generalComponents'
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function TicTacToe() {
    const socket = global.socket
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
    socket.on('tictactoe_setGameState', ({game}) => {
        if(!game) return
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
        setTurn(-turn)
    })
    function clickSquare(rowIndex, colIndex) {
        socket.emit('tictactoe_click', {rowIndex, colIndex})
    }
    function requestNewGame() {
        socket.emit('tictactoe_newGameReq')
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
        if(winner === 0) {
            return draw 
            ? (
                <GBText text='Draw!'/>
            )
            : (
                <GBText text={`${turn}'s turn!`}/>
            )
        } else {
            return (
                <GBText text={`${winner} wins!`}/>
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
                                        disabled={el !== 0 || winner !== 0}
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
                    <GBButton onClick={requestNewGame}>
                        Restart
                    </GBButton>
                </Stack>
                <GBText text="stats"/>
            </Stack>
        </Stack>
    )
}
