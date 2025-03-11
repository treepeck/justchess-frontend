import { LegalMove } from "../game/move"
import { MessageType } from "./message"

export default class _WebSocket {
	private serverUrl: string
	private protocol: string
	socket: WebSocket

	// Establishes a WebSocket connection with the server.
	// The connection is stored in the socket field.
	// It also defines the serverUrl and WebSocket`s protocol fields.
	constructor(url: string, accessToken: string) {
		this.serverUrl = "localhost:3502"
		this.protocol = "ws://"

		// Establish a WebSocket connection.
		this.socket = new WebSocket(`${this.protocol}${this.serverUrl}${url}access=${accessToken}`)
	}

	sendCreateRoom(isVSEngine: boolean, control: number, bonus: number) {
		const msg = JSON.stringify({
			t: MessageType.CREATE_ROOM,
			d: {
				c: control,
				b: bonus,
				e: isVSEngine
			}
		})
		this.socket.send(msg)
	}

	sendMakeMove(move: LegalMove) {
		const msg = JSON.stringify({
			t: MessageType.MAKE_MOVE,
			d: move
		})
		this.socket.send(msg)
	}

	close() {
		this.socket.close()
	}
}