// Styling.
import "./Play.css"

// Connection with the server.
import _WebSocket from "../../ws/ws"
import { Message, MessageType } from "../../ws/message"

// React stuff.
import { useEffect, useRef, useReducer } from "react"
import { reducer, init, Action } from "./play.reducer"

// Hooks.
import { useTheme } from "../../context/Theme"
import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../../context/Authentication"

// Game "logic".
import { LegalMove } from "../../game/move"
import { Result, Status, Winner } from "../../game/enums"

// Components.
import Chat from "../../components/chat/Chat"
import Table from "../../components/table/Table"
import Clock from "../../components/clock/Clock"
import Board from "../../components/board/Board"
import Header from "../../components/header/Header"
import Dialog from "../../components/dialog/Dialog"
import Button from "../../components/button/Button"
import Engine from "../../components/engine/Engine"
import Miniprofile from "../../components/miniprofile/Miniprofile"
import { PieceType } from "../../game/pieceType"

export default function Play() {
	const { theme } = useTheme()
	const navigate = useNavigate()
	const engine = useRef<Worker | null>(null)
	const { user, accessToken } = useAuthentication()

	const [state, dispatch] = useReducer(reducer, init)

	useEffect(() => {
		const id = window.location.href.substring(22)
		const s = new _WebSocket(`/room?id=${id}&`, accessToken)

		// Recieve and store the messages from the server.
		s.socket.onmessage = (raw) => {
			const msg = JSON.parse(raw.data)
			handleMessage(msg as Message)
		}

		s.socket.onopen = () => dispatch({ type: Action.SET_SOCKET, payload: s })

		s.socket.onclose = () => dispatch({ type: Action.SET_SOCKET, payload: null })

		return () => s.close()
	}, [])

	function handleMessage(msg: Message) {
		switch (msg.t) {
			case MessageType.ROOM_STATUS:
				dispatch({ type: Action.SET_ROOM_STATUS, payload: msg.d })
				break

			case MessageType.LAST_MOVE:
				dispatch({ type: Action.SET_GAME, payload: msg.d })
				break

			case MessageType.GAME_RESULT:
				dispatch({ type: Action.SET_RESULT, payload: msg.d })
				break

			case MessageType.CHAT:
				dispatch({ type: Action.ADD_CHAT, payload: msg.d })
				break
		}
	}

	function formatResult(): string {
		switch (state.result) {
			case Result.Checkmate: return "by checkmate"
			case Result.Timeout: return "by timeout"
			case Result.Stalemate: return "by stalemate"
			case Result.InsufficientMaterial: return "by insufficient material"
			case Result.FiftyMoves: return "by fifty moves rule"
			case Result.Repetition: return "by threefold repetition"
			case Result.Resignation: return "by resignation"
			default: return "by unknown reason"
		}
	}

	function formatWinner(): string {
		switch (state.winner) {
			case Winner.White:
				return "White won"

			case Winner.Black:
				return "Black won"

			default: return "Draw"
		}
	}

	function formatFullmovePairs(): {
		index: number,
		white: string,
		black: string
	}[] {
		const pairs: any = []
		let cnt = 1
		for (let i = 0; i < state.game.moves.length; i += 2) {
			pairs.push({
				index: cnt,
				white: state.game.moves[i].s,
				black: state.game.moves[i + 1] ? state.game.moves[i + 1].s : "",
			})
			cnt++
		}
		return pairs
	}

	function getActivePlayerName(): string | undefined {
		if (state.roomStatus.status == Status.OPEN ||
			state.roomStatus.status == Status.OVER) {
			return undefined
		}

		if ((state.game.moves.length + 1) % 2 == 0) {
			return state.roomStatus.black
		}
		return state.roomStatus.white
	}

	// If both kings are not in check.
	function getCheckedKing(): number {
		const lastMove = state.game.moves[state.game.moves.length - 1]
		if (lastMove?.s.includes("#") || lastMove?.s.includes("+")) {
			return (state.game.moves.length + 1) % 2 == 0 ? PieceType.BlackKing : PieceType.WhiteKing
		}
		return -1
	}

	return (
		<div className="main-container" data-theme={theme}>
			<Header />

			<div className="play-container">
				<div className={`board-container ${user.username == state.roomStatus.white
					? "white" : "blackL"}`}>
					<div className="row">
						<Miniprofile
							id={state.roomStatus.black}
						/>
						<Clock
							time={state.blackTime}
							color={"black"}
							dispatch={dispatch}
							isActive={state.roomStatus.black == getActivePlayerName()}
						/>
					</div>
					<Board
						fen={state.game.currentFEN}
						side={user.username == state.roomStatus.white ? 0 : 1}
						legalMoves={state.game.legalMoves}
						onMove={(m: LegalMove) => {
							state.socket!.sendMakeMove(m)
						}}
						checked={getCheckedKing()}
					/>
					<div className="row">
						<Miniprofile
							id={state.roomStatus.white}
						/>
						<Clock
							time={state.whiteTime}
							color={"white"}
							dispatch={dispatch}
							isActive={state.roomStatus.white == getActivePlayerName()}
						/>
					</div>
				</div>

				<div className="moves-container">
					<Table
						caption="Completed moves"
						headerCols={["#", "White", "Black"]}
						bodyRows={formatFullmovePairs()}
						bodyOnClick={() => { }}
					/>

					{<Button
						text="Resign"
						onClick={() => {
							if (state.roomStatus.status != Status.OVER &&
								state.roomStatus.status != Status.OPEN
							) {
								state.socket?.sendResign()
							}
						}}
					/>}
				</div>

				{!state.roomStatus.isVSEngine && (<Chat
					socket={state.socket!}
					chat={state.chat}
				/>)}
			</div>

			<div className="clients-counter">
				Players in room: {state.roomStatus.clients}
			</div>

			{state.roomStatus.status == Status.OPEN && (
				<Dialog caption="Waiting for the second player" onClick={() => { }}
				>
					<div className="dots">
						<div className="loading-dot" />
						<div className="loading-dot" />
						<div className="loading-dot" />
					</div>
				</Dialog>
			)}

			{state.isDialogActive && (
				<Dialog caption="Game over" onClick={() => dispatch({
					type: Action.TOGGLE_DIALOG,
					payload: false
				})}>
					<>
						<div className="winner">
							{formatWinner()}
						</div>
						<div className="result">
							{formatResult()}
						</div>
						<Button
							text="Home page"
							onClick={() => navigate("/")}
						/>
					</>
				</Dialog>
			)}

			{/* Spawn engine worker. */}
			{state.roomStatus.isVSEngine && (
				<Engine
					socket={state.socket!}
					engine={engine}
					currentFEN={state.game.currentFEN}
					legalMoves={state.game.legalMoves}
					isTurn={getActivePlayerName() != user.username}
				/>
			)}
		</div >
	)
}