// Styling.
import "./Home.css"

// Connection with server.
import _WebSocket from "../../ws/ws"
import { Message, MessageType } from "../../ws/message"

// React stuff.
import { useEffect, useReducer } from "react"

// Contexts.
import { useTheme } from "../../context/Theme"
import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../../context/Authentication"

// Components.
import Table from "../../components/table/Table"
import Dialog from "../../components/dialog/Dialog"
import Slider from "../../components/slider/Slider"
import Header from "../../components/header/Header"
import Button from "../../components/button/Button"
import { useEngineConf } from "../../context/EngineConf"
import RadioButtons from "../../components/radio-buttons/RadioButtons"

type Room = {
	id: string,
	c: number, // Time control.
	b: number // Time bonus.
}

enum Action {
	SET_SOCKET,
	TOGGLE_DIALOG,
	ADD_ROOM,
	REMOVE_ROOM,
	SET_OPPONENT,
	SET_TIME_BONUS,
	SET_TIME_CONTROL,
	SET_CLIENTS_COUNTER,
}

type State = {
	socket: _WebSocket | null,
	isDialogActive: boolean,
	rooms: Room[],
	opponent: string,
	timeBonus: number,
	timeControl: number,
	clientsCounter: number
}

const init: State = {
	socket: null,
	isDialogActive: false,
	rooms: [],
	opponent: "User",
	timeBonus: 10,
	timeControl: 10,
	clientsCounter: 0,
}

interface IAction {
	type: Action,
	payload: any,
}

function reducer(state: State, action: IAction) {
	switch (action.type) {
		case Action.SET_SOCKET:
			return { ...state, socket: action.payload }

		case Action.TOGGLE_DIALOG:
			return { ...state, isDialogActive: action.payload }

		case Action.ADD_ROOM:
			return {
				...state,
				// Do not add duplicates.
				rooms: state.rooms.some(room => room.id === action.payload.id)
					? state.rooms
					: [...state.rooms, action.payload]
			}

		case Action.REMOVE_ROOM:
			return {
				...state,
				rooms: state.rooms.filter(room => room.id !== action.payload)
			}

		case Action.SET_OPPONENT:
			return { ...state, opponent: action.payload }

		case Action.SET_TIME_CONTROL:
			return { ...state, timeControl: action.payload }

		case Action.SET_TIME_BONUS:
			return { ...state, timeBonus: action.payload }

		case Action.SET_CLIENTS_COUNTER:
			return { ...state, clientsCounter: action.payload }
	}
}

export default function Home() {
	// Custom hooks.
	const { theme } = useTheme()
	const { user, accessToken } = useAuthentication()
	const { threads, hashSize, difficulty, setThreads, setHashSize, setDifficulty } = useEngineConf()

	// React-router hook.
	const navigate = useNavigate()

	// Reducer.
	const [state, dispatch] = useReducer(reducer, init)

	// Connect to the Hub on page load.
	useEffect(() => {
		const s = new _WebSocket("/hub?", accessToken)

		// Recieve and store the messages from the server.
		s.socket.onmessage = (raw) => {
			const msg = JSON.parse(raw.data)
			handleMessage(msg as Message)
		}

		s.socket.onopen = () => dispatch({ type: Action.SET_SOCKET, payload: s })

		s.socket.onclose = () => dispatch({ type: Action.SET_SOCKET, payload: null })

		return () => s.close()
	}, [])

	// Handle incomming messages from Hub.
	function handleMessage(msg: Message) {
		switch (msg.t) {
			case MessageType.CLIENTS_COUNTER:
				dispatch({ type: Action.SET_CLIENTS_COUNTER, payload: msg.d.c })
				break

			case MessageType.ADD_ROOM:
				if (msg.d.id == user.id) {
					navigate(`/${user.id}`)
					return
				}
				dispatch({ type: Action.ADD_ROOM, payload: msg.d })
				break

			case MessageType.REMOVE_ROOM:
				dispatch({ type: Action.REMOVE_ROOM, payload: msg.d })
				break
		}
	}

	return (
		<div className="main-container" data-theme={theme}>
			<Header />

			<Table
				caption="Active games"
				headerCols={["Creator", "Control", "Bonus"]}
				bodyRows={state.rooms}
				bodyOnClick={(e) => {
					const id = e.currentTarget.dataset.row
					navigate(`/${id}`)
				}}
			/>

			<Button
				text="CREATE A NEW GAME"
				onClick={() => dispatch({ type: Action.TOGGLE_DIALOG, payload: true })}
			/>

			<div className="clients-counter">
				Players in lobby: {state.clientsCounter}
			</div>

			{state.isDialogActive && (
				<Dialog caption="Create a game" onClick={() => dispatch({
					type: Action.TOGGLE_DIALOG, payload: false
				})}>
					<>
						<RadioButtons
							value={state.opponent}
							options={["User", "Computer"]}
							setValue={(val) => dispatch({ type: Action.SET_OPPONENT, payload: val })}
							caption="Choose an opponent: "
						/>
						<Slider
							value={state.timeControl}
							setValue={(val) => dispatch({ type: Action.SET_TIME_CONTROL, payload: val })}
							min={1}
							max={180}
							text="Time control in minutes: "
						/>
						<Slider
							value={state.timeBonus}
							setValue={(val) => dispatch({ type: Action.SET_TIME_BONUS, payload: val })}
							min={0}
							max={180}
							text="Time bonus in seconds: "
						/>
						{state.opponent == "Computer" && (
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
								state.socket?.sendCreateRoom(
									state.opponent == "Computer",
									state.timeControl,
									state.timeBonus
								)
							}}
						/>
					</>
				</Dialog>
			)}
		</div>
	)
}