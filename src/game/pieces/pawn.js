import Piece from "./piece"
import Position from "../position"

import blackAsset from "../../assets/pieces/black/pawn.png"
import whiteAsset from "../../assets/pieces/white/pawn.png"
import Move from "../move"

/**
 * Represents a Pawn.
 * @extends {Piece}
 */
export default class Pawn extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  type
  /** @type {string} */
  color
  /** @type {boolean} */
  isEnPassant
  /** @type {number} */
  movesCounter
  /** @type {string} */
  asset

  /**
   * Creates a Pawn.
   * @param {Position} pos 
   * @param {string} color 
   * @param {number} movesCounter
   */
  constructor(pos, color, movesCounter, isEnPassant) {
    super()
    this.pos = pos
    this.type = "pawn"
    this.color = color
    this.isEnPassant = isEnPassant
    this.movesCounter = movesCounter
    this.asset = color === "white" ? whiteAsset : blackAsset
  }

  /**
   * @param {Map<string, Piece>} pieces
   * @returns {Map<Position, string>}
   */
  getPossibleMoves(pieces) {
    /** @type {Map<Position, string>} */
    const pm = new Map()

    let dir = 1
    if (this.color == "black") {
      dir = -1
    }

    const forward = new Position(this.pos.file, this.pos.rank + dir)
    if (forward.isInBoard()) {
      if (!pieces.get(forward.toString())) {
        if (forward.rank > 1 && forward.rank < 8) {
          pm.set(forward, "pawnForward")
        } else {
          pm.set(forward, "promotion")
        }
      }

      if (this.movesCounter == 0) {
        const doubleForward = new Position(this.pos.file, this.pos.rank + dir * 2)
        if (!pieces.get(doubleForward.toString())) {
          pm.set(doubleForward, "pawnForward")
        }
      }
    }

    for (const dF of [-1, 1]) {
      const diagonal = new Position(this.pos.file + dF, this.pos.rank + dir)
      const possibleEP = new Position(diagonal.file, this.pos.rank)

      if (diagonal.isInBoard()) {
        pm.set(diagonal, "defend")

        const targetPiece = pieces.get(diagonal.toString())
        if (!targetPiece) {
          const ep = pieces.get(possibleEP.toString())
          if (ep && ep.getType() == "pawn" && ep.getColor() != this.color) {
            //@ts-ignore
            if (ep.isEnPassant) {
              pm.set(diagonal, "enPassant")
            }
          }
        } else {
          if (targetPiece.getColor() != this.color) {
            pm.set(diagonal, "basic")
            if (targetPiece.getPosition().rank == 1 || targetPiece.getPosition().rank == 8) {
              pm.set(diagonal, "promotion")
            }
          }
        }
      }
    }
    return pm
  }

  /** @param {Position} to */
  move(to) {
    this.pos = to
    this.movesCounter++
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