import { CompletedMove, LegalMove } from "../game/move"

// Must be exactly the same as in backend.
export enum MessageType {
	// Sent by clients. 
	GET_AVAILIBLE_GAMES,
	CREATE_GAME,
	JOIN_GAME,
	GET_GAME,
	LEAVE_GAME,
	MAKE_MOVE,
	// Sent by server.
	CLIENTS_COUNTER,
	ADD_GAME,
	REMOVE_GAME,
	REDIRECT,
	GAME_INFO,
	LAST_MOVE,
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

			case MessageType.ADD_GAME:
				this.payload = {
					id: decodeId(byteArr, 0, 16),
					timeControl: byteArr[16],
					timeBonus: byteArr[17],
				}
				break

			case MessageType.REMOVE_GAME:
			case MessageType.REDIRECT:
				this.payload = decodeId(byteArr, 0, 16)
				break

			case MessageType.GAME_INFO:
				// The COMPLETED_MOVE contains two parts: SAN and FEN.
				// Parts are separated by a 0xFF byte.
				this.payload = {
					whiteId: decodeId(byteArr, 0, 16),
					blackId: decodeId(byteArr, 16, 32),
					status: byteArr[32],
					result: byteArr[33],
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