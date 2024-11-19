// misc
import "./Board.css"
import { useEffect, useRef, useState } from "react"
import assets from "../../assets/pieces/pieces"
import background from "../../assets/background.png"
// Components
import BoardPiece from "../piece/BoardPiece"
import PieceSelection from "../piece-selection/PieceSelection"
// Main logic
import Piece from "../../game/piece"
import { posFromString, posToString } from "../../game/position"
import Move, { MoveDTO, PossibleMove } from "../../game/move"
import initPieces from "../../game/initPieces"

type BoardProps = {
  side: string
  lastMove: Move
  validMoves: PossibleMove[]
  onMove: (m: MoveDTO) => void
}

export default function Board({ side, lastMove,
  validMoves, onMove }: BoardProps) {
  const [currentTurn, setCurrentTurn] = useState("white")
  // pieces on a board.
  const [pieces, setPieces] = useState<Map<string, Piece>>(initPieces())
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null)
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
    // get last moved piece.
    const lmp = pieces.get(lastMove.from)
    if (!lmp) {
      return
    }
    // switch current turn.
    if (lmp.color === "white") {
      setCurrentTurn("black")
    } else {
      setCurrentTurn("white")
    }
    // move the piece.
    lmp.pos = lastMove.to
    pieces.set(lastMove.to, lmp)
    pieces.delete(lastMove.from)
    // handle special moves
    switch (lastMove.moveType) {
      case 4: {// 0-0-0
        const pos = posFromString(lastMove.to)
        const rookPos = posToString(1, pos.rank)
        const r = pieces.get(rookPos)
        if (!r) {
          return
        }
        // move the rook.
        r.pos = posToString(4, pos.rank)
        pieces.set(r.pos, r)
        pieces.delete(rookPos)
      } break

      case 5: {// 0-0 
        const pos = posFromString(lastMove.to)
        const rookPos = posToString(8, pos.rank)
        const r = pieces.get(rookPos)
        if (!r) {
          return
        }
        // move the rook.
        r.pos = posToString(6, pos.rank)
        pieces.set(r.pos, r)
        pieces.delete(rookPos)
      } break

      case 6: // en passant
        const pos = posFromString(lastMove.to)
        let dir = 1
        if (lmp.color === "white") {
          dir = -1
        }
        pieces.delete(posToString(pos.file, pos.rank + dir))
        break

      case 7: // promotion
        pieces.set(lastMove.to, new Piece(lastMove.to,
          lastMove.pp, lmp.color
        ))
    }

    setPieces(new Map(pieces))
  }, [lastMove])

  function handleClickPiece(p: Piece) {
    if (p.color === side) {
      setSelectedPiece(p)
    }
  }

  function handlePromotion(pp: string) {
    if (promotionMove) {
      setSelectedPiece(null)
      onMove(new MoveDTO(promotionMove.to, promotionMove.from, pp))
    }
  }

  function findValidMoves(moves: PossibleMove[]) {
    return moves.filter(move => move.from === selectedPiece?.pos)
  }

  function move(m: PossibleMove) {
    if (currentTurn !== side) {
      return
    }

    if (m.moveType === 7) { // promotion
      setPromotionMove(new MoveDTO(m.to, m.from, ""))
      setIsPSWA(true)
      return
    }
    onMove(new MoveDTO(m.to, m.from, ""))
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

      {selectedPiece &&
        <div
          className="selected"
          style={{
            transform: transform(posFromString(selectedPiece?.pos)),
          }}
        >
          <img
            //@ts-ignore
            src={assets[`${selectedPiece.color}${selectedPiece.type}`]}
          />
        </div>}

      {findValidMoves(validMoves).map(
        (m, ind) => (
          <div
            key={ind}
            style={{
              transform: transform(posFromString(m.to))
            }}
            className={pieces.get(m.to) ? "capture" : "availible"}
            data-payload={JSON.stringify(m)}
            onClick={() => {
              setSelectedPiece(null)
              move(m)
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
            transform: transform(posFromString(lastMove.from))
          }}
        />
        <div
          className="lastMove"
          style={{
            transform: transform(posFromString(lastMove.to))
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
