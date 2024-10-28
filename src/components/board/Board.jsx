import styles from "./board.module.css"
import BoardSquare from "../square/BoardSquare"
import React, { useState, useEffect } from "react"

import Square from "../../game/square"
import Piece from "../../game/piece"
import { MoveDTO, PossibleMove } from "../../game/move"
import posFromInd from "../../game/position"

/**
 * @typedef {Object} BoardProps 
 * @property {Function} handleTakeMove
 * @property {Map<string, Piece>} pieces
 * @property {string} side 
 * @property {string} currentTurn
 * @property {PossibleMove[]} validMoves
 * 
 * @param {BoardProps} props - The properties passed to the Board component.
 * @returns {JSX.Element}
 */
export default function Board(props) {
  /**
  * Stores the currently selected square on the board.
  * @type {[Square | null, Function]} 
  */
  const [selectedSquare, setSelectedSquare] = useState(null)
  /**
  * Stores all visible squares.
  * @type {[Square[][] | null, Function]} 
  */
  const [board, setBoard] = useState([])

  // TODO: add a "Custom options" context which provides a board-orientation
  // property, color theme, last sidebar position etc... 

  useEffect(() => {
    redrawBoard()
  }, [props.pieces])

  function redrawBoard() {
    const newBoard = []
    if (props.side === "black") {
      for (let i = 8; i >= 1; i--) {
        const row = []
        for (let j = 1; j <= 8; j++) {
          const pos = posFromInd(i, j)
          const color = (i + j) % 2 === 1 ? "white" : "black"
          const piece = props.pieces.get(pos)
          row.push(new Square(piece, pos, color))
        }
        newBoard.push(row)
      }
    } else {
      for (let i = 1; i <= 8; i++) {
        const row = []
        for (let j = 1; j <= 8; j++) {
          const pos = posFromInd(i, j)
          const color = (i + j) % 2 === 1 ? "white" : "black"
          const piece = props.pieces.get(pos)
          row.push(new Square(piece, pos, color))
        }
        newBoard.push(row)
      }
    }
    setBoard(newBoard)
  }

  /** @param {Square} square */
  function handleClickSquare(square) {
    if (selectedSquare) {
      if (props.currentTurn !== props.side) {
        if (!square.piece) {
          setSelectedSquare(null)
        } else if (square.piece.color === props.side) {
          setSelectedSquare(square)
        }
        return
      }

      if (square.piece?.color === props.side) {
        setSelectedSquare(square)
        return
      }

      for (const vm of props.validMoves) {
        if (selectedSquare.pos === vm.from &&
          square.pos === vm.to) {
          if (vm.moveType == "promotion") {
            // TODO: handle promotion
          }
          props.handleTakeMove(new MoveDTO(vm.to, vm.from, ""))
          setSelectedSquare(null)
        }
      }
    } else {
      if (square.piece?.color === props.side) {
        setSelectedSquare(square)
      }
    }
  }

  /** 
   * @param {string} to 
   * @param {string} from 
   * @returns {boolean}
   */
  function isValidMove(to, from) {
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

  /**
   * @param {Square} dropSquare
   */
  function onDropPiece(dropSquare) {
    handleClickSquare(dropSquare)
  }

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.board} ${props.side === "black" ?
          styles.sideBlack : null}`}
      >
        {board.map(row => row.map((square) => (
          <BoardSquare
            key={square.pos}
            square={square}
            side={props.side}
            onClickHandler={() => handleClickSquare(square)}
            isSelected={
              // @ts-ignore at this case selectedSqaure can be a valid Square.
              selectedSquare?.pos === square.pos ?
                true : false
            }
            // @ts-ignore at this case selectedSqaure can be a valid Square.
            isAvailible={isValidMove(square.pos, selectedSquare?.pos)}
            onDropHandler={onDropPiece}
          />
        ))
        )}
      </div>
    </div >
  )
}
