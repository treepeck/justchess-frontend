// misc
import {
  useState,
  useEffect,
  useRef,
} from "react"
import "./Play.css"
import { useNavigate, useParams } from "react-router-dom"
// components
import Chat from "../../components/chat/Chat"
import Board from "../../components/board/Board"
import Miniprofile from "../../components/miniprofile/Miniprofile"
// assets
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
// contexts
import { useAuth } from "../../context/Auth"
import { useConn } from "../../context/Conn"
// logic
import Game from "../../game/game"
import { EventAction } from "../../api/ws/event"
import Dialog from "../../components/dialog/Dialog"
import Move, { MoveDTO } from "../../game/move"
import { GameStatus } from "../../api/enums"
import MovesTable from "../../components/moves-table/MovesTable"

export default function Play() {
  const { id } = useParams() // room (aka game) id

  const { user } = useAuth()
  const { ws, ic } = useConn()

  const navigate = useNavigate()

  // isCDA activates a Checkmate window. 
  const [isCDA, setIsCDA] = useState<boolean>(false)
  // isWaiting activates a "Wait for second oponnent" window.
  const [isWaiting, setIsWaiting] = useState<boolean>(true)
  const [side, setSide] = useState<string>()
  const [moves, setMoves] = useState<Move[]>([])
  const [game, setGame] = useState<Game | null>(null)
  const [validMoves, setValidMoves] = useState<Record<string, string>>({
    "a2": "a3a4",
    "b2": "b3b4",
    "c2": "c3c4",
    "d2": "d3d4",
    "e2": "e3e4",
    "f2": "f3f4",
    "g2": "g3g4",
    "h2": "h3h4",
    "b1": "a3c3",
    "g1": "f3h3",
  })
  const [result, setResult] = useState<{ r: number, w: number }>()
  // player`s timers
  const [whiteTime, setWhiteTime] = useState(0)
  const [blackTime, setBlackTime] = useState(0)
  const [isWTA, setIsWTA] = useState(false) // is white timer active
  const [isBTA, setIsBTA] = useState(false) // is black timer active
  // soundToggle activates the sound toggle control. 
  const [soundToggle, setSoundToggle] = useState<boolean>(true)
  // since the state cannot be used as the regular variable, canPlay ref is required. 
  const canPlay = useRef(soundToggle)

  useEffect(() => {
    if (!ic || !id) {
      return
    }

    ws?.getGame(id)

    ws?.setEventHandler(EventAction.ABORT, handleAbortGame)
    ws?.setEventHandler(EventAction.LAST_MOVE, handleLastMove)
    ws?.setEventHandler(EventAction.END_RESULT, handleEndGame)
    ws?.setEventHandler(EventAction.GAME_INFO, handleUpdateGame)
    ws?.setEventHandler(EventAction.MOVES, handleMoveHistory)

    return () => {
      ws?.leaveRoom()

      ws?.clearEventHandler(EventAction.ABORT)
      ws?.clearEventHandler(EventAction.GAME_INFO)
      ws?.clearEventHandler(EventAction.LAST_MOVE)
      ws?.clearEventHandler(EventAction.END_RESULT)
      ws?.clearEventHandler(EventAction.MOVES)
    }
  }, [])

  function handleUpdateGame(g: Game) {
    switch (g.status) {
      case GameStatus.Waiting:
        setIsWaiting(true)
        break

      case GameStatus.Leave:

        break

      case GameStatus.Continues:
        setIsWaiting(false)

        if (g.white.id === user.id) {
          setSide("white")
        } else {
          setSide("black")
        }
        // set players times, convert nanoseconds to seconds
        setWhiteTime(g.white.time / 1000000000)
        setBlackTime(g.black.time / 1000000000)
        setIsWTA(true)
        break
    }
    setGame(g)
  }

  function handleLastMove(m: Move) {
    setMoves((prevMoves) => {
      const newMoves = [...prevMoves, m]
      // handle odd moves
      if (newMoves.length % 2 !== 0) {
        setWhiteTime(m.timeLeft / 1000000000)
        setIsWTA(false)
        setIsBTA(true)
      } else { // even moves
        setBlackTime(m.timeLeft / 1000000000)
        setIsWTA(true)
        setIsBTA(false)
      }

      if (m.lan.includes("#")) { // checkmate
        // TODO: playSound(sounds["checkmate"])
      } else if (m.lan.includes("+")) { // check
        playSound(sounds["check"])
      } else if (m.lan.includes("x")) { // capture
        playSound(sounds["capture"])
      } else {
        playSound(sounds["move"])
      }
      setValidMoves(m.vm)
      return newMoves
    })
  }

  function handleMoveHistory(mh: Move[]) {
    setMoves((prevMoves) => {
      const newMoves = [...mh]
      const lm = newMoves[newMoves.length - 1]
      // handle odd moves
      if (newMoves.length % 2 !== 0) {
        setWhiteTime(lm.timeLeft / 1000000000)
        setIsWTA(false)
        setIsBTA(true)
      } else { // even moves
        setBlackTime(lm.timeLeft / 1000000000)
        setIsWTA(true)
        setIsBTA(false)
      }

      if (lm.lan.includes("#")) { // checkmate
        // TODO: playSound(sounds["checkmate"])
      } else if (lm.lan.includes("+")) { // check
        playSound(sounds["check"])
      } else if (lm.lan.includes("x")) { // capture
        playSound(sounds["capture"])
      } else {
        playSound(sounds["move"])
      }
      setValidMoves(lm.vm)
      return newMoves
    })
  }

  function handleEndGame(result: { r: number, w: number }) {
    setResult(result)
    setIsCDA(true)
    setIsWTA(false)
    setIsBTA(false)
  }

  function handleAbortGame() {
    setResult({ r: -1, w: -2 }) // game aborted, no winner.
    setIsCDA(true)
    // stop the timers
    setIsWTA(false)
    setIsBTA(false)
  }

  const sounds = {
    "start": new Audio(startSound),
    "move": new Audio(moveSound),
    "capture": new Audio(captureSound),
    "check": new Audio(checkSound),
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
        return "No winner"
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
        return "game aborted"
    }
  }

  function sendMsg(m: string) {
    if (m.length > 0 && m.length < 100) {
      ws?.sendMsg(m)
    }
  }

  if (isWaiting) {
    return <div className="loader">
      <div className="loaderContent">
        Waiting for the second player
        <div className="dots">
          <div className="loadingDot" />
          <div className="loadingDot" />
          <div className="loadingDot" />
        </div>
      </div>
    </div>
  }

  return (
    <div className="mainContainer">
      <div className="play">
        <div className="soundToggle">
          {soundToggle ?
            <img src={unmute} alt="unmuted"
              onClick={() => setSoundToggle(false)} /> :
            <img src={mute} alt="muted"
              onClick={() => setSoundToggle(true)} />
          }
        </div>

        <Chat
          onSend={sendMsg}
        />

        {game && game.status !== 1 && side ?
          <div className={`boardLayout  ${side === "black" ? "blackLayout" : ""}`}>
            <Miniprofile
              id={game.black.id}
              dur={blackTime}
              ita={isBTA}
            />
            <Board
              side={side}
              validMoves={validMoves}
              lastMove={moves[moves.length - 1]}
              onMove={(m: MoveDTO) => { ws?.move(m) }}
            />
            <Miniprofile
              id={game.white.id}
              dur={whiteTime}
              ita={isWTA}
            />
          </div>
          : null}

        <MovesTable
          moves={moves}
        />
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
          onSubmitText="Home page"
          setIsActive={setIsCDA}
        />
      )}
    </div >
  )
}