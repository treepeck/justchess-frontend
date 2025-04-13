import _WebSocket from "../../ws/ws"
import { Result, Status, Color } from "../../game/enums"
import { CompletedMove, LegalMove } from "../../game/move"

type RoomStatus = {
	status: Status,
	white: string,
	black: string,
	clients: number,
	isVSEngine: boolean
}

export enum Action {
	SET_SOCKET,
	SET_WHITE_TIME,
	SET_BLACK_TIME,
	ADD_MOVE,
	SET_CURRENT_MOVE_INDEX,
	SET_CURRENT_MOVE_INDEX_TO_LAST, // To the last move.
	INCR_CURRENT_MOVE_INDEX,
	DECR_CURRENT_MOVE_INDEX,
	SET_RESULT,
	TOGGLE_DIALOG,
	SET_ROOM_STATUS,
	ADD_CHAT,
}

type State = {
	socket: _WebSocket | null
	isDialogActive: boolean
	roomStatus: RoomStatus
	whiteTime: number
	blackTime: number
	moves: CompletedMove[]
	currentMoveInd: number
	legalMoves: LegalMove[]
	result: Result
	winner: Color
	chat: string[]
}

export const init: State = {
	socket: null,
	isDialogActive: false,
	roomStatus: { status: Status.OVER, white: "", black: "", clients: 0, isVSEngine: false },
	moves: [],
	legalMoves: LegalMove.getDefault(),
	whiteTime: 0,
	blackTime: 0,
	result: Result.Unknown,
	winner: Color.None,
	currentMoveInd: 0,
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

		case Action.ADD_MOVE:
			const isWhiteMove = (s.moves.length + 1) % 2 !== 0
			return {
				...s,
				moves: [...s.moves, a.payload],
				fen: a.payload.f,
				legalMoves: a.payload.l,
				whiteTime: isWhiteMove ? a.payload.t : s.whiteTime,
				blackTime: !isWhiteMove ? a.payload.t : s.blackTime,
				currentMoveInd: s.moves.length
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

		case Action.SET_CURRENT_MOVE_INDEX:
			return { ...s, currentMoveInd: a.payload }

		case Action.SET_CURRENT_MOVE_INDEX_TO_LAST:
			return { ...s, currentMoveInd: s.moves.length - 1 }

		case Action.INCR_CURRENT_MOVE_INDEX: {
			const newInd = s.currentMoveInd + 1 < s.moves.length ? s.currentMoveInd + 1 : s.currentMoveInd
			return { ...s, currentMoveInd: newInd }
		}

		case Action.DECR_CURRENT_MOVE_INDEX: {
			const newInd = s.currentMoveInd > 0 ? s.currentMoveInd - 1 : s.currentMoveInd
			return { ...s, currentMoveInd: newInd }
		}
	}
}