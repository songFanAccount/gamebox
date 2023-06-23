import { Box, Button, Stack } from '@mui/material'
import React, { useState } from 'react'
import { GBText } from '../components/generalComponents'
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
    // const [board, setBoard] = useState([
    //     [0, 1, -1],
    //     [1, 0, 1],
    //     [0, -1, 0]
    // ])
    function clickSquare(rowIndex, colIndex) {
        setBoard(
            board.map((row, rIndex) => (
                rIndex === rowIndex 
                ? row.map((el, cIndex) => cIndex === colIndex ? turn : el)
                : row
            ))
        )
        setTurn(-turn)
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
    return (
        <Box>
            <GBText text="Tic Tac Toe"/>
            <Stack direction="column"
                sx={{
                    width: 'fit-content',
                    border: 1, borderColor: '#FFFFFF', boxSizing: 'border-box'
                }}
            >
                {board.map((row, rowIndex)=> (
                    <Stack direction="row">
                        {row.map((el, colIndex) => (
                            <Button
                                className={`tictactoe-${rowIndex}-${colIndex}`}
                                disableRipple
                                disabled={el !== 0}
                                onClick={() => clickSquare(rowIndex, colIndex)}
                                sx={{
                                    p:0, m:0, 
                                    width: squareWidth, height: squareWidth,
                                    backgroundColor: '#121212',
                                    border: 1, borderColor: '#FFFFFF', boxSizing: 'border-box', borderRadius: 0,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    '&:hover': {
                                        backgroundColor: '#121212',
                                    }
                                }}
                            >
                                <Element el={el}/>
                            </Button>
                        ))}
                    </Stack>
                ))}
            </Stack>
            {board}
        </Box>
    )
}
