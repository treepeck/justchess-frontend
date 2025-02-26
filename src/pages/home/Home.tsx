import "./Home.css"
import _WebSocket from "../../ws/ws"
import { useEffect, useState } from "react"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"
import Message, { MessageType } from "../../ws/msg"
import { useNavigate } from "react-router-dom"
import { useConnection } from "../../context/Connection"
import { useAuthentication } from "../../context/Authentication"

export type Game = {
	id: string,
	timeBonus: number,
	timeControl: number,
}

export default function Home() {
	const { theme } = useTheme()
	const navigate = useNavigate()
	const { user } = useAuthentication()
	// List of all availible games.
	const [games, setGames] = useState<Game[]>([])
	const { socket, messageQueue, setMessageQueue } = useConnection()
	const [clientsCounter, setClientsCounter] = useState<number>(0)

	useEffect(() => {
		socket?.sendGetAvailibleGames()
	}, [])

	useEffect(() => {
		if (messageQueue.length == 0) { return }

		const [msg, ...remaining] = messageQueue
		switch (msg.type) {
			case MessageType.CLIENTS_COUNTER:
				setClientsCounter(msg.payload)
				break

			case MessageType.ADD_GAME:
				if (msg.payload.id == user.id) {
					navigate(`/${msg.payload.id}`)
					removeGame(msg.payload.id)
				}

				setGames(prevGames => {
					// Do not add game duplicates.
					if (prevGames.some(r => r.id === msg.payload.id)) {
						return prevGames
					}
					return [...prevGames, msg.payload]
				})
				break

			case MessageType.REMOVE_GAME:
				removeGame(msg.payload)
				break

			default: return
		}
		// Remove the processed message from the queue.
		setMessageQueue(remaining)
	}, [messageQueue])

	function removeGame(id: string) {
		setGames((prevGames) => prevGames.filter(game =>
			game.id !== id
		))
	}

	return socket && (
		<div className="main-container" data-theme={theme}>
			<Header />

			<div className="home-container">
				<div className="table">
					<div className="caption">Availible games</div>

					<div className="table-header">
						<div className="col">
							Control
						</div>
						<div className="col">
							Bonus
						</div>
					</div>

					<div className="table-body">
						{games.map((game, index) =>
							<div
								className="row"
								onClick={() => {
									removeGame(game.id)
									navigate(`/${game.id}`)
								}}
								key={index}
							>
								<div className="col">
									{game.timeControl}
								</div>

								<div className="col">
									{game.timeBonus}
								</div>
							</div>)}
					</div>
				</div>

				<div className="buttons-section">
					<button
						onClick={() => {
							socket.sendCreateGame(10, 10)
						}}
					>
						CREATE A NEW GAME
					</button>

					<button
						onClick={() => { }}
					>
						PLAY WITH THE COMPUTER
					</button>
				</div>
			</div>

			<div className="footer">
				<div className="clients-counter">
					Online: {clientsCounter}
				</div>
			</div>
		</div >
	)
}