// Represents a move completed by a user. 
export default class Move {
  to: string
  from: string
  isCheck: boolean
  moveType: number
  timeLeft: number
  isCapture: boolean
  isCheckmate: boolean
  pp: string // promotion payload

  constructor(
    to: string, from: string,
    isCheck: boolean, moveType: number,
    timeLeft: number, isCapture: boolean,
    isCheckmate: boolean, pp: string) {
    this.to = to
    this.from = from
    this.isCheck = isCheck
    this.moveType = moveType
    this.timeLeft = timeLeft
    this.isCapture = isCapture
    this.isCheckmate = isCheckmate
    this.pp = pp
  }
}

// Represents all moves that sended to a backend. 
export class MoveDTO {
  to: string
  from: string
  pp: string

  constructor(to: string, from: string, pp: string) {
    this.to = to
    this.from = from
    this.pp = pp
  }
}

// Respresents a possible move on a board. 
export class PossibleMove {
  to: string
  from: string
  moveType: number

  constructor(to: string, from: string, mt: number) {
    this.to = to
    this.from = from
    this.moveType = mt
  }
}