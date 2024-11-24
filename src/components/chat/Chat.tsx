import "./Chat.css"

import send from "../../assets/send.png"
import { useEffect, useState } from "react"
import { useConn } from "../../context/Conn"
import { EventAction } from "../../api/ws/event"

type ChatProps = {
  onSend: (m: string) => void
}

export default function Chat({ onSend }: ChatProps) {

  const { ws, ic } = useConn()

  const [msg, setMsg] = useState("")
  const [isInFocus, setIsInFocus] = useState(false)
  const [allMsg, setAllMsg] = useState<string[]>([
    "system: Each player has 20s to make the first move."
  ])

  useEffect(() => {
    if (!ic) {
      return
    }

    ws?.setEventHandler(EventAction.CHAT_MESSAGE, (m: string) => {
      setAllMsg((prevMsgs) => [...prevMsgs, m])
    })

    return () => {
      ws?.clearEventHandler(EventAction.CHAT_MESSAGE)
    }
  }, [])

  // Listen to keyboard events if the chat input is selected to enable sending 
  // messages by pressing Enter.
  useEffect(() => {
    if (isInFocus) {
      document.addEventListener("keydown", handleSendByEnter)
    } else {
      document.removeEventListener("keydown", handleSendByEnter)
    }

    // clean up to prevent possible memory leaks.
    return () => {
      document.removeEventListener("keydown", handleSendByEnter)
    }
  }, [isInFocus, msg])

  function handleSendByEnter(e: KeyboardEvent) {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault()
      onSend(msg)
      setMsg("")
    }
  }

  return (
    <div className="chat">
      <p>Chat</p>

      <li>
        {allMsg.map((m, ind) => (
          <ul key={ind}>
            {m}
          </ul>
        ))}
      </li>

      <div className="inputWrap">
        <input
          type="text"
          value={msg ?? ""}
          placeholder="Enter your messages here"
          autoComplete="off"
          onChange={e => setMsg(e.target.value)}
          onFocus={() => setIsInFocus(true)}
          onBlur={() => setIsInFocus(false)}
        />
        <img
          className="sendMsg"
          alt="send message"
          onClick={() => {
            onSend(msg)
            setMsg("")
          }}
          src={send}
        />
      </div>
    </div>
  )
}