import Move, { MoveType } from "../move"
import Position from "../position"

/**
 * Represents a Piece on a Square.
 * @abstract
 */
export default class Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {string} */
  asset

  constructor() {
    if (this.constructor == Piece) {
      throw new Error("Abstract piece cannot be instantiated.")
    }
  }

  /**
   * @param {Map<string, Piece>} _ 
   * @returns {Map<string, MoveType>}
   */
  getPossibleMoves(_) {
    throw new Error("getPossibleMoves must be implemented.")
  }
}