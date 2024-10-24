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
  type
  /** @type {string} */
  color
  /** @type {string} */
  asset
  /** @type {number} */
  movesCounter

  /**
   * Creates a Knight.
   * @param {Position} pos 
   * @param {string} color
   * @param {number} movesCounter
   */
  constructor(pos, color, movesCounter) {
    super()
    this.pos = pos
    this.type = "knight"
    this.color = color
    this.asset = color === "white" ? whiteAsset : blackAsset
    this.movesCounter = movesCounter
  }

  /**
   * @param {Map<string, Piece>} pieces
   * @returns {Map<Position, string>}
   */
  getPossibleMoves(pieces) {
    /** @type {Map<Position, string>} */
    const pm = new Map()

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
    for (const pos of possiblePos) {
      if (pos.isInBoard()) {
        const p = pieces.get(pos.toString())
        if (!p) {
          pm.set(pos, "basic")
        } else if (p.getColor() != this.color) {
          pm.set(pos, "basic")
        } else if (p.getColor() == this.color) {
          pm.set(pos, "defend")
        }
      }
    }
    return pm
  }

  /** @param {Position} to */
  move(to) {
    this.pos = to
  }

  getMovesCounter() {
    return this.movesCounter
  }

  setMovesCounter(mc) {
    this.movesCounter = mc
  }

  getType() {
    return this.type
  }

  getColor() {
    return this.color
  }

  getPosition() {
    return this.pos
  }
}