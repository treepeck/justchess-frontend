import { PieceType } from "./pieceType"

export function parseFEN(fen: string): PieceType[] {
	const rows = fen.split(" ")[0].split("/")
	const _board: PieceType[] = new Array(64)

	const mapping = new Map<string, PieceType>()
	mapping.set("P", PieceType.WhitePawn)
	mapping.set("p", PieceType.BlackPawn)
	mapping.set("N", PieceType.WhiteKnight)
	mapping.set("n", PieceType.BlackKnight)
	mapping.set("B", PieceType.WhiteBishop)
	mapping.set("b", PieceType.BlackBishop)
	mapping.set("R", PieceType.WhiteRook)
	mapping.set("r", PieceType.BlackRook)
	mapping.set("Q", PieceType.WhiteQueen)
	mapping.set("q", PieceType.BlackQueen)
	mapping.set("K", PieceType.WhiteKing)
	mapping.set("k", PieceType.BlackKing)

	let sqInd = 0
	for (let i = 7; i >= 0; i--) {
		for (let j = 0; j < rows[i].length; j++) {
			let next = mapping.get(rows[i][j])
			if (next !== undefined) {
				_board[sqInd] = next
				sqInd++
			} else {
				let emptySq = parseInt(rows[i][j])
				// Fill empty squares.
				for (let k = sqInd; k <= sqInd + emptySq; k++) {
					_board[k] = PieceType.NoPiece
				}
				sqInd += emptySq
			}
		}
	}
	return _board
}

export function piece2ASCII(pt: PieceType): string {
	switch (pt) {
		case PieceType.WhitePawn: return "♙"
		case PieceType.BlackPawn: return "♟"
		case PieceType.WhiteKnight: return "♘"
		case PieceType.BlackKnight: return "♞"
		case PieceType.WhiteBishop: return "♗"
		case PieceType.BlackBishop: return "♝"
		case PieceType.WhiteRook: return "♖"
		case PieceType.BlackRook: return "♜"
		case PieceType.WhiteQueen: return "♕"
		case PieceType.BlackQueen: return "♛"
		case PieceType.WhiteKing: return "♔"
		case PieceType.BlackKing: return "♚"
		default: return ""
	}
}