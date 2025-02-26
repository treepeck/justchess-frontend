export enum Status {
	ABANDONED,
	WAITING,
	IN_PROGRESS,
	WHITE_DISCONNECTED,
	BLACK_DISCONNECTED
}

export enum Result {
	Unknown,
	Checkmate,
	Timeout,
	Stalemate,
	InsufficienMaterial,
	FiftyMoves,
	Repetition,
	Agreement,
}