import { CompletedMove } from "./move";
import { Result, Status } from "./enums";

export default class Game {
	whiteId: string
	blackId: string
	status: Status
	result: Result
	moves: CompletedMove[]

	constructor(wId: string, bId: string, s: Status, r: Result, moves: CompletedMove[]
	) {
		this.whiteId = wId
		this.blackId = bId
		this.status = s
		this.result = r
		this.moves = moves
	}
}