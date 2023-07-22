import React from 'react'
import TicTacToe from './TicTacToe'
import Sudoku from './Sudoku'
import Snake from './Snake'
import Chess from './Chess'
import G2048 from './G2048'
import Arithmetic from './Arithmetic'

import { GBText } from '../components/generalComponents'

export const gamelist = [
    'tictactoe', 'sudoku', 'snake', 'chess', '2048', 'arithmetic'
]

export function Name2Game(name) {
    switch(name) {
        case 'tictactoe':
            return <TicTacToe/>
        case 'sudoku':
            return <Sudoku/>
        case 'snake':
            return <Snake/>
        case 'chess':
            return <Chess/>
        case '2048':
            return <G2048/>
        case 'arithmetic':
            return <Arithmetic/>
        default:
            return <GBText text="Choose a game you want to play :)"/>
    }
}