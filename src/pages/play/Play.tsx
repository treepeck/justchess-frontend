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

import { useNavigate, useParams } from "react-router-dom"

import Move, { MoveDTO, PossibleMove } from "../../game/move"
import { EventAction } from "../../api/ws/event"

import Game from "../../game/game"
import Piece from "../../game/piece"
import Timer from "../../components/timer/Timer"
import Dialog from "../../components/dialog/Dialog"
import initPieces from "../../game/initPieces"
import { posFromString, posToString } from "../../game/position"

export default function Play() {
  const { id } = useParams() // room (aka game) id

  const { user } = useAuth()
  const { ws, ic } = useConn()

  const navigate = useNavigate()

  // isCDA activates a Checkmate window. 
  const [isCDA, setIsCDA] = useState<boolean>(false)
  // isWaiting activates a "Wait for oponnent" window.
  const [isWaiting, setIsWaiting] = useState<boolean>(true)
  // Game related states
  const [game, setGame] = useState<Game>()
  const [side, setSide] = useState<string>()
  const [moves, setMoves] = useState<Move[]>([])
  const [currentTurn, setCurrentTurn] = useState<string>()
  const [validMoves, setValidMoves] = useState<PossibleMove[]>([])
  const [result, setResult] = useState<{ r: number, w: number }>()
  const [pieces, setPieces] = useState<Map<string, Piece>>(initPieces(new Map()))
  const [whiteTime, setWhiteTime] = useState(0)
  const [blackTime, setBlackTime] = useState(0)
  // is white timer active
  const [isWTA, setIsWTA] = useState(false)
  // is black timer active
  const [isBTA, setIsBTA] = useState(false)
  // soundToggle activates the sound toggle control. 
  const [soundToggle, setSoundToggle] = useState<boolean>(true)
  // since the state cannot be used as the regular variable, canPlay ref is required. 
  const canPlay = useRef(soundToggle)

  useEffect(() => {
    if (!ic || !id) {
      return
    }

    ws?.getGame(id)

    ws?.setEventHandler(EventAction.GAME_INFO, handleUpdateGame)
    ws?.setEventHandler(EventAction.END_RESULT, handleEndGame)
    ws?.setEventHandler(EventAction.LAST_MOVE, handleLastMove)
    ws?.setEventHandler(EventAction.VALID_MOVES, handleValidMoves)
    ws?.setEventHandler(EventAction.MOVES, handleMoves)
    ws?.setEventHandler(EventAction.ABORT, handleAbortGame)

    return () => {
      ws?.leaveRoom()

      ws?.clearEventHandler(EventAction.LAST_MOVE)
      ws?.clearEventHandler(EventAction.VALID_MOVES)
      ws?.clearEventHandler(EventAction.MOVES)
      ws?.clearEventHandler(EventAction.GAME_INFO)
    }
  }, [])

  function handleUpdateGame(g: Game) {
    setGame(g)

    switch (g.status) {
      case 1: // waiting 
        setIsWaiting(true)
        break

      case 2: // leave
        // TODO: handle players disconnections 
        break

      case 3: // continues
        setIsWaiting(false)

        if (g.white.id === user.id) {
          setSide("white")
        } else {
          setSide("black")
        }
        // nanoseconds to seconds
        setWhiteTime(g.white.time / 1000000000)
        setBlackTime(g.black.time / 1000000000)
        // white player moves first
        setCurrentTurn("white")
        setIsWTA(true)
        break
    }
  }

  function handleLastMove(m: Move) {
    moves.push(m)
    const nm = [...moves]
    if ((nm.length + 1) % 2 !== 0) {
      setCurrentTurn("white")
      setBlackTime(m.timeLeft / 1000000000)
      setIsBTA(false)
      setIsWTA(true)
    } else { // even moves
      setCurrentTurn("black")
      setWhiteTime(m.timeLeft / 1000000000)
      setIsBTA(true)
      setIsWTA(false)
    }

    if (m.isCheckmate) {
      // TODO: playSound(sounds["checkmate"])
    } else if (m.isCheck) {
      playSound(sounds["check"])
    } else if (m.isCapture) {
      playSound(sounds["capture"])
    } else {
      playSound(sounds["move"])
    }

    // update the board
    takeMove(m)
    setPieces(new Map(pieces))
    setMoves(nm)
  }

  function handleEndGame(result: { r: number, w: number }) {
    setResult(result)
    setIsCDA(true)
    setIsWTA(false)
    setIsBTA(false)
    setValidMoves([])
    setCurrentTurn("")
  }

  function handleAbortGame() {
    setValidMoves([])
    setCurrentTurn(undefined)
    // stop the timers
    setIsWTA(false)
    setIsBTA(false)
  }

  function takeMove(m: Move) {
    const p = pieces.get(m.from)
    if (!p) {
      return
    }
    pieces.set(m.to, p)
    pieces.delete(m.from)
    // handle special moves 
    switch (m.moveType) {
      case 4: { // 0-0-0
        const pos = posFromString(m.to)
        const rookPos = posToString(1, pos.rank)
        const rook = pieces.get(rookPos)
        if (rook) {
          pieces.set(posToString(4, pos.rank), rook)
          pieces.delete(rookPos)
        }
      }
        break

      case 5: { // 0-0
        const pos = posFromString(m.to)
        const rookPos = posToString(8, pos.rank)
        const rook = pieces.get(rookPos)
        if (rook) {
          pieces.set(posToString(6, pos.rank), rook)
          pieces.delete(rookPos)
        }
      }
        break

      case 6: { // en passant
        const pos = posFromString(m.to)
        let dir = 1
        if (p.color === "white") {
          dir = -1
        }
        pieces.delete(posToString(pos.file, pos.rank + dir))
      }
        break

      case 7: // promotion
        pieces.set(m.to, new Piece(m.pp, p.color))
        break
    }
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

    for (const move of m) {
      takeMove(move)
    }
    setPieces(new Map(pieces))
  }

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

  function parseWinner(): string {
    switch (result?.w) {
      case 0:
        return "Draw"
      case 1:
        return "White won"
      case -1:
        return "Black won"
      default:
        return "unknown winner"
    }
  }

  function parseResult(): string {
    switch (result?.r) {
      case 0:
        return "by checkmate"
      case 1:
        return "by resignation"
      case 2:
        return "by timeout"
      case 3:
        return "by stalemate"
      case 4:
        return "by insufficient material"
      case 5:
        return "by fifty moves rule"
      case 6:
        return "by repetition"
      case 7:
        return "by agreement"
      default:
        return "unknown result"
    }
  }

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

        {game?.status !== 1 && side ?
          <div className={styles.boardLayout}>
            <Timer
              duration={blackTime}
              isActive={isBTA}
            />
            <div className={styles.blackStatus}>
              {game?.black.id} {
                game?.black.isConnected
                  ? <img src={check} alt="yes" />
                  : <img src={error} alt="no" />
              }
            </div>
            <Board
              handleTakeMove={handleTakeMove}
              pieces={pieces}
              side={side}
              currentTurn={currentTurn}
              validMoves={validMoves}
            />
            <Timer
              duration={whiteTime}
              isActive={isWTA}
            />
            <div className={styles.whiteStatus}>
              {game?.white.id} {
                game?.white.isConnected
                  ? <img src={check} alt="yes" />
                  : <img src={error} alt="no" />
              }
            </div>

          </div>
          : null}
      </div>

      <div className={styles.soundToggle}>
        {soundToggle ?
          <img src={unmute} alt="unmuted"
            onClick={() => setSoundToggle(false)} /> :
          <img src={mute} alt="muted"
            onClick={() => setSoundToggle(true)} />
        }
      </div>

      {isCDA && (
        <Dialog
          header={parseWinner()}
          content={[
            <p>
              {parseResult()}
            </p>,
            // <Button
            //   onClickHandler={() => { handleRematch }}
            //   text="Rematch"
            // />
          ]}
          onSubmit={() => { navigate("/") }}
          onSubmitText="Back to lobby"
          setIsActive={setIsCDA}
        />
      )}
    </div>
  )
}