import { useEffect, useRef, useState } from "react"
import assets from "../../assets/pieces/pieces"
import Piece from "../../game/piece"
import { posFromString } from "../../game/position"
import styles from "./boardPiece.module.css"
import { PossibleMove } from "../../game/move"

type PieceProps = {
  pos: string
  side: string
  piece: Piece
  onClickHandler: (p: Piece) => void
  handleMove: (m: PossibleMove) => void
}

export default function BoardPiece({ pos, piece, onClickHandler,
  handleMove, side }: PieceProps) {

  const [position, setPosition] = useState({ left: 0, top: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const pieceRef = useRef<HTMLDivElement | null>(null)
  const currentDroppable = useRef<HTMLDivElement | null>(null)

  const [file, setFile] = useState<number>(posFromString(pos).file)
  const [rank, setRank] = useState<number>(posFromString(pos).rank)

  useEffect(() => {
    const newPos = posFromString(pos)
    setFile(newPos.file)
    setRank(newPos.rank)
  }, [pos])

  function transform(): string {
    if (side === "white") {
      return `translate(calc(5rem * ${file - 1}), calc(5rem * ${8 - rank}))`
    }
    return `translate(calc(35rem - (5rem * ${file - 1})), calc(5rem * ${rank - 1}))`
  }

  function onDragStart(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    onClickHandler(piece)
    setIsDragging(true)

    pieceRef.current = e.currentTarget
    pieceRef.current.style.zIndex = "1200"

    setPosition({
      left: e.pageX - pieceRef.current.offsetWidth / 2,
      top: e.pageY - pieceRef.current.offsetHeight / 2,
    })

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onDragEnd)
  }

  function onMouseMove(e: MouseEvent) {
    if (!pieceRef.current) {
      return
    }
    setPosition({
      left: e.pageX - pieceRef.current.offsetWidth / 2,
      top: e.pageY - pieceRef.current.offsetHeight / 2,
    })

    // check if valid square is under the piece
    pieceRef.current.hidden = true
    const elBelow = document.elementFromPoint(e.clientX, e.clientY)
    pieceRef.current.hidden = false

    if (!elBelow) {
      return
    }

    const droppable = elBelow.closest(".availible, .capture")

    if (currentDroppable.current != droppable) {
      // leave droppable area
      if (currentDroppable.current) {
        currentDroppable.current.style.backgroundColor = ""
      }
      currentDroppable.current = droppable as HTMLDivElement | null
      // enter droppable area
      if (currentDroppable.current) {
        currentDroppable.current.style.backgroundColor = "rgb(130, 151, 105, 40%)"
      }
    }
  }

  function onDragEnd() {
    setIsDragging(false)
    if (pieceRef.current) {
      pieceRef.current.style.zIndex = "1000"
    }
    pieceRef.current = null

    if (currentDroppable.current) {
      const move = currentDroppable.current.getAttribute("data-payload")
      if (move) {
        handleMove(JSON.parse(move))
      }
    }

    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onDragEnd)
  }

  return (
    <div
      className={styles.piece}
      style={{
        transform: isDragging ? "none" : transform(),
        left: isDragging ? `${position.left}px` : undefined,
        top: isDragging ? `${position.top}px` : undefined,
      }}
      onMouseDown={side === piece.color ? e => onDragStart(e) : undefined}
      draggable={false}
    >
      <img
        // @ts-ignore 
        src={assets[`${piece.color}${piece.type}`]}
        alt={`${piece.color}${piece.type}`}
        draggable={false}
      />
    </ div >
  )
}