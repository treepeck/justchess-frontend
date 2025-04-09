import "./Play.css"

import _WebSocket from "../../ws/ws"
import { Message, MessageType } from "../../ws/message"

import { useEffect, useRef, useReducer } from "react"
import { reducer, init, Action } from "./play.reducer"

import { useAuth } from "../../context/Auth"
import { useTheme } from "../../context/Theme"

import { LegalMove } from "../../game/move"
import { Status, formatWinner, formatResult } from "../../game/enums"

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

const roomId = window.location.pathname.substring(1)

export default function Play() {
	const { theme } = useTheme()!
	const { player, accessToken } = useAuth()!
	const engine = useRef<Worker | null>(null)

	const [state, dispatch] = useReducer(reducer, init)

	useEffect(() => {
		const s = new _WebSocket(`/room?id=${roomId}&`, accessToken)

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

	function getActivePlayerId(): string | undefined {
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
		<main data-theme={theme}>
			<Header />

			<div className="play-container">
				<div className={`board-container ${player.id == state.roomStatus.white
					? "white" : "blackL"}`}>
					<div className="row">
						<Miniprofile
							id={state.roomStatus.black}
						/>
						<Clock
							time={state.blackTime}
							color={"black"}
							dispatch={dispatch}
							isActive={state.roomStatus.black == getActivePlayerId()}
						/>
					</div>
					<Board
						fen={state.game.currentFEN}
						side={player.id == state.roomStatus.white ? 0 : 1}
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
							isActive={state.roomStatus.white == getActivePlayerId()}
						/>
					</div>
				</div>

				<div className="moves-container">
					{/* <Table
						caption="Completed moves"
						headerCols={["#", "White", "Black"]}
						bodyRows={formatFullmovePairs()}
						bodyOnClick={() => { }}
					/> */}

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

			{state.roomStatus.status == Status.OPEN
			}

			{/* {state.isDialogActive && (
				<Dialog caption="Game over" onClick={() => dispatch({
					type: Action.TOGGLE_DIALOG,
					payload: false
				})}>
					<>
						<p className="winner">
							{formatWinner(state.winner)}
						</p>
						<p className="result">
							{formatResult(state.result)}
						</p>
						<Button
							text="Home page"
							onClick={() => window.location.replace("/")}
						/>
					</>
				</Dialog>
			)} */}

			{/* Spawn engine worker. */}
			{state.roomStatus.isVSEngine && (
				<Engine
					socket={state.socket!}
					engine={engine}
					currentFEN={state.game.currentFEN}
					legalMoves={state.game.legalMoves}
					isTurn={getActivePlayerId() != player.id}
				/>
			)}
		</main>
	)
}