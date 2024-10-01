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
import Game from "../../game/game"

// @ts-ignore
import moveSound from "../../assets/sounds/move.wav"
// @ts-ignore
import startSound from "../../assets/sounds/start.wav"
// @ts-ignore
import captureSound from "../../assets/sounds/capture.wav"

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
    if (game?.moves.moves.length % 2 === 0) {
      setCurrentTurn("white")
    } else {
      setCurrentTurn("black")
    }
    if (game?.moves.moves.length > 0) {
      sounds["move"].play()
    } else if (game?.moves.moves.length === 0) {
      sounds["start"].play()
    }
  }, [game?.moves])

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
   * @param {Game} g 
   */
  function handleUpdateGame(g) {

    if (g.status != "waiting") {
      setIsWaiting(false)
    }

    setGame(g)
    if (g.whiteId === user.id) {
      setSide("white")
    } else {
      setSide("black")
    }
  }

  /**
   * Handles the User`s moves.
   * @param {string} beginPos 
   * @param {string} endPos 
   */
  function handleTakeMove(beginPos, endPos) {
    console.log("I`m here")
    ws?.move(beginPos, endPos)
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
          <Board handleTakeMove={handleTakeMove} pieces={game.pieces} side={side} currentTurn={currentTurn} />
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