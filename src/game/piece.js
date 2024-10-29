import assets from "../assets/pieces/pieces"

/**
 * Represents a chess piece.
 */
export default class Piece {
  /** @type {string} */
  type
  /** @type {string} */
  color
  /** @type {string} */
  asset

  /**
   * Creates a new piece.
   * @param {string} t type.
   * @param {string} c color.
   */
  constructor(t, c) {
    this.type = t
    this.color = c
    this.asset = assets[`${c}${t}`]
  }
}