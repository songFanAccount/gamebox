import io from 'socket.io-client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GameLayout from './layouts/GameLayout';
import TicTacToe from './games/TicTacToe';
import Home from './Home';
import DefaultLayout from './DefaultLayout';
import InfoPageLayout from './infoPages/InfoPageLayout';
import About from './infoPages/About';
import Contact from './infoPages/Contact';
import Temp from './Temp';
const socket = io.connect('http://localhost:3001')
global.socket = socket
socket.on('update_localStorage_room', ({roomCode, password, userID}) => {
	localStorage.setItem('roomCode', roomCode)
	localStorage.setItem('password', password)
	localStorage.setItem('userID', userID)
})
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<DefaultLayout/>}>
					<Route index element={<Home/>}/>
					<Route path="temp" element={<Temp/>}/>
					<Route path="/" element={<InfoPageLayout/>}>
						<Route path="about" element={<About/>}/>
						<Route path="contact" element={<Contact/>}/>
					</Route>
					<Route path="game" element={<GameLayout/>}>
						<Route path="tictactoe" element={<TicTacToe/>}/>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App;
