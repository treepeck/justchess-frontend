import Piece from "./piece"
import Position from "../position"

/**
 * Represents a Pawn.
 * @extends {Piece}
 */
export default class Pawn extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {boolean} */
  enPassant
  /** @type {boolean} */
  isCaptured
  /** @type {number} */
  movesCounter

  /**
   * Creates a Pawn.
   * @param {Position} pos 
   * @param {string} color 
   * @param {boolean} enPassant
   * @param {number} movesCounter
   */
  constructor(pos, color, enPassant, movesCounter) {
    super()
    this.pos = pos
    this.name = "pawn"
    this.color = color
    this.enPassant = enPassant
    this.isCaptured = false
    this.movesCounter = movesCounter
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
    let dir = 1
    if (this.color === "black") {
      dir = -1
    }

    const availibleMoves = []

    // check if can move forward
    let forward = new Position(this.pos.file, this.pos.rank + dir)
    if (forward.isInBoard()) {
      if (!pieces[forward.toString()]) {
        availibleMoves.push(forward.toString())
      }

      if (this.movesCounter == 0) {
        let doubleForward = new Position(
          this.pos.file, this.pos.rank + dir * 2
        )
        if (!pieces[doubleForward.toString()]) {
          availibleMoves.push(doubleForward.toString())
        }
      }
    }

    // left diagonal = -1, right diagonal = 1
    for (const df of [-1, 1]) {
      const diagonal = new Position(this.pos.file + df, this.pos.rank + dir)
      const enPassantDiagonal = new Position(diagonal.file, this.pos.rank)

      if (diagonal.isInBoard()) {
        const targetPiece = pieces[diagonal.toString()]

        if (!targetPiece) {
          const enPassant = pieces[enPassantDiagonal.toString()]

          if (enPassant && enPassant.name === "pawn" &&
            enPassant.color !== this.color) {
            // @ts-ignore
            // at this case, we know that the enPassant Piece is a Pawn. 
            if (enPassant.enPassant) {
              availibleMoves.push(diagonal.toString())
            }
          }
        } else {
          if (targetPiece.color !== this.color) {
            availibleMoves.push(diagonal.toString())
          }
        }
      }
    }

    return availibleMoves
  }
}