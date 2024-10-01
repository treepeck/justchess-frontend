import styles from "./board.module.css"
import BoardSquare from "../square/BoardSquare"
import React, { useState, useEffect } from "react"

import Square from "../../game/square"
import Piece from "../../game/pieces/piece"
import Position from "../../game/position"

import buildPiece from "../../game/pieces/piecesBuilder"

/**
 * @typedef {Object} BoardProps 
 * @property {Function} handleTakeMove
 * @property {Object.<string, Piece>} pieces
 * @property {string} side 
 * @property {string} currentTurn
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
   * Stores all availible squares on the board.
   * @type {[string[] | null, Function]} 
   */
  const [availibleMoves, setAvailibleMoves] = useState(null)
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
    debugger
    if (selectedSquare && square.piece?.color !== props.side) {
      if (square.isAvailible && props.currentTurn === props.side) {
        props.handleTakeMove(selectedSquare.pos, square.pos)
      } else {
        setSelectedSquare(null)
        setAvailibleMoves([])
      }
    } else {
      if (square.piece?.color === props.side) {
        setSelectedSquare(square)
        setAvailibleMoves(square.piece.getAvailibleMoves(props.pieces))
      }
    }
  }

  function redrawBoard() {
    debugger
    if (!props.pieces) {
      return
    }

    setAvailibleMoves(null)
    setSelectedSquare(null)

    const newBoard = []
    for (let i = 8; i >= 1; i--) {
      const row = []
      for (let j = 1; j <= 8; j++) {
        const pos = new Position(j, i)
        const color = (i + j) % 2 === 1 ? "white" : "black"
        const piece = buildPiece(props.pieces[pos.toString()])
        row.push(new Square(piece, pos, color, false, false))
      }
      newBoard.push(row)
    }
    setBoard(newBoard)
  }

  return (
    <div className={styles.layout}>
      <div className={`${styles.board} ${props.side === "black" ?
        styles.sideBlack : null}`
      }>
        {board.map(row => row.map((square, ind) => (
          <BoardSquare
            key={ind}
            piece={square.piece}
            pos={square.pos}
            color={square.color}
            onClickHandler={() => handleClickSquare(square)}
            isSelected={
              // @ts-ignore
              // at this case selectedSqaure can be a valid Square.
              selectedSquare?.pos.toString() === square.pos.toString() ?
                true : false
            }
            isAvailible={
              // @ts-ignore
              // at this case selectedSqaure can be a valid Square[][].
              availibleMoves?.find((p) => {
                square.isAvailible = false
                if (p === square.pos.toString()) {
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
