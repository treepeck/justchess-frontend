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
				setRooms((prevRooms) => prevRooms.filter(room =>
					room.id !== msg.payload
				))
				break

			case MessageType.REDIRECT:
				navigate(`/play/${msg.payload}`)
				break
		}
		// Remove the processed message from the queue.
		setMessageQueue(remaining)
	}, [messageQueue])

	return (
		<div className="main-container" data-theme={theme}>
			<Header />
			<div className="clients-counter">
				Online: {clientsCounter}
			</div>

			<table className="rooms">
				<thead>
					<tr className="rooms-header">
						<th>Time control</th>
						<th>Time bonus</th>
					</tr>
				</thead>
				<tbody>
					{rooms.map((room, index) =>
						<tr
							key={index}
							className="rooms-data-row"
							onClick={(e) => {
								socket.sendJoinRoom(room.id)
							}}
						>
							<td>{room.timeControl}</td>
							<td>{room.timeBonus}</td>
						</tr>
					)}
				</tbody>
			</table>

			<button onClick={() => socket.sendCreateRoom(10, 10)}>
				Create a new game
			</button>
		</div>
	)
}