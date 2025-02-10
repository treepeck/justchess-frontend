export enum MoveType {
	Quiet,
	DoublePawnPush,
	KingCastle,
	QueenCastle,
	Capture,
	EPCapture,
	KnightPromo,
	BishopPromo,
	RookPromo,
	QueenPromo,
	KnightPromoCapture,
	BishopPromoCapture,
	RookPromoCapture,
	QueenPromoCapture,
}

export class CompletedMove {
	// Standard Algebraic Notation.
	san: string
	// Forsyth-Edwards Notation after completing the move.
	fen: string

	constructor(san: string, fen: string) {
		this.san = san
		this.fen = fen
	}
}

export class LegalMove {
	to: number
	from: number
	type: MoveType

	constructor(to: number, from: number, type: MoveType) {
		this.to = to
		this.from = from
		this.type = type
	}
}