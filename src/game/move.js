import Position from "./position";

/**
* Enum for storing types of chess moves.
* @readonly 
* @enum {string}
*/
export const MoveType = {
  Basic: "basic",
  Defend: "defend",
  LongCastling: "longCastling",
  ShortCastling: "shortCastling",
  EnPassant: "enPassant",
  Promotion: "promotion"
}

export default class Move {
  /** @type {Position} */
  to
  /** @type {Position} */
  from
  /** @type {string} */
  promotionPayload

  /**
   * Creates a new Move.
   * @param {Position} to 
   * @param {Position} from 
   * @param {string} promotionPayload
   */
  constructor(to, from, promotionPayload) {
    this.to = to
    this.from = from
    this.promotionPayload = promotionPayload
  }

}