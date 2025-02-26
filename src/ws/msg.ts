import { Status } from "../game/enums"
import { CompletedMove, LegalMove } from "../game/move"

// Must be exactly the same as in backend.
export enum MessageType {
	// Sent by clients. 
	MAKE_MOVE,

	// Sent by server.
	ROOM_INFO,
	GAME,
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
			case MessageType.ROOM_INFO:
				if (byteArr[0] == Status.IN_PROGRESS) {
					this.payload = {
						status: byteArr[0],
						whiteId: decodeId(byteArr, 1, 17),
						blackId: decodeId(byteArr, 17, 33)
					}
				} else {
					this.payload = {
						status: byteArr[0]
					}
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

			case MessageType.GAME: {
				// Parse completed moves:
				let i = 0
				const moves: CompletedMove[] = []

				// The 0xAF byte separates the completed moves from current legal moves.
				for (; byteArr[i] != 0xAF;) {
					let san = ""
					let fen = ""
					for (; byteArr[i] != 0xFF; i++) {
						san += String.fromCharCode(byteArr[i])
					}
					for (i = i + 1; byteArr[i] != 0xFF; i++) {
						fen += String.fromCharCode(byteArr[i])
					}
					i++
					moves.push(new CompletedMove(san, fen))
				}

				const legalMoves: LegalMove[] = []
				for (i = i + 1; i < byteArr.length - 1; i += 3) {
					legalMoves.push(new LegalMove(byteArr[i], byteArr[i + 1], byteArr[i + 2]))
				}

				this.payload = {
					moves: moves,
					legalMoves: legalMoves
				}
			} break
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