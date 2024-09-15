import styles from "./board.module.css"

// black pieces
import blackPawn from "../../assets/pieces/black/pawn.png"
import blackKnight from "../../assets/pieces/black/knight.png"
import blackBishop from "../../assets/pieces/black/bishop.png"
import blackRook from "../../assets/pieces/black/rook.png"
import blackQueen from "../../assets/pieces/black/queen.png"
import blackKing from "../../assets/pieces/black/king.png"
// white pieces
import whitePawn from "../../assets/pieces/white/pawn.png"
import whiteKnight from "../../assets/pieces/white/knight.png"
import whiteBishop from "../../assets/pieces/white/bishop.png"
import whiteRook from "../../assets/pieces/white/rook.png"
import whiteQueen from "../../assets/pieces/white/queen.png"
import whiteKing from "../../assets/pieces/white/king.png"

export default function Board() {

  const squares = [
    blackRook, blackKnight, blackBishop, blackQueen,
    blackKing, blackBishop, blackKnight, blackRook,
    blackPawn, blackPawn, blackPawn, blackPawn, blackPawn,
    blackPawn, blackPawn, blackPawn, null, null,
    null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null,
    null, null, null, whitePawn, whitePawn, whitePawn, whitePawn, whitePawn,
    whitePawn, whitePawn, whitePawn,
    whiteRook, whiteKnight, whiteBishop, whiteQueen,
    whiteKing, whiteBishop, whiteKnight, whiteRook,
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.board}>
        {squares.map((piece, index) => (
          <div
            key={index}
            className={Math.floor(index / 8) % 2 === index % 2 ? styles.whiteSquare : styles.blackSquare}
          >
            {piece ? (<img src={piece}></img>) : null}
          </div>
        ))}
      </div>
    </div >
  )
}
