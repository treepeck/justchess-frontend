import _WebSocket from "../../ws/ws"
import { Result, Status, Color } from "../../game/enums"
import { CompletedMove, LegalMove } from "../../game/move"

type RoomStatus = {
	status: Status
	white: string
	black: string
	clients: number
	control: number
	isVSEngine: boolean
}

export enum Action {
	ADD_CHAT_MESSAGE,
	SET_ENDGAME_INFO,
	SET_ROOM_STATE,
	SET_WHITE_TIME,
	SET_BLACK_TIME,
	SET_CONFIRM_DRAW,
	SET_CONFIRM_RESIGN,
	SET_IS_DONE_FETCHING,
	SET_CURRENT_MOVE_IND,
	END_CURRENT_MOVE_IND,
	INC_CURRENT_MOVE_IND,
	DEC_CURRENT_MOVE_IND,
	SET_IS_PENDING_DRAW_OFFER,
	ADD_MOVE,
	SET_LEGAL_MOVES,
	TOGGLE_DIALOG,
	SET_SOCKET,
}

type State = {
	chat: string[]
	winner: Color
	result: Result
	room: RoomStatus
	whiteTime: number
	blackTime: number
	currentMoveInd: number
	isDoneFetching: boolean
	moves: CompletedMove[]
	legalMoves: LegalMove[]
	isDialogActive: boolean
	socket: _WebSocket | null
	isPendingDrawOffer: boolean
	isConfirmResignActive: boolean
	isConfirmDrawOfferActive: boolean
}

type _Action = {
	type: Action
	payload: any
}

export function reducer(s: State, a: _Action) {
	// Helper function to change the current move index and time on players' clocks.
	const onCurrentMoveIndChange = (ind: number) => {
		const isWhiteMove = ind % 2 == 0
		let whiteTime = s.whiteTime
		let blackTime = s.blackTime
		if (s.room.status == Status.OVER && isWhiteMove) {
			whiteTime = s.moves[ind].t
			blackTime = s.moves[ind - 1]?.t ?? s.room.control
		}
		if (s.room.status == Status.OVER && !isWhiteMove) {
			whiteTime = s.moves[ind - 1]?.t ?? s.room.control
			blackTime = s.moves[ind].t
		}
		return {
			...s,
			currentMoveInd: ind,
			whiteTime: whiteTime,
			blackTime: blackTime
		}
	}

	switch (a.type) {
		case Action.ADD_CHAT_MESSAGE:
			return { ...s, chat: [...s.chat, a.payload] }

		case Action.SET_ENDGAME_INFO:
			return {
				...s,
				winner: a.payload.w,
				result: a.payload.r,
				isDialogActive: true,
			}

		case Action.SET_ROOM_STATE:
			return {
				...s,
				room: {
					status: a.payload.s,
					white: a.payload.w,
					black: a.payload.b,
					clients: a.payload.c,
					isVSEngine: a.payload.e,
					control: a.payload.tc,
				},
				whiteTime: a.payload.wt,
				blackTime: a.payload.bt,
			}

		case Action.SET_WHITE_TIME:
			return { ...s, whiteTime: a.payload }

		case Action.SET_BLACK_TIME:
			return { ...s, blackTime: a.payload }

		case Action.SET_IS_DONE_FETCHING:
			return { ...s, isDoneFetching: a.payload }

		case Action.SET_CURRENT_MOVE_IND:
			return onCurrentMoveIndChange(a.payload)

		case Action.END_CURRENT_MOVE_IND:
			return onCurrentMoveIndChange(s.moves.length - 1)

		case Action.INC_CURRENT_MOVE_IND:
			if (s.currentMoveInd + 1 >= s.moves.length) return { ...s }
			return onCurrentMoveIndChange(++s.currentMoveInd)

		case Action.DEC_CURRENT_MOVE_IND:
			if (s.currentMoveInd == 0) return { ...s }
			return onCurrentMoveIndChange(--s.currentMoveInd)

		case Action.ADD_MOVE:
			const isWhiteMove = (s.moves.length + 1) % 2 !== 0
			return {
				...s,
				whiteTime: isWhiteMove ? a.payload.t : s.whiteTime,
				blackTime: !isWhiteMove ? a.payload.t : s.blackTime,
				currentMoveInd: s.moves.length,
				moves: [...s.moves, a.payload],
				legalMoves: a.payload.l?.map((move: number) => new LegalMove(move)) ?? [],
			}

		case Action.SET_LEGAL_MOVES:
			return { ...s, legalMoves: a.payload }

		case Action.TOGGLE_DIALOG:
			return { ...s, isDialogActive: a.payload }

		case Action.SET_SOCKET:
			return {
				...s,
				socket: a.payload,
				// Set default legal moves when the game starts.
				legalMoves: LegalMove.getDefault(),
			}

		case Action.SET_IS_PENDING_DRAW_OFFER:
			return { ...s, isPendingDrawOffer: a.payload }

		case Action.SET_CONFIRM_DRAW:
			return { ...s, isConfirmDrawOfferActive: a.payload }

		case Action.SET_CONFIRM_RESIGN:
			return { ...s, isConfirmResignActive: a.payload }
	}
}

export const init: State = {
	chat: [],
	winner: Color.None,
	result: Result.Unknown,
	room: { status: Status.OVER, white: "", black: "", control: 0, clients: 0, isVSEngine: false },
	whiteTime: 0,
	blackTime: 0,
	currentMoveInd: 0,
	moves: [],
	legalMoves: [],
	isDoneFetching: false,
	isDialogActive: false,
	socket: null,
	isPendingDrawOffer: false,
	isConfirmResignActive: false,
	isConfirmDrawOfferActive: false,
}