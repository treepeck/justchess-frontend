import styles from "./boardSquare.module.css"
import Square from "../../game/square"

type SquareProps = {
  side: string,
  square: Square,
  onClickHandler: (pos: string) => void,
  isSelected: boolean,
  isAvailible: boolean,
}
export default function BoardSquare(props: SquareProps) {
  function getClassName(): string {
    let className = ""
    if (props.isSelected) {
      return styles.selected
    }

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
    return className
  }

  return (
    <div
      className={getClassName()}
      onClick={() => { props.onClickHandler(props.square.pos) }}
    >
      {props.square.piece && (
        <img
          src={props.square.piece.asset}
          alt={props.square.piece.type}
          draggable={false}
        />
      )}
    </div>
  )
}