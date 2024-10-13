import styles from "./board.module.css"
import BoardSquare from "../square/BoardSquare"
import React, { useState, useEffect } from "react"

import Square from "../../game/square"
import Piece from "../../game/pieces/piece"
import Position from "../../game/position"
import Move, { MoveType } from "../../game/move"

import buildPiece from "../../game/pieces/piecesBuilder"

/**
 * @typedef {Object} BoardProps 
 * @property {Function} handleTakeMove
 * @property {Map<string, Piece>} pieces
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
   * Stores all availible to move squares on the board.
   * @type {[Map<string, MoveType> | null, Function]} 
   */
  const [possibleMoves, setPossibleMoves] = useState(null)
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
      const move = possibleMoves?.get(square.pos.toString())
      if (!move) {
        return
      }
      if (move !== MoveType.Defend) {
        if (move === MoveType.Promotion) {
          // TODO: handle Promotion case
        }
        if (props.currentTurn === props.side) {
          props.handleTakeMove(new Move(square.pos, selectedSquare.pos,
            "",
          ))
        }
      } else {
        setSelectedSquare(null)
        setPossibleMoves(null)
      }
    } else {
      if (square.piece?.color === props.side) {
        setSelectedSquare(square)
        setPossibleMoves(square.piece.getPossibleMoves(props.pieces))
      }
    }
  }

  function redrawBoard() {
    setPossibleMoves(null)
    setSelectedSquare(null)

    const newBoard = []
    for (let i = 8; i >= 1; i--) {
      const row = []
      for (let j = 1; j <= 8; j++) {
        const pos = new Position(j, i)
        const color = (i + j) % 2 === 1 ? "white" : "black"
        const piece = buildPiece(props.pieces.get(pos.toString()))
        row.push(new Square(piece, pos, color))
      }
      newBoard.push(row)
    }
    setBoard(newBoard)
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
        {board.map(row => row.map((square, ind) => (
          <BoardSquare
            key={ind}
            square={square}
            side={props.side}
            onClickHandler={() => handleClickSquare(square)}
            isSelected={
              // @ts-ignore
              // at this case selectedSqaure can be a valid Square.
              selectedSquare?.pos.toString() === square.pos.toString() ?
                true : false
            }
            isAvailible={
              // @ts-ignore
              possibleMoves?.get(square.pos.toString()) &&
                // @ts-ignore
                possibleMoves?.get(square.pos.toString()) !== MoveType.Defend ?
                true : false
            }
            onDropHandler={onDropPiece}
          />
        ))
        )}
      </div>
    </div>
  )
}
