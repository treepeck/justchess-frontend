import Game from "../../game/game"
import _WebSocket from "../../ws/ws"
import { Result, Status, Color } from "../../game/enums"

type RoomStatus = {
	status: Status,
	white: string,
	black: string,
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
	ADD_CHAT
}

type State = {
	socket: _WebSocket | null,
	isDialogActive: boolean,
	roomStatus: RoomStatus,
	game: Game,
	whiteTime: number,
	blackTime: number,
	result: Result,
	winner: Color,
	chat: string[],
}

export const init: State = {
	socket: null,
	isDialogActive: false,
	roomStatus: { status: Status.OVER, white: "", black: "", clients: 0, isVSEngine: false },
	game: new Game(),
	whiteTime: 0,
	blackTime: 0,
	result: Result.Unknown,
	winner: Color.None,
	chat: [],
}

type _Action = {
	type: Action,
	payload: any
}

export function reducer(s: State, a: _Action) {
	switch (a.type) {
		case Action.SET_SOCKET:
			return { ...s, socket: a.payload }

		case Action.SET_GAME:
			const isWhiteMove = (s.game.moves.length + 1) % 2 !== 0
			return {
				...s,
				game: {
					moves: [...s.game.moves, a.payload],
					currentFEN: a.payload.f,
					legalMoves: a.payload.l
				},
				whiteTime: isWhiteMove ? a.payload.t : s.whiteTime,
				blackTime: !isWhiteMove ? a.payload.t : s.blackTime,
			}

		case Action.SET_RESULT:
			return {
				...s,
				result: a.payload.r,
				winner: a.payload.w,
				isDialogActive: true
			}

		case Action.TOGGLE_DIALOG:
			return { ...s, isDialogActive: a.payload }

		case Action.SET_WHITE_TIME:
			return { ...s, whiteTime: a.payload }

		case Action.SET_BLACK_TIME:
			return { ...s, blackTime: a.payload }

		case Action.SET_ROOM_STATUS:
			return {
				...s,
				roomStatus: {
					status: a.payload.s,
					white: a.payload.w,
					black: a.payload.b,
					clients: a.payload.c,
					isVSEngine: a.payload.e
				},
				whiteTime: a.payload.wt,
				blackTime: a.payload.bt
			}

		case Action.ADD_CHAT:
			return { ...s, chat: [...s.chat, a.payload] }
	}
}