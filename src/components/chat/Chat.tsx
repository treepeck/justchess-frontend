import "./Chat.css"
import _WebSocket from "../../ws/ws"
import { useEffect, useState } from "react"

type ChatProps = {
	socket: _WebSocket,
}

export default function Chat({ socket }: ChatProps) {
	const [msg, setMsg] = useState("")
	const [isInFocus, setIsInFocus] = useState<boolean>(false)
	const [messages, setMessages] = useState<string[]>(["hi", "hello", "hi", "hello", "hi", "hello", "hi", "hello"])

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
			socket.sendChat(msg)
			setMsg("")
		}
	}

	return (
		<div className="chat">
			<p>Chat</p>

			<div className="messages">
				{messages.map((msg, index) => (
					<div className="message" key={index}>
						{msg}
					</div>
				))}
			</div>

			<div className="input-container">
				<input
					type="text"
					value={msg}
					placeholder="Enter your messages here"
					autoComplete="off"
					onFocus={() => setIsInFocus(true)}
					onChange={e => setMsg(e.target.value)}
					onBlur={() => setIsInFocus(false)}
				/>
				<button
					onClick={() => {
						socket.sendChat(msg)
						setMsg("")
					}}
				/>
			</div>
		</div>
	)
}