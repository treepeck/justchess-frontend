import Piece from "./pieces/piece"
import Position from "./position"

/**
 * Represents a Square on a Chessboard.
 */
export default class Square {
  /** @type {Piece | null} */
  piece
  /** @type {Position} */
  pos
  /** @type {string} */
  color
  /** @type {boolean} */
  isSelected
  /** @type {boolean} */
  isAvailible

  /**
   * Creates a new Square.
   * @param {Piece | null} piece 
   * @param {Position} pos 
   * @param {string} color 
   * @param {boolean} isSelected 
   * @param {boolean} isAvailible 
   */
  constructor(piece, pos, color, isSelected, isAvailible) {
    this.piece = piece
    this.pos = pos
    this.color = color
    this.isSelected = isSelected
    this.isAvailible = isAvailible
  }
}