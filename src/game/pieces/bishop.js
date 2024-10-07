import Piece from "./piece"
import Position from "../position"

import blackAsset from "../../assets/pieces/black/bishop.png"
import whiteAsset from "../../assets/pieces/white/bishop.png"
import { MoveType } from "../move"

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
  /** @type {string} */
  asset

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
    const possibleMoves = new Map()

    let rank = this.pos.rank
    for (let i = this.pos.file - 1; i >= 1; i--) {
      rank++
      const nextMove = new Position(i, rank)
      if (nextMove.isInBoard()) {
        if (!pieces.get(nextMove.toString())) {
          possibleMoves.set(nextMove.toString(), MoveType.Basic)
          continue
        } else if (pieces.get(nextMove.toString())?.color !== this.color) {
          possibleMoves.set(nextMove.toString(), MoveType.Basic)
        } else if (pieces.get(nextMove.toString())?.color === this.color) {
          possibleMoves.set(nextMove.toString(), MoveType.Defend)
        }
      }
      break
    }

    rank = this.pos.rank
    for (let i = this.pos.file - 1; i >= 1; i--) {
      rank--
      const nextMove = new Position(i, rank)
      if (nextMove.isInBoard()) {
        if (!pieces.get(nextMove.toString())) {
          possibleMoves.set(nextMove.toString(), MoveType.Basic)
          continue
        } else if (pieces.get(nextMove.toString())?.color !== this.color) {
          possibleMoves.set(nextMove.toString(), MoveType.Basic)
        } else if (pieces.get(nextMove.toString())?.color === this.color) {
          possibleMoves.set(nextMove.toString(), MoveType.Defend)
        }
      }
      break
    }

    rank = this.pos.rank
    for (let i = this.pos.file + 1; i <= 8; i++) {
      rank++
      const nextMove = new Position(i, rank)
      if (nextMove.isInBoard()) {
        if (!pieces.get(nextMove.toString())) {
          possibleMoves.set(nextMove.toString(), MoveType.Basic)
          continue
        } else if (pieces.get(nextMove.toString())?.color !== this.color) {
          possibleMoves.set(nextMove.toString(), MoveType.Basic)
        } else if (pieces.get(nextMove.toString())?.color === this.color) {
          possibleMoves.set(nextMove.toString(), MoveType.Defend)
        }
      }
      break
    }

    rank = this.pos.rank
    for (let i = this.pos.file + 1; i <= 8; i++) {
      rank--
      const nextMove = new Position(i, rank)
      if (nextMove.isInBoard()) {
        if (!pieces.get(nextMove.toString())) {
          possibleMoves.set(nextMove.toString(), MoveType.Basic)
          continue
        } else if (pieces.get(nextMove.toString())?.color !== this.color) {
          possibleMoves.set(nextMove.toString(), MoveType.Basic)
        } else if (pieces.get(nextMove.toString())?.color === this.color) {
          possibleMoves.set(nextMove.toString(), MoveType.Defend)
        }
      }
      break
    }

    return possibleMoves
  }
}