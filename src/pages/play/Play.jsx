import styles from "./play.module.css"
import Board from "../../components/board/Board"

import error from "../../assets/error.png"
import check from "../../assets/check.png"

import { useAuth } from "../../context/useAuth"
import { useConnection } from "../../context/connection"
import {
  useState,
  useEffect,
} from "react"
import { useParams } from "react-router-dom"

export default function Play() {
  const { id } = useParams()

  const { user } = useAuth()
  const { ws, isConnected } = useConnection()

  const [side, setSide] = useState()
  const [game, setGame] = useState(null)
  const [isWaiting, setIsWaiting] = useState(true)

  useEffect(() => {
    // set up event handlers
    ws.setEventHandler("UPDATE_GAME", handleUpdateGame)

    return () => {
      ws.clearEventHandler("UPDATE_GAME")
    }
  }, [])

  function handleUpdateGame(g) {
    if (g.state != "waiting") {
      setIsWaiting(false)
    }

    setGame(g)
    if (g.whiteId === user.id) {
      setSide("white")
    } else {
      setSide("black")
    }
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

        {game ? <Board pieces={game.pieces} side={side} /> : null}
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