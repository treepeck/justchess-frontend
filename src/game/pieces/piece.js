import Position from "../position"

/**
 * Represents a Piece on a Square.
 * @abstract
 */
export default class Piece {
  constructor() {
    if (this.constructor == Piece) {
      throw new Error("Abstract piece cannot be instantiated.")
    }
  }

  /**
   * @param {Map<string, Piece>} _
   * @returns {Map<Position, string>}
   */
  getPossibleMoves(_) {
    throw new Error("getPossibleMoves must be implemented.")
  }

  /** @param {Position} _ */
  move(_) {
    throw new Error("move must be implemented.")
  }

  /** @returns {number} */
  getMovesCounter() {
    throw new Error("getMovesCounter must be implemented.")
  }

  /** @param {number} _ */
  setMovesCounter(_) {
    throw new Error("setMovesCounter must be implemented.")
  }

  /** @returns {Position} */
  getPosition() {
    throw new Error("getPosition must be implemented.")
  }

  /** @returns {string} */
  getType() {
    throw new Error("getType must be implemented.")
  }

  /** @returns {string} */
  getColor() {
    throw new Error("getColor must be implemented.")
  }
}

