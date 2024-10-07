import Piece from "./piece"
import Position from "../position"

import blackAsset from "../../assets/pieces/black/pawn.png"
import whiteAsset from "../../assets/pieces/white/pawn.png"
import Move, { MoveType } from "../move"

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
  /** @type {string} */
  asset

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
   * @param {Map<string, Piece>} pieces 
   * @returns {Map<string, MoveType>}
   */
  getPossibleMoves(pieces) {
    let dir = 1
    if (this.color === "black") {
      dir = -1
    }

    /** @type {Map<string, MoveType>} */
    const possibleMoves = new Map()

    // check if can move forward
    let forward = new Position(this.pos.file, this.pos.rank + dir)
    if (forward.isInBoard()) {
      if (!pieces.get(forward.toString())) {
        if (forward.rank > 1 && forward.rank < 8) {
          possibleMoves.set(forward.toString(), MoveType.Basic)
        } else {
          possibleMoves.set(forward.toString(), MoveType.Promotion)
        }
      }

      if (this.movesCounter == 0) {
        let doubleForward = new Position(
          this.pos.file, this.pos.rank + dir * 2
        )
        if (!pieces.get(doubleForward.toString())) {
          possibleMoves.set(doubleForward.toString(), MoveType.Basic)
        }
      }
    }

    // left file = -1, right file = 1
    for (const f of [-1, 1]) {
      const diagonal = new Position(this.pos.file + f, this.pos.rank + dir)
      const possibleEnPassant = new Position(diagonal.file, this.pos.rank)

      if (diagonal.isInBoard()) {
        // in any case the pawn defends the square
        possibleMoves.set(diagonal.toString(), MoveType.Defend)

        const targetPiece = pieces.get(diagonal.toString())
        if (!targetPiece) {
          const ep = pieces.get(possibleEnPassant.toString())

          if (ep && ep.name === "pawn" &&
            ep.color !== this.color) {
            // @ts-ignore
            // at this case, we know that the enPassant Piece is a Pawn. 
            if (ep.isEnPassant) {
              possibleMoves.set(diagonal.toString(), MoveType.EnPassant)
            }
          }
        } else {
          if (targetPiece.color !== this.color) {
            possibleMoves.set(diagonal.toString(), "capture")
            if (diagonal.rank === 1 || diagonal.rank === 8) {
              possibleMoves.set(diagonal.toString(), MoveType.Promotion)
            }
          }
        }
      }
    }

    return possibleMoves
  }
}