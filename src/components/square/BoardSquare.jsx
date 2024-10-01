import React from "react"
import styles from "./boardSquare.module.css"
import { useEffect, useState } from "react"

export default function BoardSquare({ piece, pos, color, onClickHandler, isSelected, isAvailible }) {

  const [asset, setAsset] = useState(null)

  useEffect(() => {
    if (piece) {
      const fetchAsset = async () => {
        try {
          const res = await
            import(`../../assets/pieces/${piece.color}/${piece.name}.png`)
          setAsset(res.default)
        } catch (err) {
          console.log(err)
        }
      }

      fetchAsset()
    }
  }, [piece])

  function getClassName() {
    let className = ""
    if (isSelected) {
      return styles.selected
    } else {
      if (color === "white") {
        className += styles.white
      } else {
        className += styles.black
      }

      if (isAvailible) {
        if (!piece) {
          className += " " + styles.emptyAvailible
        } else {
          className += " " + styles.availible
        }
      }
    }
    return className
  }

  return (
    <div
      className={
        getClassName()
      }
      onClick={() => { onClickHandler(pos) }}
    >
      {piece && (
        <img
          src={asset ? asset : ""}
          alt={piece.name}
        />
      )}
    </div>
  )
}