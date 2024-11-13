import Piece from "./piece";
import posFromInd from "./position";

export default function initPieces(pieces: Map<string, Piece>): Map<string, Piece> {
  initPawns(pieces)
  initRooks(pieces)
  initKnights(pieces)
  initBishops(pieces)
  initQueens(pieces)
  initKings(pieces)
  return pieces
}

function initPawns(pieces: Map<string, Piece>) {
  for (let i = 1; i <= 8; i++) {
    let pos = posFromInd(1, i)
    pieces.set(pos, new Piece(pos, "pawn", "black"))

    pos = posFromInd(6, i)
    pieces.set(pos, new Piece(pos, "pawn", "white"))
  }
}

function initRooks(pieces: Map<string, Piece>) {
  const positions = [1, 8]

  for (let i = 0; i < 2; i++) {
    let pos = posFromInd(0, positions[i])
    pieces.set(pos, new Piece(pos, "rook", "black"))

    pos = posFromInd(7, positions[i])
    pieces.set(pos, new Piece(pos, "rook", "white"))
  }
}

function initKnights(pieces: Map<string, Piece>) {
  const positions = [2, 7]

  for (let i = 0; i < 2; i++) {
    let pos = posFromInd(0, positions[i])
    pieces.set(pos, new Piece(pos, "knight", "black"))

    pos = posFromInd(7, positions[i])
    pieces.set(pos, new Piece(pos, "knight", "white"))
  }
}

function initBishops(pieces: Map<string, Piece>) {
  const positions = [3, 6]

  for (let i = 0; i < 2; i++) {
    let pos = posFromInd(0, positions[i])
    pieces.set(pos, new Piece(pos, "bishop", "black"))

    pos = posFromInd(7, positions[i])
    pieces.set(pos, new Piece(pos, "bishop", "white"))
  }
}

function initQueens(pieces: Map<string, Piece>) {
  let pos = posFromInd(0, 4)
  pieces.set(pos, new Piece(pos, "queen", "black"))

  pos = posFromInd(7, 4)
  pieces.set(pos, new Piece(pos, "queen", "white"))
}

function initKings(pieces: Map<string, Piece>) {
  let pos = posFromInd(0, 5)
  pieces.set(pos, new Piece(pos, "king", "black"))

  pos = posFromInd(7, 5)
  pieces.set(pos, new Piece(pos, "king", "white"))
}