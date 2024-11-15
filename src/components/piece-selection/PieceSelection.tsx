import styles from "./pieceSelection.module.css"
import assets from "../../assets/pieces/pieces"

type PieceSelectionProps = {
  onSelect: (p: string) => void,
  side: string,
  setIsActive: (ia: boolean) => void,
  posFile: number
}

export default function PieceSelection(props: PieceSelectionProps) {
  const pieces = ["queen", "knight", "rook", "bishop"]

  return (
    <div className={styles.container} onClick={() => props.setIsActive(false)}>
      <div
        className={styles.content}
        style={{
          marginLeft: `calc(${(props.posFile - 1)}rem * 5)`
        }}
      >
        {pieces.map(piece => (
          <img
            key={piece}
            // @ts-ignore
            src={assets[`${props.side}${piece}`]}
            alt={`${piece}`}
            onClick={() => props.onSelect(piece)}
          />
        ))}
      </div>
    </div >
  )
}