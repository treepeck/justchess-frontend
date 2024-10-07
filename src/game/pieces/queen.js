import Piece from "./piece"
import Position from "../position"

import Rook from "./rook"
import Bishop from "./bishop"

import blackAsset from "../../assets/pieces/black/queen.png"
import whiteAsset from "../../assets/pieces/white/queen.png"

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
  /** @type {boolean} */
  isCaptured
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
   * @returns {string[]}
   */
  getPossibleMoves(pieces) {
    const rook = new Rook(this.pos, this.color)
    const bishop = new Bishop(this.pos, this.color)
    return [...rook.getPossibleMoves(pieces),
    ...bishop.getPossibleMoves(pieces)]
  }
}