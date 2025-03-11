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

export function fromUCI(uci: string, legalMoves: LegalMove[]): LegalMove | undefined {
	const from = uci.substring(0, 2)
	const to = uci.substring(2, 4)

	for (const move of legalMoves) {
		if (squareToNumber(from) == move.s && squareToNumber(to) == move.d) {
			return move
		}
	}
}

// Examples: e2 - 12; b6 - 41.
function squareToNumber(square: string): number {
	const file = square[0]
	const rank = parseInt(square[1]) - 1

	switch (file) {
		case "a":
			return 8 * rank

		case "b":
			return 8 * rank + 1

		case "c":
			return 8 * rank + 2

		case "d":
			return 8 * rank + 3

		case "e":
			return 8 * rank + 4

		case "f":
			return 8 * rank + 5

		case "g":
			return 8 * rank + 6

		default:
			return 8 * rank + 7
	}
}