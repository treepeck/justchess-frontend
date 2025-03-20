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
}

type State = {
	socket: _WebSocket | null,
	isDialogActive: boolean,
	rooms: Room[],
	opponent: string,
	timeBonus: number,
	timeControl: number,
	clientsCounter: number
}

export const init: State = {
	socket: null,
	isDialogActive: false,
	rooms: [],
	opponent: "User",
	timeBonus: 10,
	timeControl: 10,
	clientsCounter: 0,
}

interface IAction {
	type: Action,
	payload: any,
}

export function reducer(state: State, action: IAction) {
	switch (action.type) {
		case Action.SET_SOCKET:
			return { ...state, socket: action.payload }

		case Action.TOGGLE_DIALOG:
			return { ...state, isDialogActive: action.payload }

		case Action.ADD_ROOM:
			return {
				...state,
				// Do not add duplicates.
				rooms: state.rooms.some(room => room.id === action.payload.id)
					? state.rooms
					: [...state.rooms, action.payload]
			}

		case Action.REMOVE_ROOM:
			return {
				...state,
				rooms: state.rooms.filter(room => room.id !== action.payload)
			}

		case Action.SET_OPPONENT:
			return { ...state, opponent: action.payload }

		case Action.SET_TIME_CONTROL:
			return { ...state, timeControl: action.payload }

		case Action.SET_TIME_BONUS:
			return { ...state, timeBonus: action.payload }

		case Action.SET_CLIENTS_COUNTER:
			return { ...state, clientsCounter: action.payload }
	}
}