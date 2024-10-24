import Position from "../position"
import traverse from "./traverse"

import blackAsset from "../../assets/pieces/black/bishop.png"
import whiteAsset from "../../assets/pieces/white/bishop.png"
import Piece from "./piece"

/**
 * Represents a Bishop.
 */
export default class Bishop extends Piece {
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
   * Creates a Bishop.
   * @param {Position} pos 
   * @param {string} color 
   * @param {number} movesCounter
   */
  constructor(pos, color, movesCounter) {
    super()
    this.pos = pos
    this.type = "bishop"
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
    traverse(-1, 1, pieces, this, pm)  // upper left diagonal
    traverse(-1, -1, pieces, this, pm) // lower left diagonal
    traverse(1, 1, pieces, this, pm)   // upper right diagonal
    traverse(1, -1, pieces, this, pm)  // lower right diagonal
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