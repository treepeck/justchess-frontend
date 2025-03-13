import Game from "../../game/game"
import _WebSocket from "../../ws/ws"
import { Result, Status } from "../../game/enums"
import { CompletedMove } from "../../game/move"

type RoomStatus = {
	status: Status,
	whiteId: string,
	blackId: string,
	clients: number,
	isVSEngine: boolean
}

export enum Action {
	SET_SOCKET,
	SET_GAME,
	SET_WHITE_TIME,
	SET_BLACK_TIME,
	SET_RESULT,
	TOGGLE_DIALOG,
	SET_ROOM_STATUS,
}

type State = {
	socket: _WebSocket | null,
	isDialogActive: boolean,
	roomStatus: RoomStatus,
	game: Game,
	whiteTime: number,
	blackTime: number,
	result: Result,
}

export const init: State = {
	socket: null,
	isDialogActive: false,
	roomStatus: { status: Status.OVER, whiteId: "", blackId: "", clients: 0, isVSEngine: false },
	game: new Game(),
	whiteTime: 0,
	blackTime: 0,
	result: Result.Unknown,
}

export interface IAction {
	type: Action,
	payload: any
}

export function reducer(state: State, action: IAction) {
	switch (action.type) {
		case Action.SET_SOCKET:
			return { ...state, socket: action.payload }

		case Action.SET_GAME:
			const isWhiteMove = (state.game.moves.length + 1) % 2 !== 0
			return {
				...state,
				game: {
					moves: [...state.game.moves, action.payload],
					currentFEN: action.payload.f,
					legalMoves: action.payload.l
				},
				whiteTime: isWhiteMove ? action.payload.t : state.whiteTime,
				blackTime: !isWhiteMove ? action.payload.t : state.blackTime,
			}

		case Action.SET_RESULT:
			return { ...state, result: action.payload, isDialogActive: true }

		case Action.TOGGLE_DIALOG:
			return { ...state, isDialogActive: action.payload }

		case Action.SET_WHITE_TIME:
			return { ...state, whiteTime: action.payload }

		case Action.SET_BLACK_TIME:
			return { ...state, blackTime: action.payload }

		case Action.SET_ROOM_STATUS:
			return {
				...state,
				roomStatus: {
					status: action.payload.s,
					whiteId: action.payload.w,
					blackId: action.payload.b,
					clients: action.payload.c,
					isVSEngine: action.payload.e
				},
				whiteTime: action.payload.wt,
				blackTime: action.payload.bt
			}
	}
}