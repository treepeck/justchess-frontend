import "./Play.css"
import { useEffect, useState } from "react"
import Game from "../../game/game"
import { useTheme } from "../../context/Theme"
import Board from "../../components/board/Board"
import { MessageType } from "../../ws/msg"
import { useConnection } from "../../context/Connection"
import { CompletedMove, LegalMove, MoveType } from "../../game/move"

export default function Play() {
	const { theme } = useTheme()

	const { socket, messageQueue, setMessageQueue } = useConnection()
	if (!socket) { return <p></p> }

	useEffect(() => {
		return () => socket.sendLeaveRoom()
	}, [])

	useEffect(() => {
		if (messageQueue.length == 0) { return }

		const [msg, ...remaining] = messageQueue
		switch (msg.type) {
			case MessageType.GAME_INFO:
				setGame(msg.payload)
				break

			case MessageType.LAST_MOVE:
				setMoves(_moves => [..._moves, { san: msg.payload.san, fen: msg.payload.fen }])
				setCurrentFEN(msg.payload.fen)
				setLegalMoves(msg.payload.legalMoves)
				break
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

	if (game == null) {
		return (
			<p>Waiting for the second player</p>
		)
	}

	return (
		<div className="main-container" data-theme={theme}>
			<div>White player: {game.whiteId}</div>
			<div>Black player: {game.blackId}</div>
			<div>Game result: {game.result}</div>
			<div>Time control: {game.timeControl}</div>
			<div>Time bonus: {game.timeBonus}</div>

			<Board fen={currentFEN} legalMoves={legalMoves}
				onMove={(move: LegalMove) => {
					socket.sendMove(move)
				}}
			/>

			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>White</th>
						<th>Black</th>
					</tr>
				</thead>
				<tbody>
					{moves.map((move, index) =>
						<tr
							key={index}
						>
							<td>{index + 1}</td>
							<td>{move.san}</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}