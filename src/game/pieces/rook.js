import Piece from "./piece"
import Position from "../position"
import traverse from "./traverse"

import blackAsset from "../../assets/pieces/black/rook.png"
import whiteAsset from "../../assets/pieces/white/rook.png"

/**
 * Represents a rook.
 * @extends {Piece}
 */
export default class Rook extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  type
  /** @type {string} */
  color
  /** @type {number} */
  movesCounter
  /** @type {string} */
  asset

  /**
   * Creates a rook.
   * @param {Position} pos 
   * @param {string} color
   * @param {number} movesCounter 
   */
  constructor(pos, color, movesCounter) {
    super()
    this.pos = pos
    this.type = "rook"
    this.color = color
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
    traverse(0, 1, pieces, this, pm)  // upper horizontal
    traverse(0, -1, pieces, this, pm) // lower horizontal
    traverse(1, 0, pieces, this, pm)  // right horizontal
    traverse(-1, 0, pieces, this, pm) // left horizontal
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