import Piece from "./piece"

/**
 * Represents a Square on a Chessboard.
 */
export default class Square {
  /** @type {Piece | null | undefined} */
  piece
  /** @type {string} */
  pos
  /** @type {string} */
  color

  /**
   * Creates a new Square.
   * @param {Piece | null | undefined} piece 
   * @param {string} pos 
   * @param {string} color 
   */
  constructor(piece, pos, color) {
    this.piece = piece
    this.pos = pos
    this.color = color
  }
}