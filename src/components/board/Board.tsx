import styles from "./board.module.css"
import BoardPiece from "../piece/BoardPiece"
import { useState } from "react"
import background from "../../assets/background.png"

import Piece from "../../game/piece"
import Move, { MoveDTO, PossibleMove } from "../../game/move"
import { posFromString } from "../../game/position"
import PieceSelection from "../piece-selection/PieceSelection"
import assets from "../../assets/pieces/pieces"

type BoardProps = {
  handleMove: (m: MoveDTO) => void,
  pieces: Map<string, Piece>,
  side: string,
  currentTurn: string | undefined,
  validMoves: PossibleMove[]
  lastMove: Move
}

export default function Board(props: BoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null)
  const [promotionMove, setPromotionMove] = useState<MoveDTO | null>(null)
  // Is piece selection window active.
  const [isPSWA, setIsPSWA] = useState<boolean>(false)

  function handleClickPiece(p: Piece) {
    if (p.color === props.side) {
      setSelectedPiece(p)
    }
  }

  function handlePromotion(pp: string) {
    if (promotionMove) {
      setSelectedPiece(null)
      props.handleMove(new MoveDTO(promotionMove.to, promotionMove.from, pp))
    }
  }

  function findValidMoves(moves: PossibleMove[]) {
    return moves.filter(move => move.from === selectedPiece?.pos)
  }

  function move(m: PossibleMove) {
    if (m.moveType === 7) { // promotion
      setPromotionMove(new MoveDTO(m.to, m.from, ""))
      setIsPSWA(true)
      return
    }
    props.handleMove(new MoveDTO(m.to, m.from, ""))
  }

  function transform(pos: { file: number, rank: number }): string {
    if (props.side === "white") {
      return `translate(calc(5rem * ${pos.file - 1}), calc(5rem * ${8 - pos.rank}))`
    }
    return `translate(calc(35rem - (5rem * ${pos.file - 1})), calc(5rem * ${pos.rank - 1}))`
  }

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  return (
    <div
      className={[styles.board,
      props.side === "black" ? styles.sideBlack : ""
      ].join(" ")}
      style={{ backgroundImage: `url(${background})` }} // TODO: replace with css variable
    >
      {Array.from(props.pieces).map(([pos, piece]) => (
        <BoardPiece
          key={pos}
          pos={pos}
          piece={piece}
          onClickHandler={handleClickPiece}
          handleMove={move}
          side={props.side}
        />)
      )}

      {selectedPiece &&
        <div
          className={styles.selected}
          style={{
            transform: transform(posFromString(selectedPiece?.pos)),
          }}
        >
          <img
            //@ts-ignore
            src={assets[`${selectedPiece.color}${selectedPiece.type}`]}
          />
        </div>}

      {findValidMoves(props.validMoves).map(
        (m, ind) => (
          <div
            key={ind}
            style={{
              transform: transform(posFromString(m.to))
            }}
            className={props.pieces.get(m.to) ? "capture" : "availible"}
            data-payload={JSON.stringify(m)}
            onClick={() => {
              setSelectedPiece(null)
              move(m)
            }}
          />)
      )}


      {isPSWA && promotionMove && <PieceSelection
        onSelect={handlePromotion}
        side={props.side}
        posFile={posFromString(promotionMove.to).file}
        setIsActive={setIsPSWA}
      />}

      {props.lastMove && <>
        <div
          className={styles.lastMove}
          style={{
            transform: transform(posFromString(props.lastMove.from))
          }}
        />
        <div
          className={styles.lastMove}
          style={{
            transform: transform(posFromString(props.lastMove.to))
          }}
        />
      </>}

      <ul className={styles.ranks}>
        {ranks.map(rank => (
          <li key={rank}>
            {rank}
          </li>
        ))}
      </ul>
      <ul className={styles.files}>
        {files.map(file => (
          <li key={file}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  )
}
