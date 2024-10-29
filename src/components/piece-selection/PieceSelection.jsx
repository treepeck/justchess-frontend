import React from "react"
import styles from "./pieceSelection.module.css"
import assets from "../../assets/pieces/pieces"

/**
 * @typedef {Object} Props
 * @property {Function} onSelect - Callback when the piece is selected. 
 * @property {string} side - Player side.
 * @property {Function} setIsActive
 * @property {number} positionFile - on which file will window appear.  
 * 
 * @param {Props} props 
 * @returns {JSX.Element}
 */
export default function PieceSelection(props) {
  const pieces = ["queen", "knight", "rook", "bishop"]

  function sda() {
    console.log(props.positionFile)
    console.log(`calc(${props.positionFile - 1}rem * 5)`)
    return `calc(${(props.positionFile - 1)}rem * 5)`
  }

  return (
    <div className={styles.container} onClick={() => props.setIsActive(false)}>
      <div
        className={styles.content}
        style={{
          marginLeft: sda()
        }}
      >
        {pieces.map(piece => (
          <img
            key={piece}
            src={assets[`${props.side}${piece}`]}
            alt={`${piece}`}
            onClick={() => props.onSelect(piece)}
          />
        ))}
      </div>
    </div >
  )
}

