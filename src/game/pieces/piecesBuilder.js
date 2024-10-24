import Pawn from "./pawn"
import Rook from "./rook"
import Knight from "./knight"
import Bishop from "./bishop"
import Queen from "./queen"
import King from "./king"
import Piece from "./piece"

/**
 * @param {Object} piece 
 * @returns {Piece | null}
 */
export default function buildPiece(piece) {
  if (!piece) {
    return null
  }

  switch (piece.type) {
    case "pawn":
      return new Pawn(piece.pos, piece.color, piece.movesCounter, piece.isEnPassant)
    case "rook":
      return new Rook(piece.pos, piece.color, piece.movesCounter)
    case "knight":
      return new Knight(piece.pos, piece.color, piece.movesCounter)
    case "bishop":
      return new Bishop(piece.pos, piece.color, piece.movesCounter)
    case "queen":
      return new Queen(piece.pos, piece.color, piece.movesCounter)
    case "king":
      return new King(piece.pos, piece.color, piece.movesCounter)
    default:
      return null
  }
}