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

  switch (piece.name) {
    case "pawn":
      return new Pawn(piece.pos, piece.color, piece.enPassant, piece.movesCounter)
    case "rook":
      return new Rook(piece.pos, piece.color)
    case "knight":
      return new Knight(piece.pos, piece.color)
    case "bishop":
      return new Bishop(piece.pos, piece.color)
    case "queen":
      return new Queen(piece.pos, piece.color)
    case "king":
      return new King(piece.pos, piece.color)
    default:
      return null
  }
}