import Piece from "./pieces/piece"

export default class Game {
  /** @type {string} */
  id
  /** @type {string} */
  control
  /** @type {number} */
  bonus
  /** @type {string} */
  status
  /** @type {string} */
  whiteId
  /** @type {string} */
  blackId
  /** @type {string} */
  playedAt
  /** @type {Object} */
  moves
  /** @type {Object.<String, Piece>} */
  pieces

  /**
   * 
   * @param {string} id 
   * @param {string} control 
   * @param {number} bonus 
   * @param {string} status 
   * @param {string} whiteId 
   * @param {string} blackId 
   * @param {string} playedAt 
   * @param {Object[]} moves 
   * @param {Object.<String, Piece>} pieces 
   */
  constructor(id, control, bonus, status, whiteId,
    blackId, playedAt, moves, pieces
  ) {
    this.id = id
    this.control = control
    this.bonus = bonus
    this.status = status
    this.whiteId = whiteId
    this.blackId = blackId
    this.playedAt = playedAt
    this.moves = moves
    this.pieces = pieces
  }
}