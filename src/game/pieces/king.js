import Piece from "./piece"
import Position from "../position"

import blackAsset from "../../assets/pieces/black/king.png"
import whiteAsset from "../../assets/pieces/white/king.png"

/**
 * Represents a King.
 * @extends {Piece}
 */
export default class King extends Piece {
  /** @type {Position} */
  pos
  /** @type {string} */
  type
  /** @type {string} */
  color
  /** @type {string} */
  asset
  /** @type {number} */
  movesCounter

  /**
   * Creates a King.
   * @param {Position} pos 
   * @param {string} color
   * @param {number}  movesCounter
   */
  constructor(pos, color, movesCounter) {
    super()
    this.pos = pos
    this.type = "king"
    this.color = color
    this.asset = color === "white" ? whiteAsset : blackAsset
    this.movesCounter = movesCounter
  }

  /**
   * @param {Map<string, Piece>} pieces
   * @returns {Map<Position, string>}
   */
  getPossibleMoves(pieces) {
    const is = this.getInaccessibleSquares(pieces, this.color)

    const pm = new Map()

    const checkSquare = (dF, dR) => {
      let file = this.pos.file + dF
      let rank = this.pos.rank + dR

      const pos = new Position(file, rank)
      if (!is.get(pos.toString())) {
        if (pos.isInBoard()) {
          const p = pieces.get(pos.toString())

          if (!p || p.getColor() != this.color) {
            pm.set(pos, "basic")
          } else {
            pm.set(pos, "defend")
          }
        }
      }
    }
    checkSquare(-1, +1) // upper left square.
    checkSquare(0, +1)  // upper square.
    checkSquare(+1, +1) // upper right square.
    checkSquare(-1, 0)  // left square.
    checkSquare(+1, 0)  // right square.
    checkSquare(-1, -1) // lower left square.
    checkSquare(0, -1)  // lower square.
    checkSquare(+1, -1) // lower right square.

    const handleCastling = (ct, ss, dF) => {
      let rookPos
      if (ct == "shortCastling") {
        rookPos = new Position(this.pos.file + 3, this.pos.rank)
      } else {
        rookPos = new Position(this.pos.file - 4, this.pos.rank)
      }
      for (let i = 1; i <= ss; i++) {
        const pos = new Position(this.pos.file + (i * dF), this.pos.rank)
        if (pieces.get(pos.toString()) || is.get(pos.toString())) {
          return
        }
      }

      const r = pieces.get(rookPos.toString())
      if (r && r.getType() == "rook" && r.getMovesCounter() == 0) {
        pm.set(new Position(this.pos.file + 2 * dF, this.pos.rank), ct)
      }
    }
    handleCastling("shortCastling", 2, 1)
    handleCastling("longCastling", 3, -1)
    return pm
  }

  /**
   * @param {Map<string, Piece>} pieces 
   * @param {string} side 
   * @returns {Map<string, string>}
   */
  getInaccessibleSquares(pieces, side) {
    /** @type {Map<string, string>} */
    const is = new Map()

    for (const [_, piece] of pieces) {
      if (piece.getColor() != side) {
        switch (piece.getType()) {
          case "pawn":
            const ppm = piece.getPossibleMoves(pieces)
            for (const [pos, moveType] of ppm) {
              if (moveType != "pawnForward") {
                is.set(pos.toString(), moveType)
              }
            }
            break

          case "king":
            this.getEnemyKingPossibleMoves(piece, is)
            break

          default:
            const pm = piece.getPossibleMoves(pieces)
            for (const [pos, moveType] of pm) {
              is.set(pos.toString(), moveType)
            }
        }
      }
    }
    return is
  }

  /**
   * @param {Piece} k 
   * @param {Map<string, string>} pm 
   */
  getEnemyKingPossibleMoves(k, pm) {
    const pp = [
      new Position(k.getPosition().file - 1, k.getPosition().rank + 1),
      new Position(k.getPosition().file, k.getPosition().rank + 1),
      new Position(k.getPosition().file + 1, k.getPosition().rank + 1),
      new Position(k.getPosition().file - 1, k.getPosition().rank),
      new Position(k.getPosition().file + 1, k.getPosition().rank),
      new Position(k.getPosition().file - 1, k.getPosition().rank - 1),
      new Position(k.getPosition().file, k.getPosition().rank - 1),
      new Position(k.getPosition().file + 1, k.getPosition().rank - 1),
    ]

    for (const pos of pp) {
      if (pos.isInBoard()) {
        pm.set(pos.toString(), "basic")
      }
    }
  }

  /** @param {Position} to */
  move(to) {
    this.pos = to
    this.movesCounter++
  }

  getMovesCounter() {
    return this.movesCounter
  }

  setMovesCounter(mc) {
    this.movesCounter = mc
  }

  getType() {
    return this.type
  }

  getColor() {
    return this.color
  }

  getPosition() {
    return this.pos
  }
}