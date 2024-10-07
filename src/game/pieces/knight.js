import Piece from "./piece"
import Position from "../position"

import blackAsset from "../../assets/pieces/black/knight.png"
import whiteAsset from "../../assets/pieces/white/knight.png"

/**
 * Represents a Knight.
 * @extends {Piece}
 */
export default class Knight extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {boolean} */
  isCaptured
  /** @type {string} */
  asset

  /**
   * Creates a Knight.
   * @param {Position} pos 
   * @param {string} color 
   */
  constructor(pos, color) {
    super()
    this.pos = pos
    this.name = "knight"
    this.color = color
    this.isCaptured = false
    this.asset = color === "white" ? whiteAsset : blackAsset
  }

  /** @returns {string} */
  getName() {
    return this.name
  }

  /** @returns {string} */
  getColor() {
    return this.color
  }

  /** @returns {Position} */
  getPos() {
    return this.pos
  }

  /**
   * @param {Object.<string, Piece>} pieces 
   * @returns {Map<Position, string>}
   */
  getPossibleMoves(pieces) {
    /** @type {Position[]} */
    const possiblePos = [
      new Position(this.pos.file + 2, this.pos.rank + 1),
      new Position(this.pos.file + 2, this.pos.rank - 1),
      new Position(this.pos.file - 2, this.pos.rank + 1),
      new Position(this.pos.file - 2, this.pos.rank - 1),
      new Position(this.pos.file - 1, this.pos.rank + 2),
      new Position(this.pos.file + 1, this.pos.rank - 2),
      new Position(this.pos.file - 1, this.pos.rank - 2),
      new Position(this.pos.file + 1, this.pos.rank + 2),
    ]

    /** @type {Map<Position, string>} */
    const possibleMoves = new Map()
    for (const pos of possiblePos) {
      if (pos.isInBoard()) {
        const piece = pieces[pos.toString()]
        if (!piece) {
          possibleMoves.set(pos, "basic")
        } else if (piece.color !== this.color) {
          possibleMoves.set(pos, "capture")
        } else {
          possibleMoves.set(pos, "defend")
        }
      }
    }

    return possibleMoves
  }
}