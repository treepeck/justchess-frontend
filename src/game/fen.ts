import { PieceType } from "./pieceType"

export function FEN2Board(fen: string): PieceType[] {
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

// parseActiveColor returns "w" for white or "b" for black.
export function parseActiveColor(FEN: string): string {
	const fields = FEN.split(" ")
	return fields[1]
}

export function piece2ClassName(pt: PieceType): string {
	switch (pt) {
		case PieceType.WhitePawn: return "white-pawn"
		case PieceType.BlackPawn: return "black-pawn"
		case PieceType.WhiteKnight: return "white-knight"
		case PieceType.BlackKnight: return "black-knight"
		case PieceType.WhiteBishop: return "white-bishop"
		case PieceType.BlackBishop: return "black-bishop"
		case PieceType.WhiteRook: return "white-rook"
		case PieceType.BlackRook: return "black-rook"
		case PieceType.WhiteQueen: return "white-queen"
		case PieceType.BlackQueen: return "black-queen"
		case PieceType.WhiteKing: return "white-king"
		case PieceType.BlackKing: return "black-king"
		default: return ""
	}
}