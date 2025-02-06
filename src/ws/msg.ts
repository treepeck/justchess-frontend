// Should be exactly the same as in backend. [justchess/pkg/ws/#MessageType].
export enum MessageType {
	GET_ROOMS,
	CREATE_ROOM,
	JOIN_ROOM,
	LEAVE_ROOM,
	MOVE,
	CLIENTS_COUNTER,
	ADD_ROOM,
	REMOVE_ROOM,
	REDIRECT,
	CHAT,
	LAST_MOVE,
	MOVES,
	STATUS,
	GAME_INFO,
	RESULT,
	ABORT,
}

export default class Message {
	type: MessageType
	payload: any

	// Decodes the incomming message. 
	constructor(byteArr: Uint8Array) {
		// The last byte stores a message type.
		this.type = byteArr[byteArr.length - 1]
		switch (this.type) {
			case MessageType.CLIENTS_COUNTER:
				this.payload = byteArr[0] | byteArr[1] << 8 |
					byteArr[2] << 16 | byteArr[3] << 24
				break

			case MessageType.ADD_ROOM: {
				let id: string = ""
				for (let i = 0; i < 16; i++) {
					if (i == 4 || i == 6 || i == 8 || i == 10) {
						id += "-"
					}
					id += ((byteArr[i] >> 4) & 0xF).toString(16)
					id += (byteArr[i] & 0xF).toString(16)
				}
				this.payload = {
					id: id,
					timeControl: byteArr[16],
					timeBonus: byteArr[17],
				}
			} break

			case MessageType.REMOVE_ROOM:
			case MessageType.REDIRECT: {
				let id: string = ""
				for (let i = 0; i < 16; i++) {
					if (i == 4 || i == 6 || i == 8 || i == 10) {
						id += "-"
					}
					id += ((byteArr[i] >> 4) & 0xF).toString(16)
					id += (byteArr[i] & 0xF).toString(16)
				}
				this.payload = id
			} break

			default:
				this.payload = 0
		}
	}
}

