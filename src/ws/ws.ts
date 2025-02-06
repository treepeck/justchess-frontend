import { MessageType } from "./msg"

export default class _WebSocket {
	private serverUrl: string
	private protocol: string
	socket: WebSocket

	// Establishes a WebSocket connection with the server (see Manager type).
	// The connection is stored in the socket field.
	// It also defines the serverUrl and WebSocket`s protocol fields.
	constructor() {
		this.serverUrl = "localhost:3502"
		this.protocol = "ws://"

		// Establish a WebSocket connection.
		this.socket = new WebSocket(`${this.protocol}${this.serverUrl}/ws`)
		this.socket.binaryType = "arraybuffer"
	}

	sendGetRooms() {
		const data = new Uint8Array(1)
		data[0] = MessageType.GET_ROOMS
		this.socket.send(data)
	}

	sendCreateRoom(control: number, bonus: number) {
		const data = new Uint8Array(3)
		data[0] = control
		data[1] = bonus
		data[2] = MessageType.CREATE_ROOM
		this.socket.send(data)
	}

	sendJoinRoom(id: string) {
		let withoutDashes = ""
		for (let i = 0; i < id.length; i++) {
			if (i == 8 || i == 13 || i == 18 || i == 23) {
				continue
			}
			withoutDashes += id[i]
		}

		const data = new Uint8Array(17)
		for (let i = 0; i < 16; i++) {
			console.log(withoutDashes.substring(i * 2, (i * 2) + 2))
			data[i] = parseInt(withoutDashes.substring(i * 2, (i * 2) + 2), 16)
		}
		data[16] = MessageType.JOIN_ROOM
		this.socket.send(data)
	}

	close() {
		this.socket.close()
	}
}