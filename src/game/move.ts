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
	s: string
	// Forsyth-Edwards Notation after completing the move.
	f: string
	// Clock value.
	t: number
	// Legal moves for the next player.  
	l: LegalMove[]

	constructor(s: string, f: string, t: number, l: LegalMove[]) {
		this.s = s
		this.f = f
		this.t = t
		this.l = l
	}
}

export class LegalMove {
	d: number // To.
	s: number // From.
	t: MoveType // Type.

	constructor(d: number, s: number, t: MoveType) {
		this.d = d
		this.s = s
		this.t = t
	}
}