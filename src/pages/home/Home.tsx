import "./Home.css"
import _WebSocket from "../../ws/ws"
import { useEffect, useState } from "react"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"
import { Message, MessageType } from "../../ws/message"
import { useAuthentication } from "../../context/Authentication"
import { useNavigate } from "react-router-dom"
import Dialog from "../../components/dialog/Dialog"
import Slider from "../../components/slider/Slider"

export type Room = {
	id: string,
	b: number,
	c: number,
}

export default function Home() {
	const { theme } = useTheme()
	const { user, accessToken } = useAuthentication()
	const navigate = useNavigate()
	const [socket, setSocket] = useState<_WebSocket | null>(null)
	const [isDialogActive, setIsDialogActive] = useState<boolean>(false)

	const [rooms, setRooms] = useState<Room[]>([])
	const [timeControl, setTimeControl] = useState<number>(10)
	const [timeBonus, setTimeBonus] = useState<number>(10)
	const [clientsCounter, setClientsCounter] = useState<number>(0)

	useEffect(() => {
		const s = new _WebSocket("/hub?", accessToken)

		// Recieve and store the messages from the server.
		s.socket.onmessage = (raw) => {
			const msg = JSON.parse(raw.data)
			handleMessage(msg as Message)
		}

		s.socket.onclose = () => {
			setSocket(null)
		}

		s.socket.onopen = () => {
			setSocket(s)
		}

		return () => s.close()
	}, [])

	function handleMessage(msg: Message) {
		switch (msg.t) {
			case MessageType.CLIENTS_COUNTER:
				setClientsCounter(msg.d.c)
				break

			case MessageType.ADD_ROOM:
				if (msg.d.id == user.id) {
					navigate(`/${user.id}`)
					return
				}

				setRooms(prevRooms => {
					// Do not add duplicates.
					if (prevRooms.some(room => room.id === msg.d.id)) {
						return prevRooms
					}
					return [...prevRooms, msg.d]
				})
				break

			case MessageType.REMOVE_ROOM:
				setRooms(prevRooms => prevRooms.filter(room =>
					room.id !== msg.d.id
				))
				break
		}
	}

	if (isDialogActive) {
		return (
			<div className="main-container" data-theme={theme}>
				<Dialog onClick={() => setIsDialogActive(false)}>
					<>
						<Slider
							min={1}
							max={180}
							value={timeControl}
							setValue={setTimeControl}
							text="Time control in minutes:"
						/>
						<Slider
							min={1}
							max={180}
							value={timeBonus}
							setValue={setTimeBonus}
							text="Time bonus in seconds:"
						/>
						<button onClick={() => socket?.sendCreateRoom(timeControl, timeBonus)}>
							Create
						</button>
					</>
				</Dialog>
			</div>
		)
	}

	return (
		<div className="main-container" data-theme={theme}>
			<Header />

			<div className="home-container">
				<div className="table">
					<div className="caption">Active games</div>

					<div className="table-header">
						<div className="col">
							Creator
						</div>
						<div className="col">
							Control
						</div>
						<div className="col">
							Bonus
						</div>
					</div>

					<div className="table-body">
						{rooms.map((room, index) => (
							<div
								className="row"
								key={index}
								onClick={() => {
									navigate(`/${room.id}`)
								}}
							>
								<div className="col">
									{room.id}
								</div>
								<div className="col">
									{room.c}
								</div>
								<div className="col">
									{room.b}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="buttons-section">
					<button onClick={() => setIsDialogActive(true)}>
						CREATE A NEW GAME
					</button>

					<button onClick={() => setIsDialogActive(true)}>
						PLAY WITH THE COMPUTER
					</button>
				</div>
			</div>

			<div className="clients-counter">
				Players in lobby: {clientsCounter}
			</div>
		</div >
	)
}