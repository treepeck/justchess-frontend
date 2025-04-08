import "./Home.css"

import _WebSocket from "../../ws/ws"
import { Role } from "../../http/http"
import { Message, MessageType } from "../../ws/message"

import { useEffect, useReducer } from "react"
import { reducer, Action, init } from "./home.reducer"

import { useAuth } from "../../context/Auth"
import { useTheme } from "../../context/Theme"
import { useEngineConf } from "../../context/EngineConf"

import Table from "../../components/table/Table"
import Dialog from "../../components/dialog/Dialog"
import Slider from "../../components/slider/Slider"
import Header from "../../components/header/Header"
import Button from "../../components/button/Button"
import RadioButtons from "../../components/radio-buttons/RadioButtons"

export default function Home() {
	const { theme } = useTheme()!
	const { player, accessToken } = useAuth()!
	const { threads, hashSize, difficulty, setThreads, setHashSize, setDifficulty } = useEngineConf()

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
				if (msg.d.cr == player.username) {
					window.location.replace(`/${msg.d.id}`)
				}

				dispatch({ type: Action.ADD_ROOM, payload: msg.d })
				break

			case MessageType.REMOVE_ROOM:
				dispatch({ type: Action.REMOVE_ROOM, payload: msg.d })
				break
		}
	}

	function handleCreateGame() {
		const isVsEngine = state.opponent == "Computer"
		console.log(isVsEngine, player)
		if (!isVsEngine && player.role == Role.Guest) {
			dispatch({ type: Action.SET_ERROR_MSG, payload: "Sign up to play against other users" })
			return
		}

		state.socket?.sendCreateRoom(isVsEngine, state.timeControl * 60, state.timeBonus)
	}

	return (
		<main data-theme={theme}>
			<Header />

			<Table
				caption="Active games"
				headerCols={["Creator", "Control", "Bonus"]}
				bodyRows={state.rooms.map((room) => {
					return {
						creator: room.cr, control: room.c, bonus: room.b
					}
				})}
				bodyOnClick={(e) => {
					if (player.role == Role.Guest) {
						dispatch({ type: Action.SET_ERROR_MSG, payload: "Sign up to play against other users" })
						return
					}

					const index = e.currentTarget.dataset.row!
					if (state.rooms[parseInt(index)]) {
						window.location.replace(`/${state.rooms[parseInt(index)].id}`)
					}
				}}
			/>

			<Button
				text="CREATE A GAME"
				onClick={() => dispatch({ type: Action.TOGGLE_DIALOG, payload: true })}
			/>

			<div className="clients-counter">
				Players in lobby: {state.clientsCounter}
			</div>

			{state.isDialogActive && <Dialog caption="Create a game" onClick={() =>
				dispatch({ type: Action.TOGGLE_DIALOG, payload: false })
			}>
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
						onClick={handleCreateGame}
					/>
				</>
			</Dialog>}

			{state.errorMsg != "" && <Dialog caption={state.errorMsg} onClick={() =>
				dispatch({ type: Action.SET_ERROR_MSG, payload: "" })
			}>
				<></>
			</Dialog>}
		</main>
	)
}