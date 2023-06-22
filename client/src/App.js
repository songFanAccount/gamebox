import io from 'socket.io-client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GameLayout from './layouts/GameLayout';
import TicTacToe from './games/TicTacToe';
import Home from './Home';
import DefaultLayout from './DefaultLayout';
import InfoPageLayout from './infoPages/InfoPageLayout';
import About from './infoPages/About';
import Contact from './infoPages/Contact';
const socket = io.connect('http://localhost:3001')
global.socket = socket

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<DefaultLayout/>}>
					<Route index element={<Home/>}/>
					<Route path="/" element={<InfoPageLayout/>}>
						<Route path="about" element={<About/>}/>
						<Route path="contact" element={<Contact/>}/>
					</Route>
					<Route path="/" element={<GameLayout/>}>
						<Route path="tictactoe" element={<TicTacToe/>}/>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App;
