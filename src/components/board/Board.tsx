import styles from "./board.module.css"
import BoardPiece from "../piece/BoardPiece"
import { useState, useEffect } from "react"
import background from "../../assets/background.png"

import Piece from "../../game/piece"
import { MoveDTO, PossibleMove } from "../../game/move"
import { posFromString, posToString } from "../../game/position"
import PieceSelection from "../piece-selection/PieceSelection"
import assets from "../../assets/pieces/pieces"

type BoardProps = {
  handleTakeMove: (m: MoveDTO) => void,
  pieces: Map<string, Piece>,
  side: string,
  currentTurn: string | undefined,
  validMoves: PossibleMove[]
}

export default function Board(props: BoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null)
  const [lastMove, setLastMove] = useState<MoveDTO | null>(null)
  // Is piece selection window active.
  const [isPSWA, setIsPSWA] = useState<boolean>(false)

  // useEffect(() => {
  //   rerender
  // }, [props.pieces])

  function handleClickPiece(p: Piece) {
    if (p.color === props.side) {
      setSelectedPiece(p)
    }
  }

  function handlePromotion(pp: string) {
    if (lastMove) {
      setSelectedPiece(null)
      props.handleTakeMove(new MoveDTO(lastMove.to, lastMove.from, pp))
    }
  }

  function findValidMoves() {
    return props.validMoves.filter(move => move.from === selectedPiece?.pos)
  }

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  return (
    <div
      className={[styles.board,
      props.side == "black" ? styles.sideBlack : ""
      ].join(" ")}
      style={{ backgroundImage: `url(${background})` }} // TODO: replace with css variable
    >
      {
        Array.from(props.pieces).map(([pos, piece]) => (
          <BoardPiece
            key={pos}
            pos={pos}
            piece={piece}
            onClickHandler={handleClickPiece}
            handleTakeMove={(m: MoveDTO) => {
              setSelectedPiece(null)
              props.handleTakeMove(m)
            }}
          />
        ))
      }

      {
        selectedPiece &&
        <div
          className={styles.selected}
          style={{
            transform: `translate(calc(5rem * ${posFromString(selectedPiece.pos).file - 1
              }), calc(5rem * ${8 - posFromString(selectedPiece.pos).rank}))`,
          }}
        >
          <img
            //@ts-ignore
            src={assets[`${selectedPiece.color}${selectedPiece.type}`]}
          />
        </div>
      }

      <div>
        {findValidMoves().map(
          (m, ind) => (
            <div
              key={ind}
              style={{
                transform: `translate(calc(5rem * ${posFromString(m.to).file - 1
                  }), calc(5rem * ${8 - posFromString(m.to).rank}))`
              }}
              className="availible"
              data-pos={m.to}
              onClick={() => {
                setSelectedPiece(null)
                props.handleTakeMove(new MoveDTO(m.to, m.from, ""))
              }}
            />
          ))
        }
      </div>

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
    </div >
  )
}
