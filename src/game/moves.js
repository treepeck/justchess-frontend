const files = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
  5: "e",
  6: "f",
  7: "g",
  8: "h",
  "a": 1,
  "b": 2,
  "c": 3,
  "d": 4,
  "e": 5,
  "f": 6,
  "g": 7,
  "h": 8
}

function isInBoard(pos) {
  if (pos === undefined || pos.file === undefined) {
    return false
  }
  return pos.rank >= 1 && pos.rank <= 8
}

function isSquareEmpty(pieces, pos) {
  return isInBoard(pos) && (pieces[posToStr(pos)] === undefined)
}

function canBeCaptured(pieces, pos, side) {
  if (isSquareEmpty(pieces, pos) || !isInBoard(pos)) {
    return false
  }
  const piece = pieces[posToStr(pos)]
  return piece.color !== side && piece.name !== "king"
}

function posToStr(pos) {
  return `${pos.file}${pos.rank}`
}

function pawnMoves(pieces, pawn) {
  let dir = 1
  if (pawn.color === "black") {
    dir = -1
  }

  const availibleMoves = []
  // check if can move directly
  let nextMove = { file: pawn.pos.file, rank: pawn.pos.rank + dir }
  if (isSquareEmpty(pieces, nextMove)) {
    availibleMoves.push(nextMove)

    if (!pawn.hasMoved) {
      nextMove = { file: pawn.pos.file, rank: pawn.pos.rank + dir * 2 }
      if (isSquareEmpty(pieces, nextMove)) {
        availibleMoves.push(nextMove)
      }
    }
  }

  // check if can capture diagonally
  let leftFile, rightFile
  for (let key in files) {
    if (files[key] == pawn.pos.file) {
      leftFile = files[key - 1]
      rightFile = files[key + 1]
    }
  }
  if (leftFile) {
    nextMove = { file: files[leftFile], rank: pawn.pos.rank + dir }
    if (canBeCaptured(pieces, nextMove, pawn.color)) {
      availibleMoves.push(nextMove)
    }
  }
  if (rightFile) {
    nextMove = { file: files[rightFile], rank: pawn.pos.rank + dir }
    if (canBeCaptured(pieces, nextMove, pawn.color)) {
      availibleMoves.push(nextMove)
    }
  }

  return availibleMoves
}

function rookMoves(pieces, rook) {
  const availibleMoves = []
  // calculate availible up moves
  for (let i = rook.pos.rank - 1; i >= 1; i--) {
    let nextMove = { file: rook.pos.file, rank: i }
    if (isSquareEmpty(pieces, nextMove)) {
      availibleMoves.push(nextMove)
      continue
    } else if (canBeCaptured(pieces, nextMove, rook.color)) {
      availibleMoves.push(nextMove)
    }
    break
  }

  // calculate availible bottom moves
  for (let i = rook.pos.rank + 1; i <= 8; i++) {
    let nextMove = { file: rook.pos.file, rank: i }
    if (isSquareEmpty(pieces, nextMove)) {
      availibleMoves.push(nextMove)
      continue
    } else if (canBeCaptured(pieces, nextMove, rook.color)) {
      availibleMoves.push(nextMove)
    }
    break
  }

  // calculate availible right moves
  for (let i = files[rook.pos.file] + 1; i <= 8; i++) {
    let nextMove = { file: files[i], rank: rook.pos.rank }
    if (isSquareEmpty(pieces, nextMove)) {
      availibleMoves.push(nextMove)
      continue
    } else if (canBeCaptured(pieces, nextMove, rook.color)) {
      availibleMoves.push(nextMove)
    }
    break
  }

  // calculate availible left moves
  for (let i = files[rook.pos.file] - 1; i >= 1; i--) {
    let nextMove = { file: files[i], rank: rook.pos.rank }
    if (isSquareEmpty(pieces, nextMove)) {
      availibleMoves.push(nextMove)
      continue
    } else if (canBeCaptured(pieces, nextMove, rook.color)) {
      availibleMoves.push(nextMove)
    }
    break
  }
  return availibleMoves
}

function bishopMoves(pieces, bishop) {
  const availibleMoves = []

  // upper left diagonal
  let rank = bishop.pos.rank
  for (let i = files[bishop.pos.file] - 1; i >= 1; i--) {
    let nextMove = { file: files[i], rank: rank + 1 }
    rank++
    if (isSquareEmpty(pieces, nextMove)) {
      availibleMoves.push(nextMove)
      continue
    } else if (canBeCaptured(pieces, nextMove, bishop.color)) {
      availibleMoves.push(nextMove)
    }
    break
  }

  // lower left diagonal
  rank = bishop.pos.rank
  for (let i = files[bishop.pos.file] - 1; i >= 1; i--) {
    let nextMove = { file: files[i], rank: rank - 1 }
    rank--
    if (isSquareEmpty(pieces, nextMove)) {
      availibleMoves.push(nextMove)
      continue
    } else if (canBeCaptured(pieces, nextMove, bishop.color)) {
      availibleMoves.push(nextMove)
    }
    break
  }

  // upper right diagonal
  rank = bishop.pos.rank
  for (let i = files[bishop.pos.file] + 1; i <= 8; i++) {
    let nextMove = { file: files[i], rank: rank + 1 }
    rank++
    if (isSquareEmpty(pieces, nextMove)) {
      availibleMoves.push(nextMove)
      continue
    } else if (canBeCaptured(pieces, nextMove, bishop.color)) {
      availibleMoves.push(nextMove)
    }
    break
  }

  // lower right diagonal
  rank = bishop.pos.rank
  for (let i = files[bishop.pos.file] + 1; i <= 8; i++) {
    let nextMove = { file: files[i], rank: rank - 1 }
    rank--
    if (isSquareEmpty(pieces, nextMove)) {
      availibleMoves.push(nextMove)
      continue
    } else if (canBeCaptured(pieces, nextMove, bishop.color)) {
      availibleMoves.push(nextMove)
    }
    break
  }

  return availibleMoves
}

function knightMoves(pieces, knight) {
  const availibleMoves = []

  const possibleMoves = [
    { file: files[files[knight.pos.file] - 1], rank: knight.pos.rank + 2 },
    { file: files[files[knight.pos.file] - 2], rank: knight.pos.rank + 1 },
    { file: files[files[knight.pos.file] - 1], rank: knight.pos.rank - 2 },
    { file: files[files[knight.pos.file] - 2], rank: knight.pos.rank - 1 },
    { file: files[files[knight.pos.file] + 1], rank: knight.pos.rank + 2 },
    { file: files[files[knight.pos.file] + 2], rank: knight.pos.rank + 1 },
    { file: files[files[knight.pos.file] + 1], rank: knight.pos.rank - 2 },
    { file: files[files[knight.pos.file] + 2], rank: knight.pos.rank - 1 },
  ]

  for (let i = 0; i < possibleMoves.length; i++) {
    const pos = possibleMoves[i]
    if (isSquareEmpty(pieces, pos) || canBeCaptured(pieces, pos, knight.color)) {
      availibleMoves.push(possibleMoves[i])
    }
  }

  return availibleMoves
}

export default function getAvailibleMoves(pieces, piece) {
  switch (piece.name) {
    case "pawn":
      return pawnMoves(pieces, piece)
    case "rook":
      return rookMoves(pieces, piece)
    case "knight":
      return knightMoves(pieces, piece)
    case "bishop":
      return bishopMoves(pieces, piece)
    case "queen":
      return [...rookMoves(pieces, piece), ...bishopMoves(pieces, piece)]
    case "king":
      return null
  }
}