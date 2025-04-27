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
		this.serverUrl = process.env.REACT_APP_WEBSOCK_URL!
		this.protocol = process.env.REACT_APP_WEBSOCK_PROTO!

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

	sendChat(data: string) {
		const msg = JSON.stringify({
			t: MessageType.CHAT,
			d: {
				m: data
			}
		})
		this.socket.send(msg)
	}

	sendResign() {
		const msg = JSON.stringify({
			t: MessageType.RESIGN,
			d: null
		})
		this.socket.send(msg)
	}

	sendDrawOffer() {
		const msg = JSON.stringify({
			t: MessageType.DRAW_OFFER,
			d: null
		})
		this.socket.send(msg)
	}

	sendDeclineDraw() {
		const msg = JSON.stringify({
			t: MessageType.DECLINE_DRAW,
			d: null
		})
		this.socket.send(msg)
	}

	close() {
		this.socket.close()
	}
}