import "./Play.css"
import Game from "../../game/game"
import _WebSocket from "../../ws/ws"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../context/Theme"
import Board from "../../components/board/Board"
import { Result, Status } from "../../game/enums"
import Header from "../../components/header/Header"
import Dialog from "../../components/dialog/Dialog"
import { Message, MessageType } from "../../ws/message"
import { CompletedMove, LegalMove } from "../../game/move"
import { useAuthentication } from "../../context/Authentication"
import Miniprofile from "../../components/miniprofile/Miniprofile"

type RoomStatus = {
	status: Status,
	whiteId: string,
	blackId: string,
	clients: number,
}

export default function Play() {
	const { theme } = useTheme()
	const navigate = useNavigate()
	const { accessToken } = useAuthentication()
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
		clients: 0
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
					clients: msg.d.c
				})
				setWhiteTime(msg.d.wt)
				setBlackTime(msg.d.bt)
				break

			case MessageType.LAST_MOVE:
				setGame(prevGame => {
					const newGame = new Game()
					if (prevGame.moves.length % 2 == 0) {
						setWhiteTime(msg.d.t)
					} else {
						setBlackTime(msg.d.t)
					}
					newGame.currentFEN = msg.d.f
					newGame.legalMoves = msg.d.l
					newGame.moves = [...prevGame.moves, msg.d]
					return newGame
				})
				break

			case MessageType.GAME_RESULT:
				setResult(msg.d.r)
				setIsDialogActive(true)
				break
		}
	}

	function formatFullmovePairs(moves: CompletedMove[]): {
		white: string,
		black: string
	}[] {
		const pairs: any = []
		for (let i = 0; i < moves.length; i += 2) {
			pairs.push({
				white: moves[i].s,
				black: moves[i + 1] ? moves[i + 1].s : "",
			})
		}
		return pairs
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

	function getActiveTimerColor(): string {
		if (status.status == Status.OPEN || status.status == Status.OVER) {
			return ""
		}

		if (game.moves.length % 2 == 0) {
			return "white"
		}
		return "black"
	}

	if (socket == null) { return }

	if (status.status == Status.OPEN) {
		return (
			<div className="main-container" data-theme={theme}>
				<div className="loader">
					<div className="loader-content">
						Waiting for the second player
						<div className="dots">
							<div className="loading-dot" />
							<div className="loading-dot" />
							<div className="loading-dot" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (isDialogActive) {
		return (
			<div className="main-container" data-theme={theme}>
				<Dialog onClick={() => setIsDialogActive(false)}>
					<>
						<div>
							{formatWinner()}
						</div>
						<div>
							{formatResult()}
						</div>
						<button onClick={() => navigate("/")}>
							Home page
						</button>
					</>
				</Dialog>
			</div>
		)
	}

	return (
		<div className="main-container" data-theme={theme}>
			<Header />
			<div className="play-container">

				<div className="board-container">
					<Miniprofile id={status.blackId} time={blackTime}
						setTime={setBlackTime} isActive={"black" == getActiveTimerColor()} />
					<Board
						fen={game.currentFEN}
						legalMoves={game.legalMoves}
						onMove={(move: LegalMove) => {
							socket.sendMakeMove(move)
						}}
					/>
					<Miniprofile id={status.whiteId} time={whiteTime}
						setTime={setWhiteTime} isActive={"white" == getActiveTimerColor()} />
				</div>

				<div className="table">
					<div className="caption">Completed moves</div>

					<div className="table-header">
						<div className="col">
							#
						</div>

						<div className="col">
							White
						</div>

						<div className="col">
							Black
						</div>
					</div>

					<div className="table-body">
						{formatFullmovePairs(game.moves).map((fullmove, index) =>
							<div
								className="row"
								// TODO: add move undo.
								onClick={() => { }}
								key={index}
							>
								<div className="col">
									{index + 1}
								</div>

								<div className="col">
									{fullmove.white}
								</div>

								<div className="col">
									{fullmove.black}
								</div>
							</div>)}
					</div>
				</div>
			</div>
		</div >
	)
}