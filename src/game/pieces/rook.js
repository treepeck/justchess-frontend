import Piece from "./piece"
import Position from "../position"

/**
 * Represents a rook.
 * @extends {Piece}
 */
export default class Rook extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {boolean} */
  isCaptured
  /** @type {number} */
  movesCounter

  /**
   * Creates a rook.
   * @param {Position} pos 
   * @param {string} color 
   */
  constructor(pos, color) {
    super()
    this.pos = pos
    this.name = "rook"
    this.color = color
    this.isCaptured = false
    this.movesCounter = 0
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
    const availibleMoves = []

    // bottom ranks
    for (let i = this.pos.rank - 1; i >= 1; i--) {
      const nextMove = new Position(this.pos.file, i)
      const piece = pieces[nextMove.toString()]

      if (!nextMove.isInBoard() || piece?.color == this.color) {
        break
      } else if (piece && piece.color != this.color) {
        availibleMoves.push(nextMove.toString())
        break
      }
      availibleMoves.push(nextMove.toString())
    }

    // upper ranks
    for (let i = this.pos.rank + 1; i <= 8; i++) {
      const nextMove = new Position(this.pos.file, i)
      const piece = pieces[nextMove.toString()]

      if (!nextMove.isInBoard() || piece?.color == this.color) {
        break
      } else if (piece && piece.color != this.color) {
        availibleMoves.push(nextMove.toString())
        break
      }
      availibleMoves.push(nextMove.toString())
    }

    // left files
    for (let i = this.pos.file - 1; i >= 1; i--) {
      const nextMove = new Position(i, this.pos.rank)
      const piece = pieces[nextMove.toString()]

      if (!nextMove.isInBoard() || piece?.color == this.color) {
        break
      } else if (piece && piece.color != this.color) {
        availibleMoves.push(nextMove.toString())
        break
      }
      availibleMoves.push(nextMove.toString())
    }

    // right files
    for (let i = this.pos.file + 1; i <= 8; i++) {
      const nextMove = new Position(i, this.pos.rank)
      const piece = pieces[nextMove.toString()]

      if (!nextMove.isInBoard() || piece?.color == this.color) {
        break
      } else if (piece && piece.color != this.color) {
        availibleMoves.push(nextMove.toString())
        break
      }
      availibleMoves.push(nextMove.toString())
    }

    return availibleMoves
  }
}