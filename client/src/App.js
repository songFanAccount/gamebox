import './App.css';
import io from 'socket.io-client'
import Test from './Test';
const socket = io.connect('http://localhost:3001')
global.socket = socket

function App() {
	return (
		<Test/>
	)
}

export default App;
