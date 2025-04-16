import "./Chat.css"
import Input from "../input/Input"
import _WebSocket from "../../ws/ws"
import { useEffect, useRef, useState } from "react"

type ChatProps = {
	socket: _WebSocket
	messages: string[]
}

export default function Chat({ socket, messages }: ChatProps) {
	const [msg, setMsg] = useState<string>("")
	const isInFocus = useRef<boolean>(false)
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown)

		return () => {
			window.removeEventListener("keydown", onKeyDown)
		}
	}, [isInFocus, msg])

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
	}, [messages])

	function onKeyDown(e: KeyboardEvent) {
		if (!isInFocus.current || (e.code != "Enter" && e.code != "NumpadEnter") ||
			msg.length < 1) return

		socket.sendChat(msg)
		setMsg("")
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

				<div ref={scrollRef} />
			</div>

			<div className="input-container">
				<input
					type="text"
					value={msg}
					placeholder="Enter your messages here"
					autoComplete="off"
					onFocus={() => isInFocus.current = true}
					onBlur={() => isInFocus.current = false}
					onChange={e => setMsg(e.target.value)}
					maxLength={200}
					minLength={1}
				/>
				<button
					onClick={() => {
						if (msg.length > 1) {
							socket.sendChat(msg)
							setMsg("")
						}
					}}
				/>
			</div>
		</div>
	)
}