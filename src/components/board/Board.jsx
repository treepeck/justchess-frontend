import styles from "./board.module.css"
import Square from "../Square/Square"
import { useState, useEffect } from "react"

import { useConnection } from "../../context/connection"

import getAvailibleMoves from "../../game/moves"

export default function Board({ pieces, side }) {

  const { ws } = useConnection()

  const [selectedSquare, setSelectedSquare] = useState()
  const [availibleMoves, setAvailibleMoves] = useState([])
  const [board, setBoard] = useState([])

  const [orientation, setOrientation] = useState(side)

  // TODO: add a "Custom options" context which provides a board-orientation
  // property, color theme, last sidebar position etc... 

  useEffect(() => {
    redrawBoard()
  }, [pieces])

  function handleClickSquare(square) {
    if (selectedSquare && square.piece?.color !== side) {
      if (square.isAvailible) {
        ws.move(selectedSquare, square.pos)
      } else {
        setSelectedSquare()
        setAvailibleMoves([])
      }
    } else {
      if (square.piece?.color === side) {
        setSelectedSquare(square.pos)
        const moves = getAvailibleMoves(pieces, square.piece)
        setAvailibleMoves(moves)
      }
    }
  }

  function posFromInd(i, j) {
    const pos = { file: 0, rank: 0 }
    switch (j) {
      case 0:
        pos.file = "a"
        break
      case 1:
        pos.file = "b"
        break
      case 2:
        pos.file = "c"
        break
      case 3:
        pos.file = "d"
        break
      case 4:
        pos.file = "e"
        break
      case 5:
        pos.file = "f"
        break
      case 6:
        pos.file = "g"
        break
      case 7:
        pos.file = "h"
        break
      default:
        return
    }
    pos.rank = 8 - i
    return pos
  }

  function redrawBoard() {
    const newBoard = []
    for (let i = 0; i < 8; i++) {
      const row = []
      for (let j = 0; j < 8; j++) {
        const pos = posFromInd(i, j)
        const color = (i + j) % 2 === 1 ? "black" : "white"
        const posStr = `${pos.file}${pos.rank}`
        const piece = pieces[posStr] ? pieces[posStr] : null
        row.push({ pos: pos, color: color, piece: piece, isAvailible: false })
      }
      newBoard.push(row)
    }
    setBoard(newBoard)
  }

  return (
    <div className={styles.layout}>
      <div className={`${styles.board} ${orientation === "white" ? styles.sideWhite : styles.sideBlack}`}>
        {board.map(row => row.map((square, ind) => (
          <Square
            key={ind}
            piece={square.piece}
            pos={square.pos}
            color={square.color}
            onClickHandler={() => handleClickSquare(square)}
            isSelected={
              selectedSquare?.file === square.pos.file &&
                selectedSquare?.rank === square.pos.rank ?
                true : false
            }
            isAvailible={
              availibleMoves?.find((p) => {
                square.isAvailible = false
                if (p.file === square.pos.file &&
                  p.rank === square.pos.rank
                ) {
                  square.isAvailible = true
                  return true
                }
                return false
              }) ? true : false
            }
          />
        ))
        )}
      </div>
    </div>
  )
}
