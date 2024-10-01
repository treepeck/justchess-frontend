import Position from "../position"

/**
 * Represents a Piece on a Square.
 * @abstract
 */
export default class Piece {
  /** @type {Position} */
  pos
  /** @type {string} name */
  name
  /** @type {string} color */
  color

  constructor() {
    if (this.constructor == Piece) {
      throw new Error("Abstract piece cannot be instantiated.")
    }
  }

  /**
   * @param {Object.<Position, Piece>} _ 
   * @returns {string[]}
   */
  getAvailibleMoves(_) {
    throw new Error("getAvailibleMoves must be implemented.")
  }
}