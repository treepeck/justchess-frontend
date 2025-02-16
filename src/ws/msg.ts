import { LegalMove } from "../game/move"

// Should be exactly the same as in backend. [justchess/pkg/ws/#MessageType].
export enum MessageType {
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
				this.payload = {
					id: decodeId(byteArr, 0, 16),
					timeControl: byteArr[16],
					timeBonus: byteArr[17],
				}
			} break

			case MessageType.REMOVE_ROOM:
			case MessageType.REDIRECT: {
				this.payload = decodeId(byteArr, 0, 16)
			} break

			case MessageType.GAME_INFO:
				this.payload = {
					whiteId: decodeId(byteArr, 0, 16),
					blackId: decodeId(byteArr, 16, 32),
					result: byteArr[32],
					timeControl: byteArr[33],
					timeBonus: byteArr[34],
				}
				break

			case MessageType.LAST_MOVE:
				// This message consist of three parts: SAN, FEN and legal moves.
				// Parts are separated by a 0xFF byte.
				let sanPart: number[] = []
				let fenPart: number[] = []
				let legalMoves: LegalMove[] = []
				let i;
				for (i = 0; i < byteArr.length - 1; i++) {
					if (byteArr[i] == 0xFF) { break }
					sanPart.push(byteArr[i])
				}
				for (i = i + 1; i < byteArr.length - 1; i++) {
					if (byteArr[i] == 0xFF) { break }
					fenPart.push(byteArr[i])
				}
				for (i = i + 1; i < byteArr.length - 1; i += 3) {
					legalMoves.push(new LegalMove(byteArr[i], byteArr[i + 1],
						byteArr[i + 2]))
				}
				this.payload = {
					san: String.fromCharCode(...sanPart),
					fen: String.fromCharCode(...fenPart),
					legalMoves: legalMoves,
				}
				break

			default:
				this.payload = 0
		}
	}
}

function decodeId(byteArr: Uint8Array, begin: number, end: number): string {
	let id: string = ""
	for (let i = begin; i < end; i++) {
		if (i == (begin + 4) || i == (begin + 6) ||
			i == (begin + 8) || i == (begin + 10)) {
			id += "-"
		}
		id += ((byteArr[i] >> 4) & 0xF).toString(16)
		id += (byteArr[i] & 0xF).toString(16)
	}
	return id
}