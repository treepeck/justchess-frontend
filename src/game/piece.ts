import assets from "../assets/pieces/pieces"

export default class Piece {
  pos: string
  type: string
  color: string
  asset: string

  constructor(p: string, t: string, c: string) {
    this.pos = p
    this.type = t
    this.color = c
    // @ts-ignore
    this.asset = assets[`${c}${t}`]
  }
}