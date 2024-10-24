import Position from "./position";

/** Represents a move completed by a user. */
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
  constructor(to, from,
    promotionPayload) {
    this.to = to
    this.from = from
    this.promotionPayload = promotionPayload
  }
}

/** Respresents a possible move on a board. */
export class PossibleMove {
  /** @type {Position} */
  to
  /** @type {Position} */
  from
  /** @type {string} */
  moveType
  /** @type {string} */
  pieceType

  /**
   * Creates a new Possible move.
   * @param {Position} to 
   * @param {Position} from 
   * @param {string} moveType 
   * @param {string} pieceType
   */
  constructor(to, from, moveType, pieceType) {
    this.to = to
    this.from = from
    this.moveType = moveType
    this.pieceType = pieceType
  }

  /**
   * @returns {string}
   */
  toString() {
    return `${this.to}-${this.from}-${this.moveType}-${this.pieceType}`
  }
}