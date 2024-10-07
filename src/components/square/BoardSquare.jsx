import React from "react"
import styles from "./boardSquare.module.css"
import { useState } from "react"
import Piece from "../../game/pieces/piece"
import Position from "../../game/position"

/**
 * @typedef {Object} SquareProps 
 * @property {Piece | null} piece
 * @property {string} side
 * @property {Position} pos
 * @property {string} color 
 * @property {Function} onClickHandler 
 * @property {boolean} isSelected
 * @property {boolean} isAvailible
 * 
 * @param {SquareProps} props - The properties passed to the Square component.
 * @returns {JSX.Element}
 */
export default function BoardSquare(props) {
  function getClassName() {
    let className = ""
    if (props.isSelected) {
      return styles.selected
    } else {
      if (props.color === "white") {
        className += styles.white
      } else {
        className += styles.black
      }

      if (props.isAvailible) {
        if (!props.piece) {
          className += " " + styles.emptyAvailible
        } else {
          className += " " + styles.availible
        }
      }
    }
    return className
  }

  // function getIsGraggable() {
  //   if (!props.piece) {
  //     return false
  //   }
  //   return props.piece.color === props.side
  // }

  return (
    <div
      className={getClassName()}
      onClick={() => { props.onClickHandler(props.pos) }}
      draggable={false}
    >
      {props.piece && (
        <img
          src={props.piece ? props.piece.asset : ""}
          alt={props.piece.name}
          // onDrag={e => {
          //   e.dataTransfer.clearData()
          //   props.onClickHandler(props.pos)

          //   e.dataTransfer.setData("application/json", JSON.stringify({
          //     pos: props.piece?.pos,
          //     color: props.piece?.color,
          //   }))

          // }}
          draggable={false}
          className={props.piece?.color === props.side ? styles.drag : ""}
        />
      )}
    </div>
  )
}