import Piece from "./piece"
import Position from "../position"

/**
 * Represents a Bishop.
 * @extends {Piece}
 */
export default class Bishop extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {boolean} */
  isCaptured

  /**
   * Creates a Bishop.
   * @param {Position} pos 
   * @param {string} color 
   */
  constructor(pos, color) {
    super()
    this.pos = pos
    this.name = "bishop"
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
    const availibleMoves = []

    let rank = this.pos.rank
    for (let i = this.pos.file - 1; i >= 1; i--) {
      rank++
      let nextMove = new Position(i, rank)
      if (!pieces[nextMove.toString()]) {
        availibleMoves.push(nextMove.toString())
        continue
      } else if (pieces[nextMove.toString()]?.color !== this.color) {
        availibleMoves.push(nextMove.toString())
      }
      break
    }

    rank = this.pos.rank
    for (let i = this.pos.file - 1; i >= 1; i--) {
      rank--
      let nextMove = new Position(i, rank)
      if (!pieces[nextMove.toString()]) {
        availibleMoves.push(nextMove.toString())
        continue
      } else if (pieces[nextMove.toString()]?.color !== this.color) {
        availibleMoves.push(nextMove.toString())
      }
      break
    }

    rank = this.pos.rank
    for (let i = this.pos.file + 1; i <= 8; i++) {
      rank++
      let nextMove = new Position(i, rank)
      if (!pieces[nextMove.toString()]) {
        availibleMoves.push(nextMove.toString())
        continue
      } else if (pieces[nextMove.toString()]?.color !== this.color) {
        availibleMoves.push(nextMove.toString())
      }
      break
    }

    rank = this.pos.rank
    for (let i = this.pos.file + 1; i <= 8; i++) {
      rank--
      let nextMove = new Position(i, rank)
      if (!pieces[nextMove.toString()]) {
        availibleMoves.push(nextMove.toString())
        continue
      } else if (pieces[nextMove.toString()]?.color !== this.color) {
        availibleMoves.push(nextMove.toString())
      }
      break
    }

    return availibleMoves
  }
}