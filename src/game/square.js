import Piece from "./pieces/piece"
import Position from "./position"

/**
 * Represents a Square on a Chessboard.
 */
export default class Square {
  /** @type {Piece | null | undefined} */
  piece
  /** @type {Position} */
  pos
  /** @type {string} */
  color

  /**
   * Creates a new Square.
   * @param {Piece | null | undefined} piece 
   * @param {Position} pos 
   * @param {string} color 
   */
  constructor(piece, pos, color) {
    this.piece = piece
    this.pos = pos
    this.color = color
  }
}