import Piece from "./piece"
import Position from "../position"

import Rook from "./rook"
import Bishop from "./bishop"

import blackAsset from "../../assets/pieces/black/queen.png"
import whiteAsset from "../../assets/pieces/white/queen.png"
import { MoveType } from "../move"

/**
 * Represents a Queen.
 * @extends {Piece}
 */
export default class Queen extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {string} */
  asset

  /**
   * Creates a Queen.
   * @param {Position} pos 
   * @param {string} color 
   */
  constructor(pos, color) {
    super()
    this.pos = pos
    this.name = "queen"
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
    const rook = new Rook(this.pos, this.color)
    const bishop = new Bishop(this.pos, this.color)

    /** @type {Map<string, MoveType>} */
    const possibleMoves = new Map()
    for (const [pos, moveType] of rook.getPossibleMoves(pieces)) {
      possibleMoves.set(pos, moveType)
    }
    for (const [pos, moveType] of bishop.getPossibleMoves(pieces)) {
      possibleMoves.set(pos, moveType)
    }
    return possibleMoves
  }
}