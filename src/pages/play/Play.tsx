import "./App.css"
import _WebSocket from "../../ws/ws"
import { useTheme } from "../../context/Theme"
import { useEffect, useState } from "react"
import Message, { MessageType } from "../../ws/msg"
import { useAuthentication } from "../../context/Authentication"
import { CompletedMove, LegalMove, MoveType } from "../../game/move"
import Header from "../../components/header/Header"
import Board from "../../components/board/Board"
import { Status } from "../../game/enums"

export default function App() {
	const { theme } = useTheme()
	const { accessToken } = useAuthentication()
	const [socket, setSocket] = useState<_WebSocket | null>(null)

	const [whiteId, setWhiteId] = useState<string>("")
	const [blackId, setBlackId] = useState<string>("")
	const [moves, setMoves] = useState<CompletedMove[]>([])
	const [status, setStatus] = useState<Status>(Status.ABANDONED)
	const [currentFEN, setCurrentFEN] = useState<string>("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
	// Default legal moves.
	const [legalMoves, setLegalMoves] = useState<LegalMove[]>([
		new LegalMove(16, 8, MoveType.Quiet),
		new LegalMove(24, 8, MoveType.DoublePawnPush),
		new LegalMove(17, 9, MoveType.Quiet),
		new LegalMove(25, 9, MoveType.DoublePawnPush),
		new LegalMove(18, 10, MoveType.Quiet),
		new LegalMove(26, 10, MoveType.DoublePawnPush),
		new LegalMove(19, 11, MoveType.Quiet),
		new LegalMove(27, 11, MoveType.DoublePawnPush),
		new LegalMove(20, 12, MoveType.Quiet),
		new LegalMove(28, 12, MoveType.DoublePawnPush),
		new LegalMove(21, 13, MoveType.Quiet),
		new LegalMove(29, 13, MoveType.DoublePawnPush),
		new LegalMove(22, 14, MoveType.Quiet),
		new LegalMove(30, 14, MoveType.DoublePawnPush),
		new LegalMove(23, 15, MoveType.Quiet),
		new LegalMove(31, 15, MoveType.DoublePawnPush),
		new LegalMove(16, 1, MoveType.Quiet),
		new LegalMove(18, 1, MoveType.Quiet),
		new LegalMove(21, 6, MoveType.Quiet),
		new LegalMove(23, 6, MoveType.Quiet),
	])


	useEffect(() => {
		const s = new _WebSocket(accessToken as string)

		// Recieve and store the messages from the server.
		s.socket.onmessage = (data) => {
			const msg = new Message(new Uint8Array(data.data))
			handleMessage(msg)
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
		switch (msg.type) {
			case MessageType.ROOM_INFO:
				setStatus(msg.payload.status)
				if (msg.payload.status == Status.IN_PROGRESS) {
					setWhiteId(msg.payload.whiteId)
					setBlackId(msg.payload.blackId)
				}
				break

			case MessageType.LAST_MOVE:
				setMoves(prevMoves => [...prevMoves, new CompletedMove(msg.payload.san, msg.payload.fen)])
				setCurrentFEN(msg.payload.fen)
				setLegalMoves(msg.payload.legalMoves)
				break

			case MessageType.GAME:
				setMoves(msg.payload.moves)
				setLegalMoves(msg.payload.legalMoves)
				setCurrentFEN(msg.payload.moves[msg.payload.moves.length - 1].fen)
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
				white: moves[i].san,
				black: moves[i + 1] ? moves[i + 1].san : "",
			})
		}
		return pairs
	}

	return socket && (
		<div className="main-container" data-theme={theme}>

			<div>
				WhiteId: {whiteId}
				BlackId: {blackId}
				Status: {status}
			</div>

			<Header />

			<div className="play-container">
				<Board
					fen={currentFEN}
					legalMoves={legalMoves}
					onMove={(move: LegalMove) => {
						socket.sendMakeMove(move)
					}}
				/>

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
						{formatFullmovePairs(moves).map((fullmove, index) =>
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

			<div className="footer">
				Copyright 2024-2025 Artem Bielikov. All rights reserved.
			</div>
		</div >
	)
}