import { Color, Result } from "./enums"
import { CompletedMove } from "./move"

export type Game = {
	id: string
	whiteId: string
	blackId: string
	timeControl: number
	timeBonus: number
	result: Result
	winner: Color
	moves: CompletedMove[]
	createdAt: string
	whiteName: string
	blackName: string
}