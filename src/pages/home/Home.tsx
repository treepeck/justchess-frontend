import "./Home.css"
import _WebSocket from "../../ws/ws"
import { useEffect, useState } from "react"
import { useTheme } from "../../context/Theme"
import { useNavigate } from "react-router-dom"
import Dialog from "../../components/dialog/Dialog"
import Slider from "../../components/slider/Slider"
import Header from "../../components/header/Header"
import { Message, MessageType } from "../../ws/message"
import { useAuthentication } from "../../context/Authentication"
import Table from "../../components/table/Table"
import RadioButtons from "../../components/radio-buttons/RadioButtons"
import Button from "../../components/button/Button"
import { useEngineConf } from "../../context/EngineConf"

export type Room = {
	id: string,
	b: number, // Time bonus.
	c: number, // Time control.
}

export default function Home() {
	const { theme } = useTheme()
	const { user, accessToken } = useAuthentication()
	const { threads, hashSize, difficulty, setThreads, setHashSize, setDifficulty } = useEngineConf()

	const navigate = useNavigate()
	const [socket, setSocket] = useState<_WebSocket | null>(null)
	const [isDialogActive, setIsDialogActive] = useState<boolean>(false)

	const [rooms, setRooms] = useState<Room[]>([])
	const [opponent, setOpponent] = useState<string>("User")
	const [timeBonus, setTimeBonus] = useState<number>(10)
	const [timeControl, setTimeControl] = useState<number>(10)
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

	return (
		<div className="main-container" data-theme={theme}>
			<Header />

			<Table
				caption="Active games"
				headerCols={["Creator", "Control", "Bonus"]}
				bodyRows={rooms}
				bodyOnClick={(e) => {
					const id = e.currentTarget.dataset.row
					navigate(`/${id}`)
				}}
			/>

			<Button
				text="CREATE A NEW GAME"
				onClick={() => setIsDialogActive(true)}
			/>

			<div className="clients-counter">
				Players in lobby: {clientsCounter}
			</div>

			{isDialogActive && (
				<Dialog caption="Create a game" onClick={() => { setIsDialogActive(false) }}>
					<>
						<RadioButtons
							caption="Choose an opponent: "
							options={["User", "Computer"]}
							value={opponent}
							setValue={setOpponent}
						/>
						<Slider
							value={timeControl}
							setValue={setTimeControl}
							min={1}
							max={180}
							text="Time control in minutes: "
						/>
						<Slider
							value={timeBonus}
							setValue={setTimeBonus}
							min={0}
							max={180}
							text="Time bonus in seconds: "
						/>
						{opponent == "Computer" && (
							<div className="engine-params">
								<p>Engine: Stockfish 16</p>
								<Slider
									value={threads}
									setValue={setThreads}
									min={1}
									max={navigator.hardwareConcurrency / 2}
									text="The number of CPU threads used for searching: "
								/>
								<RadioButtons
									caption="The size of the hash table in MB: "
									options={["32", "64", "128", "512"]}
									value={hashSize}
									setValue={setHashSize}
								/>
								<Slider
									value={difficulty}
									setValue={setDifficulty}
									min={1}
									max={20}
									text="Difficulty level:"
								/>
							</div>
						)}
						<Button
							text="Start"
							onClick={() => {
								socket!.sendCreateRoom(opponent == "Computer", timeControl, timeBonus)
							}}
						/>
					</>
				</Dialog>
			)}
		</div>
	)
}