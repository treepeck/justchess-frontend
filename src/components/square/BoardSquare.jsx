import React from "react"
import styles from "./boardSquare.module.css"
import Square from "../../game/square"

/**
 * @typedef {Object} SquareProps 
 * @property {string} side
 * @property {Square} square
 * @property {Function} onClickHandler 
 * @property {boolean} isSelected
 * @property {boolean} isAvailible
 * @property {Function} onDropHandler  
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
      if (props.square.color === "white") {
        className += styles.white
      } else {
        className += styles.black
      }

      if (props.isAvailible) {
        if (!props.square.piece) {
          className += " " + styles.emptyAvailible
        } else {
          className += " " + styles.availible
        }
      }
    }
    return className
  }

  function getIsDraggable() {
    if (!props.square.piece) {
      return false
    }
    return props.square.piece.color === props.side
  }

  return (
    <div
      className={getClassName()}
      onClick={() => { props.onClickHandler(props.square.pos) }}
      onDrop={() => {
        props.onDropHandler(props.square)
      }}
      onDragOver={e => { e.preventDefault() }}
    >
      {props.square.piece && (
        <img
          src={props.square.piece ? props.square.piece.asset : ""}
          alt={props.square.piece.type}
          draggable={getIsDraggable()}
          onDragStart={(e) => {
            e.dataTransfer.clearData()
            props.onClickHandler(props.square.pos)
          }}
        />
      )}
    </div>
  )
}