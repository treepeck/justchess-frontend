import { LegalMove } from "../game/move"
import { MessageType } from "./msg"

export default class _WebSocket {
	private serverUrl: string
	private protocol: string
	socket: WebSocket

	// Establishes a WebSocket connection with the server.
	// The connection is stored in the socket field.
	// It also defines the serverUrl and WebSocket`s protocol fields.
	constructor(accessToken: string) {
		this.serverUrl = "localhost:3502"
		this.protocol = "ws://"

		// Establish a WebSocket connection.
		this.socket = new WebSocket(`${this.protocol}${this.serverUrl}/ws?access=${accessToken}`)
		this.socket.binaryType = "arraybuffer"
	}

	sendGetAvailibleGames() {
		const data = new Uint8Array(1)
		data[0] = MessageType.GET_AVAILIBLE_GAMES
		this.socket.send(data)
	}

	sendCreateGame(control: number, bonus: number) {
		const data = new Uint8Array(3)
		data[0] = control
		data[1] = bonus
		data[2] = MessageType.CREATE_GAME
		this.socket.send(data)
	}

	sendJoinGame(id: string) {
		const data = this.encodeId(id)
		data[16] = MessageType.JOIN_GAME
		this.socket.send(data)
	}

	sendGetGame() {
		const data = new Uint8Array(1)
		data[0] = MessageType.GET_GAME
		this.socket.send(data)
	}

	sendLeaveGame() {
		const data = new Uint8Array(1)
		data[0] = MessageType.LEAVE_GAME
		this.socket.send(data)
	}

	sendMakeMove(move: LegalMove) {
		const data = new Uint8Array(4)
		data[0] = move.to
		data[1] = move.from
		data[2] = move.type
		data[3] = MessageType.MAKE_MOVE
		this.socket.send(data)
	}

	private encodeId(id: string): Uint8Array {
		// Remove the dashes from the uuid string.
		let withoutDashes = ""
		for (let i = 0; i < id.length; i++) {
			if (i == 8 || i == 13 || i == 18 || i == 23) {
				continue
			}
			withoutDashes += id[i]
		}

		const data = new Uint8Array(17)
		for (let i = 0; i < 16; i++) {
			data[i] = parseInt(withoutDashes.substring(i * 2, (i * 2) + 2), 16)
		}
		return data
	}

	close() {
		this.socket.close()
	}
}