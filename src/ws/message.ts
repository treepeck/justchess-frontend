// Must be exactly the same as in backend.
export enum MessageType {
	CREATE_ROOM,
	MAKE_MOVE,
	CHAT,
	RESIGN,
	DRAW_OFFER,
	DECLINE_DRAW,
	CLIENTS_COUNTER,
	ADD_ROOM,
	REMOVE_ROOM,
	ROOM_STATUS,
	LAST_MOVE,
	GAME_RESULT,
}

export class Message {
	t: MessageType // Type.
	d: any // Data.

	constructor(t: MessageType, d: any) {
		this.t = t
		this.d = d
	}
}