import styles from "./play.module.css"
import Board from "../../components/board/Board"

import error from "../../assets/error.png"
import check from "../../assets/check.png"

import { useAuth } from "../../context/useAuth"
import { useConnection } from "../../context/connection"
import React, {
  useState,
  useEffect,
} from "react"

import { useParams } from "react-router-dom"
import Game, { GameDTO } from "../../game/game"

// @ts-ignore
import moveSound from "../../assets/sounds/move.wav"
// @ts-ignore
import startSound from "../../assets/sounds/start.wav"
// @ts-ignore
import captureSound from "../../assets/sounds/capture.wav"
import Move from "../../game/move"

export default function Play() {
  const { id } = useParams()

  const { user } = useAuth()
  const { ws, isConnected } = useConnection()

  const [side, setSide] = useState("")
  /**
   * @type {[Game | null, Function]}
   */
  const [game, setGame] = useState(/** @type {Game | null} */(null))
  const [isWaiting, setIsWaiting] = useState(true)
  const [currentTurn, setCurrentTurn] = useState("white")

  const sounds = {
    "start": new Audio(startSound),
    "move": new Audio(moveSound),
    "capture": new Audio(captureSound),
  }

  useEffect(() => {
    // set up event handlers
    ws?.setEventHandler("UPDATE_GAME", handleUpdateGame)

    // get updated game info
    if (id) {
      ws?.getGame(id)
    }

    return () => {
      ws?.clearEventHandler("UPDATE_GAME")
    }
  }, [])

  /** 
   * @param {GameDTO} gameDTO 
   */
  function handleUpdateGame(gameDTO) {
    if (gameDTO.status !== "waiting" && isWaiting) {
      setIsWaiting(false)
      sounds["start"].play()
    }

    const nGame = new Game(gameDTO.id, gameDTO.control,
      gameDTO.bonus, gameDTO.status, gameDTO.whiteId,
      gameDTO.blackId, gameDTO.playedAt, gameDTO.moves,
      new Map()
    )

    // convert Object.<string, Piece> to a Map<string, Piece>
    for (const posStr in gameDTO.pieces) {
      nGame.pieces.set(posStr, gameDTO.pieces[posStr])
    }
    setGame(nGame)

    if (nGame.moves.moves.length % 2 === 0) {
      setCurrentTurn("white")
    } else {
      setCurrentTurn("black")
    }

    const lastMove = nGame.moves.moves[nGame.moves.moves.length - 1]
    if (lastMove?.isCheckmate) {
      sounds["checkmate"].play()
    } else if (lastMove?.isCheck) {
      sounds["check"].play()
    } else if (lastMove?.isCapture) {
      sounds["capture"].play()
    } else {
      sounds["move"].play()
    }

    if (gameDTO.whiteId === user.id) {
      setSide("white")
    } else {
      setSide("black")
    }
  }

  /**
   * Handles the User`s moves.
   * @param {Move} move 
   */
  function handleTakeMove(move) {
    ws?.move(move)
  }

  return (
    <div className="mainContainer">
      <div className={styles.contentContainer}>

        {isWaiting
          ? <div className={styles.loader}>
            <div className={styles.loaderContent}>
              Waiting for other players
              <div className={styles.dots}>
                <div className={styles.loadingDot} />
                <div className={styles.loadingDot} />
                <div className={styles.loadingDot} />
              </div>
            </div>
          </div>
          : null}

        {game && !isWaiting ?
          <Board handleTakeMove={handleTakeMove}
            pieces={game.pieces}
            side={side}
            currentTurn={currentTurn}
          />
          : null
        }
        {/* {game ? <MovesTable moves={game.moves} /> : null} */}
      </div>

      <div className="playerStatus">
        Connection: {
          isConnected
            ? <img src={check} alt="yes" />
            : <img src={error} alt="no" />
        }
      </div>
    </div>
  )
}