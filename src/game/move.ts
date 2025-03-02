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
	// Clock value.
	timeLeft: number

	constructor(san: string, fen: string, timeLeft: number) {
		this.san = san
		this.fen = fen
		this.timeLeft = timeLeft
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