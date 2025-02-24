import "./Play.css"
import { useEffect, useState } from "react"
import Game from "../../game/game"
import { useTheme } from "../../context/Theme"
import Board from "../../components/board/Board"
import { MessageType } from "../../ws/msg"
import { CompletedMove, LegalMove, MoveType } from "../../game/move"
import Header from "../../components/header/Header"
import { Status } from "../../game/enums"
import _WebSocket from "../../ws/ws"
import { useConnection } from "../../context/Connection"

export default function Play() {
	const { theme } = useTheme()
	const { socket, messageQueue, setMessageQueue } = useConnection()

	useEffect(() => {
		if (socket == null) return

		socket.sendGetGame()

		return () => socket.sendLeaveGame()
	}, [])

	useEffect(() => {
		if (messageQueue.length == 0) { return }

		const [msg, ...remaining] = messageQueue
		switch (msg.type) {
			case MessageType.GAME_INFO:
				setGame(msg.payload)
				break

			case MessageType.LAST_MOVE:
				setMoves(_ => [...moves, { san: msg.payload.san, fen: msg.payload.fen }])
				setCurrentFEN(msg.payload.fen)
				setLegalMoves(msg.payload.legalMoves)
				break

			default: return
		}

		setMessageQueue(remaining)
	}, [messageQueue])

	const [game, setGame] = useState<Game | null>(null)
	const [currentFEN, setCurrentFEN] = useState<string>("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
	const [moves, setMoves] = useState<CompletedMove[]>([])
	const [legalMoves, setLegalMoves] = useState<LegalMove[]>([
		// Default legal moves.
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

	if (game == null) {
		return
	}

	return socket && (
		<div className="main-container" data-theme={theme}>
			<Header />

			<div className="play-container">
				<div className="game-info">
					<div>White player: {game.whiteId}</div>
					<div>Black player: {game.blackId}</div>
					<div>Game status: {game.status}</div>
				</div>

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