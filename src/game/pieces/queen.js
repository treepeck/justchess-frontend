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
  type
  /** @type {string} */
  color
  /** @type {string} */
  asset
  /** @type {number} */
  movesCounter

  /**
   * Creates a Queen.
   * @param {Position} pos 
   * @param {string} color 
   * @param {number} movesCounter
   */
  constructor(pos, color, movesCounter) {
    super()
    this.pos = pos
    this.type = "queen"
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

    const rook = new Rook(this.pos, this.color, 0)
    const bishop = new Bishop(this.pos, this.color, 0)

    for (const [pos, mt] of rook.getPossibleMoves(pieces)) {
      pm.set(pos, mt)
    }
    for (const [pos, mt] of bishop.getPossibleMoves(pieces)) {
      pm.set(pos, mt)
    }
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