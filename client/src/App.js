import io from 'socket.io-client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GameLayout from './layouts/GameLayout';
import TicTacToe from './games/TicTacToe';
const socket = io.connect('http://localhost:3001')
global.socket = socket

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<GameLayout/>}>
					<Route path="tictactoe" element={<TicTacToe/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App;
