import styles from "./play.module.css"
import Board from "../../components/board/Board"
import Popup from "../../components/popup/Popup"

import error from "../../assets/error.png"
import check from "../../assets/check.png"
import unmute from "../../assets/unmute.png"
import mute from "../../assets/mute.png"

import { useAuth } from "../../context/useAuth"
import { useConnection } from "../../context/connection"
import React, {
  useState,
  useEffect,
  useRef,
} from "react"

import { useParams } from "react-router-dom"

import Game, { GameDTO } from "../../game/game"

// @ts-ignore
import moveSound from "../../assets/sounds/move.wav"
// @ts-ignore
import startSound from "../../assets/sounds/start.wav"
// @ts-ignore
import captureSound from "../../assets/sounds/capture.wav"
// @ts-ignore
import checkSound from "../../assets/sounds/check.wav"

import Move from "../../game/move"
import { EventAction } from "../../api/ws/event"

export default function Play() {
  const { id } = useParams() // room (a.k.a game) id

  const { user } = useAuth()
  const { ws, isConnected } = useConnection()

  const [side, setSide] = useState("") // player side, e.g. "black" | "white"
  /**
   * Stores the current game state.
   * @type {[Game | null, Function]}
   */
  const [game, setGame] = useState(/** @type {Game | null} */(null))
  /** @type {[string, Function]} */
  const [currentTurn, setCurrentTurn] = useState("white")

  /** soundToggle state is used to display the sound toggle control. */
  const [soundToggle, setSoundToggle] = useState(true)
  /** since the state cannot be used as the regular variable, canPlay ref is required. */
  const canPlay = useRef(soundToggle)
  /** isWaiting is used to provide an overlapping window in case the user
   *  waits for an opponent. */
  const [isWaiting, setIsWaiting] = useState(true)

  useEffect(() => {
    if (!isConnected) {
      return
    }

    // usefull for reconnections
    // @ts-ignore
    ws?.getGame(id)

    // Update game updates the current game state.
    ws?.setEventHandler(EventAction.UPDATE_GAME, handleUpdateGame)

    return () => {
      // leave the room
      ws?.leaveRoom()

      // clear event handlers which are needed only for this page.
      ws?.clearEventHandler(EventAction.UPDATE_GAME)
    }
  }, [])

  /**
   * Handle game updates.
   */
  function handleUpdateGame(gameDTO) {
    if (game == null) {
      return
    }

    if (gameDTO !== null) {
      setIsWaiting(false)
      // if the game has just started.
      if (canPlay.current && gameDTO.moves.moves.length == 0) {
        playSound(sounds["start"])
      }
    }

    // convert DTO to a concrete type.
    const nGame = new Game(gameDTO.id, gameDTO.control,
      gameDTO.bonus, gameDTO.status, gameDTO.whiteId,
      gameDTO.blackId, gameDTO.playedAt, gameDTO.moves,
      new Map()
    )
    // convert Object.<string, Piece> to a Map<string, Piece>.
    for (const posStr in gameDTO.pieces) {
      nGame.pieces.set(posStr, gameDTO.pieces[posStr])
    }
    // update the state.
    setGame(nGame)
  }

  // useEffect executes when the game state updates.
  useEffect(() => {
    if (!game) {
      return
    }

    // update current turn.
    if (game.moves.moves.length % 2 === 0) {
      setCurrentTurn("white")
    } else {
      setCurrentTurn("black")
    }

    // play the correspond sound.
    if (canPlay.current) {
      const lastMove = game.moves.moves[game.moves.moves.length - 1]
      if (lastMove?.isCheckmate) {
        playSound(sounds["checkmate"])
      } else if (lastMove?.isCheck) {
        playSound(sounds["check"])
      } else if (lastMove?.isCapture) {
        playSound(sounds["capture"])
      } else if (lastMove) {
        playSound(sounds["move"])
      }
    }
  }, [game])

  /**
   * Handles the User`s moves.
   * @param {Move} move 
   */
  function handleTakeMove(move) {
    ws?.move(move)
  }

  /**
   * Plays the provided sound if the browser allows to.
   * @param {HTMLAudioElement} sound 
   */
  function playSound(sound) {
    sound.play().catch(() => {
      setSoundToggle(false)
      canPlay.current = false
    })
  }

  const sounds = {
    "start": new Audio(startSound),
    "move": new Audio(moveSound),
    "capture": new Audio(captureSound),
    "check": new Audio(checkSound),
  }

  useEffect(() => {
    canPlay.current = soundToggle
  }, [soundToggle])

  return (
    <div className="mainContainer">
      <div className={styles.contentContainer}>

        {isWaiting ?
          <div className={styles.loader}>
            <div className={styles.loaderContent}>
              Waiting for other players
              <div className={styles.dots}>
                <div className={styles.loadingDot} />
                <div className={styles.loadingDot} />
                <div className={styles.loadingDot} />
              </div>
            </div>
          </div>
          : null
        }

        {game ?
          <Board handleTakeMove={handleTakeMove}
            pieces={game.pieces}
            side={side}
            currentTurn={currentTurn}
          />
          : null
        }
        {/* {game ? <MovesTable moves={game.moves} /> : null} */}
      </div>

      <div className={styles.soundToggle}>
        {soundToggle ?
          <img src={unmute} alt="unmuted"
            onClick={() => setSoundToggle(false)} /> :
          <img src={mute} alt="muted"
            onClick={() => setSoundToggle(true)} />
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