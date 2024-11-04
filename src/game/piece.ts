import assets from "../assets/pieces/pieces"

export default class Piece {
  type: string
  color: string
  asset: string

  constructor(t: string, c: string) {
    this.type = t
    this.color = c
    // @ts-ignore
    this.asset = assets[`${c}${t}`]
  }
}