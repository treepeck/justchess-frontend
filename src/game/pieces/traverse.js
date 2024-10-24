import Position from "../position"
import Piece from "./piece"

/**
 * traverse is a helper function that travels the board in a
 * given direction.
 * @param {number} dF delta file
 * @param {number} dR delta rank
 * @param {Map<string, Piece>} pieces 
 * @param {Piece} p
 * @param {Map<Position, string>} pm
 */
export default function traverse(dF, dR, pieces, p, pm) {
  let file = p.getPosition().file
  let rank = p.getPosition().rank
  for (; ;) {
    file += dF
    rank += dR

    const nextPos = new Position(file, rank)
    if (!nextPos.isInBoard()) {
      break
    }

    const piece = pieces.get(nextPos.toString())
    if (piece) {
      if (piece.getColor() != p.getColor()) {
        pm.set(nextPos, "basic")
      } else {
        pm.set(nextPos, "defend")
      }
      break
    }
    pm.set(nextPos, "basic")
  }
}