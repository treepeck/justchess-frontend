import "./Chat.css"
import _WebSocket from "../../ws/ws"
import { useState } from "react"
import Input from "../input/Input"

type ChatProps = {
	socket: _WebSocket,
	chat: string[],
}

export default function Chat({ socket, chat }: ChatProps) {
	const [msg, setMsg] = useState("")

	return (
		<div className="chat">
			<p>Chat</p>

			<div className="messages">
				{chat.map((msg, index) => (
					<div className="message" key={index}>
						{msg}
					</div>
				))}
			</div>

			<div className="input-container">
				<Input
					type="text"
					placeholder="Enter your messages here"
					onChange={e => setMsg(e.target.value)}
					maxLength={200}
					minLength={1}
					hasIcon={false}
					isValid={false}
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