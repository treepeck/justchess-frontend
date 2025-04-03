import _WebSocket from "../../ws/ws"

type Room = {
	id: string,
	p: string[], // Connected clients' id.
	cr: string, // Creator's username.
	c: number, // Time control.
	b: number // Time bonus.
}

export enum Action {
	SET_SOCKET,
	TOGGLE_DIALOG,
	ADD_ROOM,
	REMOVE_ROOM,
	SET_OPPONENT,
	SET_TIME_BONUS,
	SET_TIME_CONTROL,
	SET_CLIENTS_COUNTER,
	SET_ERROR_MSG,
}

type State = {
	socket: _WebSocket | null
	isDialogActive: boolean
	rooms: Room[]
	opponent: string
	timeBonus: number
	timeControl: number
	clientsCounter: number
	errorMsg: string
}

export const init: State = {
	socket: null,
	isDialogActive: false,
	rooms: [],
	opponent: "User",
	timeBonus: 10,
	timeControl: 10,
	clientsCounter: 0,
	errorMsg: "",
}

type _Action = {
	type: Action,
	payload: any,
}

export function reducer(s: State, a: _Action) {
	switch (a.type) {
		case Action.SET_SOCKET: return { ...s, socket: a.payload }

		case Action.TOGGLE_DIALOG: return { ...s, isDialogActive: a.payload }

		case Action.ADD_ROOM:
			return {
				...s,
				// Do not add duplicates.
				rooms: s.rooms.some(room => room.id === a.payload.id)
					? s.rooms
					: [...s.rooms, a.payload]
			}

		case Action.REMOVE_ROOM:
			return { ...s, rooms: s.rooms.filter(room => room.id !== a.payload.id) }

		case Action.SET_OPPONENT: return { ...s, opponent: a.payload }

		case Action.SET_TIME_CONTROL: return { ...s, timeControl: a.payload }

		case Action.SET_TIME_BONUS: return { ...s, timeBonus: a.payload }

		case Action.SET_CLIENTS_COUNTER: return { ...s, clientsCounter: a.payload }

		case Action.SET_ERROR_MSG: return { ...s, errorMsg: a.payload }
	}
}