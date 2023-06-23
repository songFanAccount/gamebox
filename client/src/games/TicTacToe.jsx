import { Box, Stack } from '@mui/material'
import React, { useState } from 'react'
import { GBText } from '../components/generalComponents'
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function TicTacToe() {
    const socket = global.socket
    // const [board, setBoard] = useState([
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0]
    // ])
    const [board, setBoard] = useState([
        [0, 1, -1],
        [1, 0, 1],
        [0, -1, 0]
    ])
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
                {board.map((row)=> (
                    <Stack direction="row">
                        {row.map((el) => (
                            <Box
                                sx={{
                                    width: squareWidth, height: squareWidth, 
                                    border: 1, borderColor: '#FFFFFF', boxSizing: 'border-box',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}
                            >
                                <Element el={el}/>
                            </Box>
                        ))}
                    </Stack>
                ))}
            </Stack>
            {board}
        </Box>
    )
}
