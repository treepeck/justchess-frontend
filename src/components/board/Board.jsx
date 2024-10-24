import styles from "./board.module.css"
import BoardSquare from "../square/BoardSquare"
import React, { useState, useEffect } from "react"

import Square from "../../game/square"
import Piece from "../../game/pieces/piece"
import Position, { posFromStr } from "../../game/position"
import Move, { PossibleMove } from "../../game/move"

import buildPiece from "../../game/pieces/piecesBuilder"

/**
 * @typedef {Object} BoardProps 
 * @property {Function} handleTakeMove
 * @property {Map<string, Piece>} pieces
 * @property {string} side 
 * @property {string} currentTurn
 * @property {Map<PossibleMove, boolean>} validMoves
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

  /** @param {Square} square */
  function handleClickSquare(square) {
    if (selectedSquare && square.piece?.color !== props.side) {
      for (const [vm, _] of props.validMoves) {
        if (vm.from.toString() == selectedSquare?.pos.toString() &&
          vm.to.toString() == square.pos.toString()) {
          if (vm.moveType == "promotion") {
            // TODO: handle promotion
          }
          if (props.currentTurn === props.side) {
            props.handleTakeMove(new Move(vm.to, vm.from, ""))
          }
        }
      }
    } else {
      if (square.piece?.color === props.side) {
        setSelectedSquare(square)
      }
    }
  }

  function redrawBoard() {
    setSelectedSquare(null)

    const newBoard = []
    for (let i = 8; i >= 1; i--) {
      const row = []
      for (let j = 1; j <= 8; j++) {
        const pos = new Position(j, i)
        const color = (i + j) % 2 === 1 ? "white" : "black"
        const piece = props.pieces.get(pos.toString())
        row.push(new Square(piece, pos, color))
      }
      newBoard.push(row)
    }
    setBoard(newBoard)
  }

  /** 
   * @param {Position} to 
   * @param {Position} from 
   * @returns {boolean}
   */
  function isValidMove(to, from) {
    if (!from || !to) {
      return false
    }

    for (const [pm, _] of props.validMoves) {
      if (pm.to.file == to.file && pm.to.rank == to.rank &&
        pm.from.file == from.file && pm.from.rank == from.rank
      ) {
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
            key={square.pos.toString()}
            square={square}
            side={props.side}
            onClickHandler={() => handleClickSquare(square)}
            isSelected={
              // @ts-ignore at this case selectedSqaure can be a valid Square.
              selectedSquare?.pos.isEqual(square.pos) ?
                true : false
            }
            // @ts-ignore at this case selectedSqaure can be a valid Square.
            isAvailible={isValidMove(square.pos, selectedSquare?.pos)}
            onDropHandler={onDropPiece}
          />
        ))
        )}
      </div>
    </div>
  )
}
