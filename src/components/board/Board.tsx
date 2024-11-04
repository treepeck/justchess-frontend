import styles from "./board.module.css"
import BoardSquare from "../square/BoardSquare"
import { useState, useEffect } from "react"

import Square from "../../game/square"
import Piece from "../../game/piece"
import { MoveDTO, PossibleMove } from "../../game/move"
import posFromInd, { posFromString } from "../../game/position"
// import PieceSelection from "../piece-selection/PieceSelection"

type BoardProps = {
  handleTakeMove: (m: MoveDTO) => void,
  pieces: Map<string, Piece>,
  side: string,
  currentTurn: string,
  validMoves: PossibleMove[]
}

export default function Board(props: BoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [board, setBoard] = useState<Square[][]>([])
  const [lastMove, setLastMove] = useState<MoveDTO | null>(null)
  // Is piece selection window active.
  const [isPSWA, setIsPSWA] = useState<boolean>(false)

  useEffect(() => {
    redrawBoard()
  }, [props.pieces])

  function redrawBoard() {
    const newBoard = []
    for (let i = 1; i <= 8; i++) {
      const row = []
      for (let j = 1; j <= 8; j++) {
        const pos = posFromInd(i, j)
        const color = (i + j) % 2 === 1 ? "black" : "white"
        const piece = props.pieces.get(pos)
        row.push(new Square(piece, pos, color))
      }
      newBoard.push(row)
    }
    setBoard(newBoard)
  }

  function handleClickSquare(s: Square) {
    if (!selectedSquare) {
      if (s.piece?.color === props.side) {
        setSelectedSquare(s)
      }
      return
    }

    if (props.currentTurn !== props.side) {
      // TODO: handle premoves
      setSelectedSquare(null)
      return
    }

    if (s.piece?.color === props.side) {
      setSelectedSquare(s)
      return
    }

    for (const vm of props.validMoves) {
      if (selectedSquare.pos !== vm.from ||
        s.pos !== vm.to) {
        continue
      }

      setSelectedSquare(null)

      if (vm.moveType === 7) { // promotion
        setIsPSWA(true)
        setLastMove(new MoveDTO(vm.to, vm.from, ""))
        return
      }

      props.handleTakeMove(new MoveDTO(vm.to, vm.from, ""))
    }
  }

  function handlePromotion(pp: string) {
    if (lastMove) {
      props.handleTakeMove(new MoveDTO(lastMove.to, lastMove.from, pp))
    }
  }

  function isValidMove(to: string, from: string | undefined): boolean {
    if (!from || !to) {
      return false
    }

    for (const m of props.validMoves) {
      if (m.to == to && m.from == from) {
        return true
      }
    }
    return false
  }

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.board} ${props.side === "black" ?
          styles.sideBlack : styles.sideWhite}`
        }
      >
        <ul className={styles.ranks}>
          {ranks.map(rank => (
            <li key={rank}>
              {rank}
            </li>
          ))}
        </ul>
        <ul className={styles.files}>
          {files.map(file => (
            <li key={file}>
              {file}
            </li>
          ))}
        </ul>
        {/* {isPSWA && (
          <PieceSelection
            // styles=
            onSelect={handlePromotion}
            setIsActive={setIsPSWA}
            //@ts-ignore
            positionFile={posFromString(lastMove?.to).file}
            side={props.side}
          />
        )} */}
        <div className={styles.squares}>
          {board.map(row => row.map((square) => (
            <BoardSquare
              key={square.pos}
              square={square}
              side={props.side}
              onClickHandler={() => handleClickSquare(square)}
              isSelected={
                selectedSquare?.pos === square.pos ?
                  true : false
              }
              isAvailible={isValidMove(square.pos, selectedSquare?.pos)}
            />
          )))}
        </div>
      </div>
    </div >
  )
}
