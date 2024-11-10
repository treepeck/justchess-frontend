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
    pieces.set(pos, new Piece("pawn", "black"))

    pos = posFromInd(6, i)
    pieces.set(pos, new Piece("pawn", "white"))
  }
}

function initRooks(pieces: Map<string, Piece>) {
  const positions = [1, 8]

  for (let i = 0; i < 2; i++) {
    let pos = posFromInd(0, positions[i])
    pieces.set(pos, new Piece("rook", "black"))

    pos = posFromInd(7, positions[i])
    pieces.set(pos, new Piece("rook", "white"))
  }
}

function initKnights(pieces: Map<string, Piece>) {
  const positions = [2, 7]

  for (let i = 0; i < 2; i++) {
    let pos = posFromInd(0, positions[i])
    pieces.set(pos, new Piece("knight", "black"))

    pos = posFromInd(7, positions[i])
    pieces.set(pos, new Piece("knight", "white"))
  }
}

function initBishops(pieces: Map<string, Piece>) {
  const positions = [3, 6]

  for (let i = 0; i < 2; i++) {
    let pos = posFromInd(0, positions[i])
    pieces.set(pos, new Piece("bishop", "black"))

    pos = posFromInd(7, positions[i])
    pieces.set(pos, new Piece("bishop", "white"))
  }
}

function initQueens(pieces: Map<string, Piece>) {
  let pos = posFromInd(0, 4)
  pieces.set(pos, new Piece("queen", "black"))

  pos = posFromInd(7, 4)
  pieces.set(pos, new Piece("queen", "white"))
}

function initKings(pieces: Map<string, Piece>) {
  let pos = posFromInd(0, 5)
  pieces.set(pos, new Piece("king", "black"))

  pos = posFromInd(7, 5)
  pieces.set(pos, new Piece("king", "white"))
}