import Position, { posFromStr } from "./position"
import { PossibleMove } from "./move"
import buildPiece from "./pieces/piecesBuilder"
import Piece from "./pieces/piece"
import Rook from "./pieces/rook"

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
  /**
   * string key is a position of a piece. 
   * @type {Map<string, Piece>}
   */
  pieces
  /** @type {Map<PossibleMove, boolean>} */
  cvm // current valid moves

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
   * @param {Map<string, any>} pieces 
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
    this.cvm = new Map()
  }

  /**
   * @param {string} side 
   * @returns {Map<PossibleMove, boolean>}
   */
  getPlayerValidMoves(side) {
    debugger
    const ppm = this.getPlayerPossibleMoves(side, this.pieces)

    let es // enemy side
    if (side == "white") {
      es = "black"
    } else {
      es = "white"
    }

    const vm = new Map()
    for (const [pm, _] of ppm) {
      if (pm.moveType === "defend") {
        continue
      }

      const bc = new Map() // board copy
      for (const [pos, piece] of this.pieces) {
        bc.set(pos, piece)
      }
      let isChecked = false
      const p = bc.get(pm.from.toString())
      // @ts-ignore
      p.move(pm.to)
      bc.set(pm.to.toString(), bc.get(pm.from.toString()))
      bc.delete(pm.from.toString())
      const eppm = this.getPlayerPossibleMoves(es, bc)
      for (const [epm, _] of eppm) {
        const p = bc.get(epm.to.toString())
        if (p && p.type === "king" && p.color == side) {
          isChecked = true
          break
        }
      }
      if (!isChecked) {
        vm.set(pm, true)
      }
    }
    return vm
  }

  /**
   * @param {string} side 
   * @param {Map<string, Piece>} pieces 
   * @returns {Map<PossibleMove, boolean>}
   */
  getPlayerPossibleMoves(side, pieces) {
    const pm = new Map()
    for (const [from, piece] of pieces) {
      if (piece.getColor() === side) {
        const ppm = piece.getPossibleMoves(pieces)
        for (const [pos, mt] of ppm) {
          pm.set(new PossibleMove(
            pos, posFromStr(from), mt, piece.getType()),
            true
          )
        }
      }
    }
    return pm
  }
}