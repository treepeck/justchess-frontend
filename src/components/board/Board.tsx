// Misc
import "./Board.css"
import assets from "../../assets/pieces/pieces"
import { useEffect, useRef, useState } from "react"
import background from "../../assets/background.png"
// Components
import BoardPiece from "../piece/BoardPiece"
import PieceSelection from "../piece-selection/PieceSelection"
// Main logic
import Piece from "../../game/piece"
import initPieces from "../../game/initPieces"
import buildPiece from "../../game/buildPiece"
import Move, { MoveDTO } from "../../game/move"
import { posFromString, posToString } from "../../game/position"

type BoardProps = {
  side: string
  lastMove: Move
  validMoves: Record<string, string>
  onMove: (m: MoveDTO) => void
}

export default function Board({ side, lastMove,
  validMoves, onMove }: BoardProps) {
  // pieces on a board.
  const [pieces, setPieces] = useState<Map<string, Piece>>(initPieces())
  const [selected, setSelected] = useState<string | null>(null) // Selected piece position.
  const [promotionMove, setPromotionMove] = useState<MoveDTO | null>(null)
  // Is piece selection window active.
  const [isPSWA, setIsPSWA] = useState<boolean>(false)

  const boardRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ width: number, height: number }>
    ({ width: 0, height: 0 })

  useEffect(() => {
    // get board size in pixels to correctly position pieces.
    const updateSize = () => {
      if (boardRef.current) {
        const { width, height } = boardRef.current.getBoundingClientRect()
        setSize({ width: width, height: height })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)

    return () => {
      window.removeEventListener("resize", updateSize)
    }
  }, [])

  // Handle last move.
  useEffect(() => {
    if (!lastMove) {
      return
    }

    // Parse FEN into pieces.
    setPieces(_ => {
      const newPieces = new Map<string, Piece>()
      const rows = lastMove.fen.split("/")
      for (let i = 8; i >= 1; i--) {
        let row = rows.shift()
        if (!row) {
          break
        }
        for (let j = 1; j <= 8; j++) {
          const pos = posToString(j, i)
          const nextChar = row[0]
          row = row.substring(1)
          if (!nextChar) {
            break
          }
          if (!Number.isNaN(Number.parseInt(nextChar))) {
            j += Number.parseInt(nextChar) - 1
          } else {
            newPieces.set(pos, buildPiece(pos, nextChar))
          }
        }
      }
      return newPieces
    })
  }, [lastMove])

  function handleClickPiece(p: Piece) {
    if (p.color === side) {
      setSelected(_ => {
        return p.pos
      })
    }
  }

  function handlePromotion(pp: string) {
    if (promotionMove) {
      onMove(new MoveDTO(promotionMove.to, promotionMove.from, pp))
    }
  }

  // findVMForSelectedPiece finds valid moves for the piece on a 
  // selected square.
  function findVMForSelectedPiece(moves: Record<string, string>): string[] {
    if (!selected || !moves[selected]) {
      return []
    }
    const pos: string[] = []
    for (let i = 0; i < moves[selected].length; i += 2) {
      pos.push(moves[selected].slice(i, i + 2))
    }
    return pos
  }

  function move(from: string, to: string) {
    if ((to[1] == "1" || to[1] == "8") &&
      pieces.get(from)?.type == "♙") { // promotion
      setPromotionMove(new MoveDTO(to, from, ""))
      setIsPSWA(true)
      return
    }
    onMove(new MoveDTO(to, from, ""))
    setSelected(null)
  }

  function transform(pos: { file: number, rank: number }): string {
    const sw = size.width / 8 // square width 
    const sh = size.height / 8 // square height

    if (side === "white") {
      return `translate(${sw * (pos.file - 1)}px, ${sh * (8 - pos.rank)}px)`
    }
    return `translate(${sw * 8 - (sw * pos.file - 1)}px, ${sh * (pos.rank - 1)}px)`
  }

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  return (
    <div
      ref={boardRef}
      className={`board ${side === "black" ? "sideBlack" : ""}`}
      style={{ backgroundImage: `url(${background})` }} // TODO: replace with css variable
    >
      {Array.from(pieces).map(([pos, piece]) => (
        <BoardPiece
          key={pos}
          side={side}
          piece={piece}
          onClickHandler={handleClickPiece}
          handleMove={move}
          style={{
            transform: transform(posFromString(pos))
          }}
        />)
      )}

      {selected &&
        <div
          className="selected"
          style={{
            transform: transform(posFromString(selected)),
          }}
        >
          {/* <img
            src={assets[`${selected.color}${selected.type}`]}
          /> */}
        </div>}

      {findVMForSelectedPiece(validMoves).map(
        (m, ind) => (
          <div
            key={ind}
            style={{
              transform: transform(posFromString(m))
            }}
            className={pieces.get(m) ? "capture" : "availible"}
            data-payload={m}
            onClick={() => {
              if (selected) {
                move(selected, m)
              }
            }}
          />)
      )}

      {isPSWA && promotionMove && <PieceSelection
        onSelect={handlePromotion}
        side={side}
        posFile={posFromString(promotionMove.to).file}
        setIsActive={setIsPSWA}
      />}

      {lastMove && <>
        <div
          className="lastMove"
          style={{
            transform: transform(posFromString(lastMove.lan.substring(0, 2)))
          }}
        />
        <div
          className="lastMove"
          style={{
            transform: transform(posFromString(lastMove.uci.substring(2, 4)))
          }}
        />
      </>}

      <ul className="ranks">
        {ranks.map(rank => (
          <li key={rank}>
            {rank}
          </li>
        ))}
      </ul>
      <ul className="files">
        {files.map(file => (
          <li key={file}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  )
}
