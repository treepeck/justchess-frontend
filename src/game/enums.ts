export enum Status {
	NotStarted,
	Continues,
	WhiteDisconnected,
	BlackDisconnected,
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