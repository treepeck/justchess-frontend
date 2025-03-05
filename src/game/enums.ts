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
	Agreement
}