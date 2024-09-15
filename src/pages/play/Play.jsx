import styles from "./play.module.css"
import Board from "../../components/board/Board"
import Miniprofile from "../../components/miniprofile/Miniprofile"

import error from "../../assets/error.png"
import check from "../../assets/check.png"

import { useAuth } from "../../context/useAuth"
import { useConnection } from "../../context/connection"

import API from "../../api/api"

import {
  useState,
  useEffect,
} from "react"
import { useParams } from "react-router-dom"

export default function Play() {
  const { id } = useParams()

  const { user } = useAuth()
  const { ws, isConnected } = useConnection()

  const [isWaiting, setIsWaiting] = useState(false)
  const [control, setControl] = useState("")
  const [opponent, setOpponent] = useState(null)
  const [side, setSide] = useState()

  useEffect(() => {
    // set up event handlers
    ws.setEventHandler("WAITING_OPPONENT", () => { setIsWaiting(true) })
    ws.setEventHandler("START_GAME", handleStartGame)

    ws.joinRoom(id.replace("\"", "").replace("\"", ""))

    // clean up the connection
    return () => {
      ws.clearEventHandler("WAITING_OPPONENT")
      ws.clearEventHandler("START_GAME")
    }
  }, [])


  function handleStartGame(startGameDTO) {
    setIsWaiting(false)

    if (startGameDTO.whiteId === user.id) {
      setSide("white")
      setOpponent(startGameDTO.blackId)
    } else if (startGameDTO.blackId) {
      setSide("black")
      setOpponent(startGameDTO.whiteId)
    }
    setControl(startGameDTO.control)
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

        {/* <Miniprofile user={opponent} control={control} /> */}
        <Board />
        {/* <Miniprofile user={user} control={control} /> */}

        {
          side
        }

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