import "./Play.css"

import { useAuth } from "../../context/Auth"
import { useTheme } from "../../context/Theme"
import { useEffect, useReducer, useRef } from "react"
import { Action, init, reducer } from "./play.reducer"

import _WebSocket from "../../ws/ws"
import { LegalMove } from "../../game/move"
import { getGameById } from "../../http/http"
import { PieceType } from "../../game/pieceType"
import { Message, MessageType } from "../../ws/message"
import { Color, formatResult, formatWinner, Result, Status } from "../../game/enums"

import NotFound from "../not-found/NotFound"
import Chat from "../../components/chat/Chat"
import Table from "../../components/table/Table"
import Board from "../../components/board/Board"
import Clock from "../../components/clock/Clock"
import Engine from "../../components/engine/Engine"
import Header from "../../components/header/Header"
import Dialog from "../../components/dialog/Dialog"
import Button from "../../components/button/Button"
import Miniprofile from "../../components/miniprofile/Miniprofile"

const id = window.location.pathname.substring(1)

export default function Play() {
	const { theme } = useTheme()!
	const engine = useRef<Worker | null>(null)
	const { player, accessToken } = useAuth()!
	const scrollRef = useRef<HTMLDivElement>(null)
	const [state, dispatch] = useReducer(reducer, init)

	useEffect(() => {
		const s = new _WebSocket(`/room?id=${id}&`, accessToken)

		s.socket.onmessage = (raw) => {
			const msg = JSON.parse(raw.data)
			onMessage(msg as Message)
		}

		s.socket.onerror = async () => {
			// If the room wasn't found.
			const game = await getGameById(id, accessToken)
			dispatch({ type: Action.SET_IS_DONE_FETCHING, payload: true })

			if (!game) { return }

			dispatch({
				type: Action.SET_ROOM_STATE, payload: {
					s: Status.OVER,
					w: game.whiteId,
					b: game.blackId,
					c: 0, // Does not matter.
					e: false, // Does not matter.
					tc: game.timeControl,
					wt: game.timeControl,
					bt: game.timeControl,
				}
			})

			for (const m of game.moves) {
				dispatch({ type: Action.ADD_MOVE, payload: m })
			}

			dispatch({ type: Action.SET_ENDGAME_INFO, payload: { r: game.result, w: game.winner } })
		}

		s.socket.onopen = () => {
			dispatch({ type: Action.SET_IS_DONE_FETCHING, payload: true })
			dispatch({ type: Action.SET_SOCKET, payload: s })
		}

		window.addEventListener("keydown", onKeyDown)

		return () => {
			window.removeEventListener("keydown", onKeyDown)
			s.close()
		}
	}, [])

	function onMessage(msg: Message) {
		switch (msg.t) {
			case MessageType.ROOM_STATUS:
				dispatch({ type: Action.SET_ROOM_STATE, payload: msg.d })
				break

			case MessageType.LAST_MOVE:
				dispatch({ type: Action.ADD_MOVE, payload: msg.d })
				break

			case MessageType.GAME_RESULT:
				dispatch({ type: Action.SET_ENDGAME_INFO, payload: msg.d })
				break

			case MessageType.CHAT:
				dispatch({ type: Action.ADD_CHAT_MESSAGE, payload: msg.d })
				break

			case MessageType.DRAW_OFFER:
				dispatch({ type: Action.SET_IS_PENDING_DRAW_OFFER, payload: true })
				break
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		switch (e.code) {
			case "ArrowUp":
				dispatch({ type: Action.SET_CURRENT_MOVE_IND, payload: 0 })
				break

			case "ArrowRight":
				dispatch({ type: Action.INC_CURRENT_MOVE_IND, payload: null })
				break

			case "ArrowDown":
				dispatch({ type: Action.END_CURRENT_MOVE_IND, payload: null })
				break

			case "ArrowLeft":
				dispatch({ type: Action.DEC_CURRENT_MOVE_IND, payload: null })
				break
		}
	}

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
	}, [state.moves])

	function formatMovePairs(): {
		ind: number,
		whiteSAN: string,
		blackSAN: string
	}[] {
		const pairs = []

		let cnt = 1
		for (let i = 0; i < state.moves.length; i += 2) {
			pairs.push({
				ind: cnt,
				whiteSAN: state.moves[i].s,
				blackSAN: state.moves[i + 1]?.s ?? ""
			})
			cnt++
		}
		return pairs
	}

	function onMoveClick(ind: number) {
		if (!state.moves[ind]) return

		dispatch({ type: Action.SET_CURRENT_MOVE_IND, payload: ind })
	}

	function getCheckedKing(): PieceType {
		const move = state.moves[state.currentMoveInd]
		if (!move) return PieceType.NoPiece

		if (move.s.includes("#") || move.s.includes("+")) {
			return state.currentMoveInd % 2 == 0 ? PieceType.BlackKing : PieceType.WhiteKing
		}
		return PieceType.NoPiece
	}

	function getActiveId(): string | undefined {
		if (state.room.status == Status.OPEN ||
			state.room.status == Status.OVER ||
			state.result != Result.Unknown) {
			return undefined
		}

		if ((state.moves.length + 1) % 2 == 0) {
			return state.room.black
		}
		return state.room.white
	}

	if (!state.socket && state.result == Result.Unknown && state.isDoneFetching) {
		return <NotFound />
	}

	return <main data-theme={theme}>
		<Header />

		<div className="play-container">
			{!state.room.isVSEngine && state.socket && <Chat
				socket={state.socket}
				messages={state.chat}
			/>}

			<div className={`board-container ${player.id == state.room.black ? "black" : "white"}`}>
				<div className="row">
					<Miniprofile id={state.room.black} />

					<Clock
						time={state.blackTime}
						color={"black"}
						dispatch={dispatch}
						isActive={state.room.black == getActiveId()}
					/>
				</div>

				<Board
					fen={state.moves[state.currentMoveInd]?.f ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
					side={player.id === state.room.black ? Color.Black : Color.White}
					onMove={(m: LegalMove) => {
						state.socket?.sendMakeMove(m)
					}}
					checked={getCheckedKing()}
					legalMoves={state.legalMoves}
				/>

				<div className="row">
					<Miniprofile id={state.room.white} />

					<Clock
						time={state.whiteTime}
						color={"white"}
						dispatch={dispatch}
						isActive={state.room.white == getActiveId()}
					/>
				</div>
			</div>

			<div className="moves-container">
				<Table
					caption="Moves"
					headerCols={["#", "White", "Black"]}
				>
					<div className="t-body">
						{formatMovePairs().map((move, ind) => <div
							key={ind}
							className="row"
						>
							<div className="col">{move.ind}</div>

							<div className={"col" + (state.currentMoveInd == ind * 2 ? " current" : "")}
								onClick={() => onMoveClick(ind * 2)}
							>
								{move.whiteSAN}
							</div>

							<div className={"col" + (state.currentMoveInd == ind * 2 + 1 ? " current" : "")}
								onClick={() => onMoveClick(ind * 2 + 1)}
							>
								{move.blackSAN}
							</div>
						</div>)}

						<div ref={scrollRef} />
					</div>
				</Table>

				{/* If the game is in progess. */}
				{state.socket && state.result == Result.Unknown && state.moves.length > 1 &&
					<div className="controls-container">
						{/* Draw offer control. */}
						{state.isConfirmDrawOfferActive &&
							!state.isPendingDrawOffer && <div className="confirm-container">
								<Button
									text="Draw offer"
									isConfirm={true}
									onClick={() => {
										state.socket?.sendDrawOffer()
										dispatch({ type: Action.SET_CONFIRM_DRAW, payload: false })
									}}
								/>

								<Button
									text="Cancel"
									isCancel={true}
									onClick={() => dispatch({ type: Action.SET_CONFIRM_DRAW, payload: false })}
								/>
							</div>}
						{!state.room.isVSEngine && !state.isConfirmDrawOfferActive &&
							!state.isPendingDrawOffer && <Button
								text="Draw offer"
								onClick={() => {
									dispatch({ type: Action.SET_CONFIRM_DRAW, payload: true })
								}}
							/>}

						{/* Resign control. */}
						{state.isConfirmResignActive && !state.isPendingDrawOffer &&
							<div className="confirm-container">
								<Button
									text="Resign"
									isConfirm={true}
									onClick={() => {
										state.socket?.sendResign()
										dispatch({ type: Action.SET_CONFIRM_RESIGN, payload: false })
									}}
								/>

								<Button
									text="Cancel"
									isCancel={true}
									onClick={() => dispatch({ type: Action.SET_CONFIRM_RESIGN, payload: false })}
								/>
							</div>}
						{!state.isConfirmResignActive && !state.isPendingDrawOffer && <Button
							text="Resign"
							onClick={() => {
								dispatch({ type: Action.SET_CONFIRM_RESIGN, payload: true })
							}}
						/>}

						{/* Accept draw control. */}
						{state.isPendingDrawOffer && <div className="confirm-container">
							<Button
								text="Accept draw"
								isConfirm={true}
								onClick={() => {
									state.socket?.sendDrawOffer()
									dispatch({ type: Action.SET_IS_PENDING_DRAW_OFFER, payload: false })
								}}
							/>

							<Button
								text="Decline draw"
								isCancel={true}
								onClick={() => {
									state.socket?.sendDeclineDraw()
									dispatch({ type: Action.SET_IS_PENDING_DRAW_OFFER, payload: false })
								}}
							/>
						</div>}
					</div>}
			</div>

			{/* Spawn engine worker. */}
			{state.room.isVSEngine && state.socket && <Engine
				socket={state.socket}
				legalMoves={state.legalMoves}
				isTurn={getActiveId() != player.id}
				engine={engine}
				currentFEN={state.moves[state.moves.length - 1]?.f ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
			/>}
		</div>

		<Dialog
			isActive={state.room.status == Status.OPEN}
			onClose={() => { }}
			hasClose={false}
		>
			<h2>Waiting for the second player</h2>
			<div className="dots">
				<div className="loading-dot"></div>
				<div className="loading-dot"></div>
				<div className="loading-dot"></div>
			</div>
		</Dialog>

		<Dialog
			isActive={state.isDialogActive}
			onClose={() => dispatch({ type: Action.TOGGLE_DIALOG, payload: false })}
			hasClose={true}
		>
			<h2>Game over</h2>

			<p className="winner">{formatWinner(state.winner)}</p>

			<p className="result">{formatResult(state.result)}</p>

			<Button
				text="Home page"
				onClick={() => window.location.replace("/")}
			/>
		</Dialog>

		<Dialog
			isActive={!state.isDoneFetching}
			onClose={() => { }}
			hasClose={false}
		>
			<h2>Processing...</h2>
		</Dialog>

		{state.socket && !state.room.isVSEngine && <div className="clients-counter">Players: {state.room.clients}</div>}
	</main>
}