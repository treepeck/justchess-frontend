import styles from "./play.module.css"
import Board from "../../components/board/Board"

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

// @ts-ignore
import moveSound from "../../assets/sounds/move.wav"
// @ts-ignore
import startSound from "../../assets/sounds/start.wav"
// @ts-ignore
import captureSound from "../../assets/sounds/capture.wav"
// @ts-ignore
import checkSound from "../../assets/sounds/check.wav"

import Move, { MoveDTO, PossibleMove } from "../../game/move"
import { EventAction } from "../../api/ws/event"
import Piece from "../../game/piece"

export default function Play() {
  const { id } = useParams() // room (a.k.a. game) id

  const { user } = useAuth()
  const { ws, isConnected } = useConnection()

  /**
   * side stores player side, e.g. "white" | "black".
   * @type {[string, Function]}
   */
  const [side, setSide] = useState("") // 
  /**
   * gameStatus stores the current game status.
   * @type {[string, Function]}
   */
  const [gameStatus, setGameStatus] = useState("waiting")
  /**
   * pieces stores all the pieces on the board and their positions
   * @type {[Map<string, Piece>, Function]}
   */
  const [pieces, setPieces] = useState(new Map())
  /**
   * moves stores all completed moves.
   * @type {[Move[], Function]}
   */
  const [moves, setMoves] = useState([])
  /**
   * currentTurn stores the current turn. "white" | "black"
   * @type {[string, Function]}
   */
  const [currentTurn, setCurrentTurn] = useState("white")
  /**
   * validMoves stores valid moves for the current turn.
   * @type {[PossibleMove[], Function]}
   */
  const [validMoves, setValidMoves] = useState([])
  /** soundToggle is used to display the sound toggle control. */
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

    ws?.getGame(id)

    // Update game updates the current game state.
    ws?.setEventHandler(EventAction.UPDATE_BOARD, handleUpdateBoard)
    // Updates current valid moves.
    ws?.setEventHandler(EventAction.VALID_MOVES, handleValidMoves)
    // Handles last move.
    ws?.setEventHandler(EventAction.MOVES, handleLastMove)
    ws?.setEventHandler(EventAction.STATUS, (gameDTO) => {
      if (side === "") {
        if (gameDTO.white === user.id) {
          setSide("white")
        } else if (gameDTO.black === user.id) {
          setSide("black")
        }
      }
      setGameStatus(gameDTO.status)
    })

    return () => {
      // leave the room
      ws?.leaveRoom()

      // clear event handlers which are needed only for this page.
      ws?.clearEventHandler(EventAction.UPDATE_BOARD)
      ws?.clearEventHandler(EventAction.VALID_MOVES)
      ws?.clearEventHandler(EventAction.MOVES)
      ws?.clearEventHandler(EventAction.STATUS)
    }
  }, [])

  /**
   * handleUpdateBoard redraws board.
   * @param {Piece[]} pieces
   */
  function handleUpdateBoard(pieces) {
    const piecesMap = new Map()
    // The board comes from the backend as the Object.<string, Piece> type.
    // It is more comfortable to work with a Map, so the loop converts
    // an object to a Map.
    for (const posStr in pieces) {
      const p = pieces[posStr]
      // @ts-ignore piece cannot be null here.
      piecesMap.set(posStr, new Piece(p.type, p.color))
    }
    // update the pieces state.
    setPieces(piecesMap)
  }

  /**
   * Sets valid moves for the current turn.
   * @param {PossibleMove[]} vm 
   */
  function handleValidMoves(vm) {
    setValidMoves(vm)
  }

  /**
   * Handles last move.
   * @param {Move} m
   */
  function handleLastMove(m) {
    const newMoves = [...moves]
    newMoves.push(m)
    setMoves(newMoves)

    console.log(newMoves.length)
    if (newMoves.length === 0) { // first move
      setCurrentTurn("white")
    } else if (newMoves.length % 2 === 0) { // even moves
      setCurrentTurn("black")
    } else { // odd moves
      setCurrentTurn("white")
    }
  }

  // useEffect executes when the game status updates.
  useEffect(() => {
    switch (gameStatus) {
      case "waiting":
        setIsWaiting(true) // the game hasn't started yet
        break

      case "aborted":
        // TODO: show window: game aborted
        break

      case "white_won":
        // TODO: show window: white won
        break

      case "black_won":
        // TODO: show window: black won
        break

      case "draw":
        // TODO: show window: draw
        break

      case "continues":
        // if the game has just started.
        if (isWaiting) {
          setIsWaiting(false)
          playSound(sounds["start"])
        }
        break
    }
  }, [gameStatus])

  /**
   * Handles the User`s moves.
   * @param {MoveDTO} move 
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
              Waiting for the second player
              <div className={styles.dots}>
                <div className={styles.loadingDot} />
                <div className={styles.loadingDot} />
                <div className={styles.loadingDot} />
              </div>
            </div>
          </div>
          : null
        }

        {gameStatus !== "waiting" ?
          <Board
            handleTakeMove={handleTakeMove}
            pieces={pieces}
            side={side}
            currentTurn={currentTurn}
            validMoves={validMoves}
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