// Represents a move completed by a user. 
export default class Move {
  uci: string
  lan: string
  fen: string
  vm: Record<string, string>
  timeLeft: number

  constructor(uci: string, lan: string, fen: string, timeLeft: number,
    vm: Record<string, string>) {
    this.uci = uci
    this.lan = lan
    this.fen = fen
    this.vm = vm
    this.timeLeft = timeLeft
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