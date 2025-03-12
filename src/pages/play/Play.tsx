import "./Play.css"
import Game from "../../game/game"
import _WebSocket from "../../ws/ws"
import { fromUCI, LegalMove } from "../../game/move"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../context/Theme"
import { Result, Status } from "../../game/enums"
import Header from "../../components/header/Header"
import Dialog from "../../components/dialog/Dialog"
import Clock from "../../components/clock/Clock"
import { Message, MessageType } from "../../ws/message"
import { useAuthentication } from "../../context/Authentication"
import Button from "../../components/button/Button"
import Miniprofile from "../../components/miniprofile/Miniprofile"
import Board from "../../components/board/Board"
import Table from "../../components/table/Table"
import Engine from "../../components/engine/Engine"
import Chat from "../../components/chat/Chat"

type RoomStatus = {
	status: Status,
	whiteId: string,
	blackId: string,
	clients: number,
	isVSEngine: boolean
}

export default function Play() {
	const { theme } = useTheme()
	const navigate = useNavigate()
	const { user, accessToken } = useAuthentication()
	const engine = useRef<Worker | null>(null)

	const [game, setGame] = useState<Game>(new Game())
	const [whiteTime, setWhiteTime] = useState<number>(0)
	const [blackTime, setBlackTime] = useState<number>(0)
	const [result, setResult] = useState<Result>(Result.Unknown)
	const [socket, setSocket] = useState<_WebSocket | null>(null)
	const [isDialogActive, setIsDialogActive] = useState<boolean>(false)
	const [status, setStatus] = useState<RoomStatus>({
		status: Status.OVER,
		whiteId: "",
		blackId: "",
		clients: 0,
		isVSEngine: false,
	})

	useEffect(() => {
		const id = window.location.href.substring(22)
		const s = new _WebSocket(`/room?id=${id}&`, accessToken)

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
			case MessageType.ROOM_STATUS:
				setStatus({
					status: msg.d.s,
					whiteId: msg.d.w,
					blackId: msg.d.b,
					clients: msg.d.c,
					isVSEngine: msg.d.e,
				})
				setWhiteTime(msg.d.wt)
				setBlackTime(msg.d.bt)
				break

			case MessageType.LAST_MOVE:
				setGame(prevGame => {
					const newGame = new Game()
					newGame.currentFEN = msg.d.f
					newGame.legalMoves = msg.d.l
					newGame.moves = [...prevGame.moves, msg.d]
					if ((newGame.moves.length) % 2 == 0) {
						setBlackTime(msg.d.t)
					} else {
						setWhiteTime(msg.d.t)
					}
					return newGame
				})
				break

			case MessageType.GAME_RESULT:
				setResult(msg.d.r)
				setIsDialogActive(true)
				break
		}
	}

	function formatResult(): string {
		switch (result) {
			case Result.Checkmate:
				return "by checkmate"

			case Result.Timeout:
				return "by timeout"

			case Result.Stalemate:
				return "by stalemate"

			case Result.InsufficientMaterial:
				return "by insufficient material"

			case Result.FiftyMoves:
				return "by fifty moves rule"

			case Result.Repetition:
				return "by threefold repetition"

			case Result.Agreement:
				return "by agreement"

			default:
				return "by unknown reason"
		}
	}

	function formatWinner(): string {
		switch (result) {
			case Result.Checkmate:
				if (game.moves.length % 2 == 0) {
					return "Black won"
				}
				return "White won"

			case Result.Timeout:
				if (game.moves.length % 2 == 0) {
					return "Black won"
				}
				return "White won"

			default:
				return "Draw"
		}
	}

	function formatFullmovePairs(): {
		index: number,
		white: string,
		black: string
	}[] {
		const pairs: any = []
		let cnt = 1
		for (let i = 0; i < game.moves.length; i += 2) {
			pairs.push({
				index: cnt,
				white: game.moves[i].s,
				black: game.moves[i + 1] ? game.moves[i + 1].s : "",
			})
			cnt++
		}
		return pairs
	}

	function getActiveId(): string {
		if (status.status == Status.OPEN || status.status == Status.OVER) {
			return ""
		}

		if ((game.moves.length + 1) % 2 == 0) {
			return status.blackId
		}
		return status.whiteId
	}

	return (
		<div className="main-container" data-theme={theme}>
			<Header />

			<div className="play-container">
				<div className="board-container">
					<div className="row">
						<Miniprofile
							id={status.isVSEngine ? user.id == status.blackId ? user.id : "Stockfish 16" : status.blackId}
						/>
						<Clock
							time={blackTime}
							setTime={setBlackTime}
							isActive={status.blackId == getActiveId()}
						/>
					</div>
					<Board
						fen={game.currentFEN}
						legalMoves={game.legalMoves}
						onMove={(m: LegalMove) => {
							socket!.sendMakeMove(m)
						}}
					/>
					<div className="row">
						<Miniprofile
							id={status.isVSEngine ? user.id == status.whiteId ? user.id : "Stockfish 16" : status.whiteId}
						/>
						<Clock
							time={whiteTime}
							setTime={setWhiteTime}
							isActive={status.whiteId == getActiveId()}
						/>
					</div>
				</div>

				<Table
					caption="Completed moves"
					headerCols={["#", "White", "Black"]}
					bodyRows={formatFullmovePairs()}
					bodyOnClick={() => { }}
				/>

				{!status.isVSEngine && (<Chat
					socket={socket!}
				/>)}
			</div>

			<div className="clients-counter">
				Players in room: {status.clients}
			</div>

			{status.status == Status.OPEN && (
				<Dialog caption="Waiting for the second player" onClick={() => { }}
				>
					<div className="dots">
						<div className="loading-dot" />
						<div className="loading-dot" />
						<div className="loading-dot" />
					</div>
				</Dialog>
			)}

			{isDialogActive && (
				<Dialog caption="Game over" onClick={() => setIsDialogActive(false)}>
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
			{status.isVSEngine && (
				<Engine
					socket={socket!}
					engine={engine}
					currentFEN={game.currentFEN}
					legalMoves={game.legalMoves}
					isTurn={getActiveId() != user.id}
				/>
			)}
		</div >
	)
}