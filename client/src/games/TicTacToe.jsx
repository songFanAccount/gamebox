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
    const [emptySpaces, setEmptySpaces] = useState(9)
    const [turn, setTurn] = useState(-1) // -1 for X, 1 for O
    const [winner, setWinner] = useState(0) // -1 for X, 1 for O, 0 for undetermined
    function clickSquare(rowIndex, colIndex) {
        const newBoardState = 
            board.map((row, rIndex) => (
                rIndex === rowIndex 
                ? row.map((el, cIndex) => cIndex === colIndex ? turn : el)
                : row
            ))
        setBoard(
            newBoardState
        )
        const numEmptySpaces = emptySpaces - 1
        setEmptySpaces(numEmptySpaces)
        /* 
        Should determine game status after each move, either:
        - Player wins: A row/column/diagonal of X or Os. From the clicked square, span out to check its row/column and diagonal if applicable
        - Draw: Previous case has not occurred, and board is now full. Detect fullness when 'emptySpaces' === 0
        - Otherwise just continue playing!
        */
        // NOTE: Storing every win condition for animation purposes
        const rowWin = newBoardState[rowIndex].every((el) => el === turn) // Check row
        const colWin = newBoardState.every((row) => row[colIndex] === turn) // Then check column
        // Now check diagonals
        const leftDiagWin = 
            newBoardState[0][0] === turn &&
            newBoardState[1][1] === turn &&
            newBoardState[2][2] === turn 
        const rightDiagWin = 
            newBoardState[0][2] === turn &&
            newBoardState[1][1] === turn &&
            newBoardState[2][0] === turn 
        const win = rowWin || colWin || leftDiagWin || rightDiagWin
        if(win) setWinner(turn)
        else setTurn(-turn)
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
            return (
                <GBText text={`${turn}'s turn!`}/>
            )
        } else {
            return (
                <GBText text={`${winner} wins!`}/>
            )
        }
    }
    return (
        <Box>
            <GBText text="Tic Tac Toe"/>
            <GameStatus/>
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
                                disabled={el !== 0 || winner !== 0}
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
