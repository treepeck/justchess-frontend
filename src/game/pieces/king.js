import Piece from "./piece"
import Position from "../position"
import buildPiece from "./piecesBuilder"

import blackAsset from "../../assets/pieces/black/king.png"
import whiteAsset from "../../assets/pieces/white/king.png"
import { MoveType } from "../move"

/**
 * Represents a King.
 * @extends {Piece}
 */
export default class King extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {string} */
  asset
  /** @type {boolean} */
  isChecked
  /** @type {number} */
  movesCounter

  /**
   * Creates a King.
   * @param {Position} pos 
   * @param {string} color 
   * @param {boolean} isChecked
   * @param {number} movesCounter
   */
  constructor(pos, color, isChecked, movesCounter) {
    super()
    this.pos = pos
    this.name = "king"
    this.color = color
    this.asset = color === "white" ? whiteAsset : blackAsset
    this.isChecked = false
    this.movesCounter = movesCounter
  }

  /** @returns {string} */
  getName() {
    return this.name
  }

  /** @returns {string} */
  getColor() {
    return this.color
  }

  /** @returns {Position} */
  getPos() {
    return this.pos
  }

  /**
   * @param {Map<string, Piece>} pieces 
   * @returns {Map<string, MoveType>}
   */
  getPossibleMoves(pieces) {
    /** @type {Map<string, MoveType>} */
    const inaccessibleSquares = new Map()

    for (const [_, piece] of pieces) {
      if (piece.color !== this.color) {
        if (piece.name === "king") {
          const enemyKing = [
            new Position(piece.pos.file - 1, piece.pos.rank + 1),
            new Position(piece.pos.file, piece.pos.rank + 1),
            new Position(piece.pos.file + 1, piece.pos.rank + 1),
            new Position(piece.pos.file - 1, piece.pos.rank),
            new Position(piece.pos.file + 1, piece.pos.rank),
            new Position(piece.pos.file - 1, piece.pos.rank - 1),
            new Position(piece.pos.file, piece.pos.rank - 1),
            new Position(piece.pos.file + 1, piece.pos.rank - 1)
          ]
          for (const pos of enemyKing) {
            if (pos.isInBoard()) {
              inaccessibleSquares.set(pos.toString(), MoveType.Basic)
            }
          }
        } else if (piece.name === "pawn") {
          const concretePawn = buildPiece(piece)
          const possibleMoves = concretePawn?.getPossibleMoves(pieces)
          // @ts-ignore
          for (const [pos, moveType] of possibleMoves) {
            if (moveType !== MoveType.PawnForward) {
              inaccessibleSquares.set(pos, moveType)
            }
          }
        } else {
          const concretePiece = buildPiece(piece)
          const possibleMoves = concretePiece?.getPossibleMoves(pieces)
          // @ts-ignore
          for (const [pos, moveType] of possibleMoves) {
            inaccessibleSquares.set(pos, moveType)
          }
        }
      }
    }

    /** @type {Position[]} */
    const possiblePositions = [
      new Position(this.pos.file - 1, this.pos.rank + 1),
      new Position(this.pos.file, this.pos.rank + 1),
      new Position(this.pos.file + 1, this.pos.rank + 1),
      new Position(this.pos.file - 1, this.pos.rank),
      new Position(this.pos.file + 1, this.pos.rank),
      new Position(this.pos.file - 1, this.pos.rank - 1),
      new Position(this.pos.file, this.pos.rank - 1),
      new Position(this.pos.file + 1, this.pos.rank - 1)
    ]

    /** @type {Map<string, MoveType>} */
    const possibleMoves = new Map()
    for (const pos of possiblePositions) {
      if (!inaccessibleSquares.get(pos.toString())) {
        if (pos.isInBoard()) {
          const piece = pieces.get(pos.toString())
          if (!piece || piece.color !== this.color) {
            possibleMoves.set(pos.toString(), MoveType.Basic)
          } else {
            possibleMoves.set(pos.toString(), MoveType.Defend)
          }
        }
      }
    }


    if (!this.isChecked && this.movesCounter == 0) {
      // check 0-0
      let canShortCastle = true
      for (let i = 1; i <= 2; i++) {
        const pos = new Position(this.pos.file + i, this.pos.rank)

        if (pieces.get(pos.toString()) ||
          inaccessibleSquares.get(pos.toString())) {
          canShortCastle = false
        }
      }
      if (canShortCastle) {
        const rookPos = new Position(this.pos.file + 3, this.pos.rank)
        const p = pieces.get(rookPos.toString())
        // @ts-ignore
        if (p && p.name === "rook" && p.movesCounter == 0) {
          possibleMoves.set(
            new Position(this.pos.file + 2, this.pos.rank).toString(),
            MoveType.ShortCastling
          )
        }
      }
      // check 0-0-0
      let canLongCastle = true
      for (let i = 1; i <= 3; i++) {
        const pos = new Position(this.pos.file - i, this.pos.rank)

        if (pieces.get(pos.toString()) ||
          inaccessibleSquares.get(pos.toString())) {
          canLongCastle = false
        }
      }
      if (canLongCastle) {
        const rookPos = new Position(this.pos.file - 4, this.pos.rank)
        const p = pieces.get(rookPos.toString())
        // @ts-ignore
        if (p && p.name === "rook" && p.movesCounter == 0) {
          possibleMoves.set(
            new Position(this.pos.file - 2, this.pos.rank).toString(),
            MoveType.LongCastling
          )
        }
      }
    }

    return possibleMoves
  }
}