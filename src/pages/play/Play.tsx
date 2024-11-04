import styles from "./play.module.css"
import Board from "../../components/board/Board"

import error from "../../assets/error.png"
import check from "../../assets/check.png"
import unmute from "../../assets/unmute.png"
import mute from "../../assets/mute.png"
// @ts-ignore
import moveSound from "../../assets/sounds/move.wav"
// @ts-ignore
import startSound from "../../assets/sounds/start.wav"
// @ts-ignore
import captureSound from "../../assets/sounds/capture.wav"
// @ts-ignore
import checkSound from "../../assets/sounds/check.wav"

import { useAuth } from "../../context/Auth"
import { useConn } from "../../context/Conn"

import {
  useState,
  useEffect,
  useRef,
} from "react"

import { useParams } from "react-router-dom"

import Move, { MoveDTO, PossibleMove } from "../../game/move"
import { EventAction } from "../../api/ws/event"
import Piece from "../../game/piece"

export default function Play() {
  const { id } = useParams() // room (aka game) id

  const { user } = useAuth()
  const { ws, ic } = useConn()

  const [side, setSide] = useState<string>("")
  const [gameStatus, setGameStatus] = useState<number>(1) // waiting by default
  const [pieces, setPieces] = useState<Map<string, Piece>>(new Map())
  const [moves, setMoves] = useState<Move[]>([])
  const [currentTurn, setCurrentTurn] = useState<string>("white")
  const [validMoves, setValidMoves] = useState<PossibleMove[]>([])
  // soundToggle is used to display the sound toggle control. 
  const [soundToggle, setSoundToggle] = useState<boolean>(true)
  // since the state cannot be used as the regular variable, canPlay ref is required. 
  const canPlay = useRef(soundToggle)
  // isWaiting is used to provide an overlapping window in case the user
  // waits for an opponent. 
  const [isWaiting, setIsWaiting] = useState<boolean>(true)

  useEffect(() => {
    if (!ic || !id) {
      return
    }

    ws?.getGame(id)

    ws?.setEventHandler(EventAction.UPDATE_BOARD, handleUpdateBoard)
    ws?.setEventHandler(EventAction.VALID_MOVES, handleValidMoves)
    ws?.setEventHandler(EventAction.MOVES, handleMoves)
    ws?.setEventHandler(EventAction.STATUS, (gameDTO: any) => {
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
      ws?.leaveRoom()

      ws?.clearEventHandler(EventAction.UPDATE_BOARD)
      ws?.clearEventHandler(EventAction.VALID_MOVES)
      ws?.clearEventHandler(EventAction.MOVES)
      ws?.clearEventHandler(EventAction.STATUS)
    }
  }, [])

  function handleUpdateBoard(pieces: any) {
    const piecesMap = new Map()
    // The board comes from the backend as the Object.<string, Piece> type.
    // It is more comfortable to work with a Map, so the loop converts
    // an object to a Map.
    for (const posStr in pieces) {
      const p = pieces[posStr]
      piecesMap.set(posStr, new Piece(p.type, p.color))
    }
    // update the pieces state.
    setPieces(piecesMap)
  }

  function handleValidMoves(vm: PossibleMove[]) {
    setValidMoves(vm)
  }

  const sounds = {
    "start": new Audio(startSound),
    "move": new Audio(moveSound),
    "capture": new Audio(captureSound),
    "check": new Audio(checkSound),
  }

  function handleMoves(m: Move[]) {
    setMoves(m)

    if (m.length > 0) {
      if (m[m.length - 1].isCheck) {
        playSound(sounds["check"])
      } else if (m[m.length - 1].isCapture) {
        playSound(sounds["capture"])
      } else {
        playSound(sounds["move"])
      }
    }
    if ((m.length + 1) % 2 !== 0) {
      setCurrentTurn("white")
    } else { // even moves
      setCurrentTurn("black")
    }
  }

  useEffect(() => {
    switch (gameStatus) {
      case 0: // Aborted
        // TODO: show window "Game aborted"
        break

      case 1: // Waiting
        setIsWaiting(true) // the game has not been started yet
        break

      case 2: // Continues
        // if the game has just started
        if (isWaiting) {
          setIsWaiting(false)
          playSound(sounds["start"])
        }
        break

      case 3: // Over
        // TODO: show window "Game over with the game result"
        break
    }
  }, [gameStatus])

  function handleTakeMove(move: MoveDTO) {
    ws?.move(move)
  }

  // Plays the provided sound if the browser allows to.
  function playSound(sound: HTMLAudioElement) {
    if (canPlay.current === true) {
      sound.play().catch(() => {
        setSoundToggle(false)
        canPlay.current = false
      })
    }
  }

  useEffect(() => {
    canPlay.current = soundToggle
  }, [soundToggle])

  return (
    <div className="mainContainer">
      <div className={styles.container}>
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

        {gameStatus !== 1 ?
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
          ic
            ? <img src={check} alt="yes" />
            : <img src={error} alt="no" />
        }
      </div>
    </div>
  )
}