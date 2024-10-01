import Piece from "./piece"
import Position from "../position"

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
   * @returns {string[]}
   */
  getAvailibleMoves(pieces) {
    /** @type {Position[]} */
    const possibleMoves = [
      new Position(this.pos.file + 2, this.pos.rank + 1),
      new Position(this.pos.file + 2, this.pos.rank - 1),
      new Position(this.pos.file - 2, this.pos.rank + 1),
      new Position(this.pos.file - 2, this.pos.rank - 1),
      new Position(this.pos.file - 1, this.pos.rank + 2),
      new Position(this.pos.file + 1, this.pos.rank - 2),
      new Position(this.pos.file - 1, this.pos.rank - 2),
      new Position(this.pos.file + 1, this.pos.rank + 2),
    ]

    const availibleMoves = []
    for (const move of possibleMoves) {
      if (move.isInBoard()) {
        if (!pieces[move.toString()] ||
          pieces[move.toString()].color !== this.color) {
          availibleMoves.push(move.toString())
        }
      }
    }

    return availibleMoves
  }
}