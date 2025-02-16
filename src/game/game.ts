import { CompletedMove } from "./move";
import { Result } from "./result";

export default class Game {
	roomId: string
	whiteId: string
	blackId: string
	result: Result
	timeControl: number
	timeBonus: number
	moves: CompletedMove[]

	constructor(rId: string, wId: string, bId: string, r: Result, moves: CompletedMove[],
		tControl: number, tBonus: number,
	) {
		this.roomId = rId
		this.whiteId = wId
		this.blackId = bId
		this.result = r
		this.moves = moves
		this.timeControl = tControl
		this.timeBonus = tBonus
	}
}