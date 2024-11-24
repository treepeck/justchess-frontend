import "./BoardPiece.css"
import { useRef, useState } from "react"
import assets from "../../assets/pieces/pieces"
import Piece from "../../game/piece"
import ReactDOM from "react-dom"

type PieceProps = {
  style: React.CSSProperties
  side: string
  piece: Piece
  onClickHandler: (p: Piece) => void
  handleMove: (from: string, to: string) => void
}

export default function BoardPiece({ style, piece, onClickHandler,
  handleMove, side }: PieceProps) {

  const [position, setPosition] = useState({ left: 0, top: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const pieceRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const currentDroppable = useRef<HTMLDivElement | null>(null)

  function onDragStart(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    onClickHandler(piece)

    pieceRef.current = e.currentTarget
    pieceRef.current.style.zIndex = "1200"
    const r = pieceRef.current.getBoundingClientRect()
    setSize({ width: r.width, height: r.height })

    setPosition({
      left: e.pageX - pieceRef.current.offsetWidth / 2,
      top: e.pageY - pieceRef.current.offsetHeight / 2,
    })

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onDragEnd)
    setIsDragging(true)
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
        handleMove(piece.pos, move)
      }
    }

    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onDragEnd)
  }

  if (isDragging) {
    return ReactDOM.createPortal(
      <div
        ref={pieceRef}
        className="piece"
        style={{
          left: `${position.left}px`,
          top: `${position.top}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        draggable={false}
      >
        <img
          // @ts-ignore 
          src={assets[`${piece.color}${piece.type}`]}
          alt={`${piece.color}${piece.type}`}
          draggable={false}
        />
      </div>
      , document.body)
  }

  return (
    <div
      className="piece"
      style={{
        transform: style["transform"]
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
    </div>
  )
}