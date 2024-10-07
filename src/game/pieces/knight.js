import Piece from "./piece"
import Position from "../position"

import blackAsset from "../../assets/pieces/black/knight.png"
import whiteAsset from "../../assets/pieces/white/knight.png"
import { MoveType } from "../move"

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

    /** @type {Map<string, MoveType>} */
    const possibleMoves = new Map()
    for (const pos of possiblePos) {
      if (pos.isInBoard()) {
        const piece = pieces.get(pos.toString())
        if (!piece) {
          possibleMoves.set(pos.toString(), MoveType.Basic)
        } else if (piece.color !== this.color) {
          possibleMoves.set(pos.toString(), MoveType.Basic)
        } else {
          possibleMoves.set(pos.toString(), MoveType.Defend)
        }
      }
    }

    return possibleMoves
  }
}