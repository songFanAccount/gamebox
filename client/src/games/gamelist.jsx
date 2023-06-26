import React from 'react'
import TicTacToe from './TicTacToe'
import Sudoku from './Sudoku'

import { GBText } from '../components/generalComponents'

export const gamelist = [
    'tictactoe', 'sudoku', 
]

export function Name2Game(name) {
    switch(name) {
        case 'tictactoe':
            return <TicTacToe/>
        case 'sudoku':
            return <Sudoku/>
        default:
            return <GBText text="Choose a game you want to play :)"/>
    }
}