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

	constructor(encoded: number) {
		this.d = encoded & 0x3F
		this.s = encoded >> 6 & 0x3F
		this.t = encoded >> 12 & 0xF
	}

	static getDefault(): LegalMove[] {
		return [
			new LegalMove(16 | (8 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(24 | (8 << 6) | (MoveType.DoublePawnPush << 12)),
			new LegalMove(17 | (9 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(25 | (9 << 6) | (MoveType.DoublePawnPush << 12)),
			new LegalMove(18 | (10 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(26 | (10 << 6) | (MoveType.DoublePawnPush << 12)),
			new LegalMove(19 | (11 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(27 | (11 << 6) | (MoveType.DoublePawnPush << 12)),
			new LegalMove(20 | (12 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(28 | (12 << 6) | (MoveType.DoublePawnPush << 12)),
			new LegalMove(21 | (13 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(29 | (13 << 6) | (MoveType.DoublePawnPush << 12)),
			new LegalMove(22 | (14 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(30 | (14 << 6) | (MoveType.DoublePawnPush << 12)),
			new LegalMove(23 | (15 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(31 | (15 << 6) | (MoveType.DoublePawnPush << 12)),
			new LegalMove(16 | (1 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(18 | (1 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(21 | (6 << 6) | (MoveType.Quiet << 12)),
			new LegalMove(23 | (6 << 6) | (MoveType.Quiet << 12)),
		]
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
		case "a": return 8 * rank
		case "b": return 8 * rank + 1
		case "c": return 8 * rank + 2
		case "d": return 8 * rank + 3
		case "e": return 8 * rank + 4
		case "f": return 8 * rank + 5
		case "g": return 8 * rank + 6
		default: return 8 * rank + 7
	}
}