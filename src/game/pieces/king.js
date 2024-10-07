import Piece from "./piece"
import Position from "../position"

import blackAsset from "../../assets/pieces/black/king.png"
import whiteAsset from "../../assets/pieces/white/king.png"

/**
 * Represents a King.
 * @extends {Piece}
 */
export default class King extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {boolean} */
  isCaptured
  /** @type {string} */
  asset

  /**
   * Creates a King.
   * @param {Position} pos 
   * @param {string} color 
   */
  constructor(pos, color) {
    super()
    this.pos = pos
    this.name = "king"
    this.color = color
    this.isCaptured = false
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
   * @param {Object.<string, Piece>} pieces 
   * @returns {Map<Position, string>}
   */
  getPossibleMoves(pieces) {
    return new Map()
  }
}