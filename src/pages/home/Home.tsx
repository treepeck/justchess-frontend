import "./Home.css"
import { useEffect, useState } from "react"
import { useTheme } from "../../context/Theme"
import { useNavigate } from "react-router-dom"
import Message, { MessageType } from "../../ws/msg"
import Sidebar from "../../components/header/Header"
import { useConnection } from "../../context/Connection"

export type Room = {
	id: string,
	timeBonus: number,
	timeControl: number,
}

export default function Home() {
	const { theme } = useTheme()
	const { socket } = useConnection()
	const [rooms, setRooms] = useState<Room[]>([])
	const [clientsCounter, setClientsCounter] = useState<number>(0)

	const navigate = useNavigate()

	if (!socket) {
		return
	}

	useEffect(() => {
		// Get info about availible rooms.
		socket.sendGetRooms()
	}, [])

	// Recieve and process the messages from the server.
	socket.socket.onmessage = (data) => {
		const msg = new Message(new Uint8Array(data.data))
		switch (msg.type) {
			case MessageType.CLIENTS_COUNTER:
				setClientsCounter(msg.payload)
				break

			case MessageType.ADD_ROOM:
				for (const r of rooms) {
					// Do not add duplicates.
					if (r.id == msg.payload.id) {
						return
					}
				}
				setRooms(_rooms => [...rooms, msg.payload])
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
	}

	return (
		<div className="main-container" data-theme={theme}>
			<Sidebar />
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
								// @ts-ignore
								e.target.disable = true
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