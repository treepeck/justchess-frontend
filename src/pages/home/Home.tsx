import "./Home.css"
import { useEffect, useState } from "react"
import { useTheme } from "../../context/Theme"
import { useNavigate } from "react-router-dom"
import { MessageType } from "../../ws/msg"
import Header from "../../components/header/Header"
import { useConnection } from "../../context/Connection"

export type Room = {
	id: string,
	timeBonus: number,
	timeControl: number,
}

export default function Home() {
	const { theme } = useTheme()
	const { socket, messageQueue, setMessageQueue } = useConnection()
	if (!socket) { return <p></p> }
	const [rooms, setRooms] = useState<Room[]>([])
	const [clientsCounter, setClientsCounter] = useState<number>(0)

	const navigate = useNavigate()

	useEffect(() => {
		if (messageQueue.length == 0) { return }

		const [msg, ...remaining] = messageQueue
		switch (msg.type) {
			case MessageType.CLIENTS_COUNTER:
				setClientsCounter(msg.payload)
				break

			case MessageType.ADD_ROOM:
				setRooms(prevRooms => {
					// Do not add room duplicates.
					if (prevRooms.some(r => r.id === msg.payload.id)) {
						return prevRooms
					}
					return [...prevRooms, msg.payload]
				})
				break

			case MessageType.REMOVE_ROOM:
				removeRoom(msg.payload)
				break

			case MessageType.GAME_INFO:
				navigate(`/${msg.payload.roomId}`)
				break
		}
		// Remove the processed message from the queue.
		setMessageQueue(remaining)
	}, [messageQueue])

	function removeRoom(id: string) {
		setRooms((prevRooms) => prevRooms.filter(room =>
			room.id !== id
		))
	}

	return (
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
						{rooms.map((room, index) =>
							<div
								className="row"
								onClick={() => {
									socket.sendJoinRoom(room.id)
									removeRoom(room.id)
								}}
								key={index}
							>
								<div className="col">
									{room.timeControl}
								</div>

								<div className="col">
									{room.timeBonus}
								</div>
							</div>)}
					</div>
				</div>

				<div className="buttons-section">
					<button
						onClick={() => {
							socket.sendCreateRoom(10, 10)

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