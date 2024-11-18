import Move, { PossibleMove } from "./move"
import Player from "./player"

export default class Game {
  bonus: number
  status: number
  control: string
  white: Player
  black: Player

  constructor(b: number, s: number, c: string, w: Player, bp: Player) {
    this.bonus = b
    this.status = s
    this.control = c
    this.white = w
    this.black = bp
  }
}