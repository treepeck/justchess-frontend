import Piece from "./piece"

export default class Square {
  piece: Piece | null | undefined
  pos: string
  color: string

  constructor(piece: Piece | null | undefined, pos: string, color: string) {
    this.piece = piece
    this.pos = pos
    this.color = color
  }
}