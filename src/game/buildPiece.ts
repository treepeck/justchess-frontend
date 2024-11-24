import Piece from "./piece";

export default function buildPiece(p: string, type: string): Piece {
  switch (type) {
    // white pieces
    case "P": // pawn
      return new Piece(p, "♙", "white")
    case "N": // knight
      return new Piece(p, "♘", "white")
    case "B": // bishop
      return new Piece(p, "♗", "white")
    case "R": // rook
      return new Piece(p, "♖", "white")
    case "Q": // queen
      return new Piece(p, "♕", "white")
    case "K": // king
      return new Piece(p, "♔", "white")
    // black pieces
    case "p": // pawn
      return new Piece(p, "♙", "black")
    case "n": // knight
      return new Piece(p, "♘", "black")
    case "b": // bishop
      return new Piece(p, "♗", "black")
    case "r": // rook
      return new Piece(p, "♖", "black")
    case "q": // queen
      return new Piece(p, "♕", "black")
    case "k": // king
      return new Piece(p, "♔", "black")
    default:
      throw new Error("unknown piece")
  }
}