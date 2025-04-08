export enum Status {
	OPEN,
	IN_PROGRESS,
	WHITE_DISCONNECTED,
	BLACK_DISCONNECTED,
	OVER
}

export enum Result {
	Unknown,
	Checkmate,
	Timeout,
	Stalemate,
	InsufficientMaterial,
	FiftyMoves,
	Repetition,
	Resignation
}

export function formatResult(r: Result): string {
	switch (r) {
		case Result.Checkmate: return "by checkmate"
		case Result.Timeout: return "by timeout"
		case Result.Stalemate: return "by stalemate"
		case Result.InsufficientMaterial: return "by insufficient material"
		case Result.FiftyMoves: return "by fifty moves rule"
		case Result.Repetition: return "by threefold repetition"
		case Result.Resignation: return "by resignation"
		default: return "by unknown reason"
	}
}

export enum Color {
	White,
	Black,
	None
}

export function formatWinner(c: Color): string {
	switch (c) {
		case Color.White:
			return "White won"

		case Color.Black:
			return "Black won"

		default: return "Draw"
	}
}