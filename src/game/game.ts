import { CompletedMove, LegalMove, MoveType } from "./move"

export default class Game {
	moves: CompletedMove[]
	currentFEN: string
	legalMoves: LegalMove[]

	// Initialized values by default.
	constructor() {
		this.moves = []

		// Default fen.
		this.currentFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

		// Moves for a default position.
		this.legalMoves = [
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
		]
	}
}