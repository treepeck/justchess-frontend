import { LegalMove } from "../../game/move"

export enum Action {
	ADD_MARKED,
	REMOVE_MARKED,
	CLEAR_MARKED,
	SET_SELECTED,
	TOGGLE_DIALOG,
	SET_PROMOTION_MOVE,
}

type State = {
	marked: number[],
	selected: number | null,
	isDialogActive: boolean,
	promotionMove: LegalMove | null
}

export const init: State = {
	marked: [],
	selected: null,
	isDialogActive: false,
	promotionMove: null,
}

export interface IAction {
	type: Action,
	payload: any
}

export function reducer(state: State, action: IAction) {
	switch (action.type) {
		case Action.SET_SELECTED:
			return { ...state, selected: action.payload }

		case Action.ADD_MARKED:
			return { ...state, marked: [...state.marked, action.payload] }

		case Action.REMOVE_MARKED:
			return { ...state, marked: state.marked.filter(el => el !== action.payload) }

		case Action.CLEAR_MARKED:
			return { ...state, marked: [] }

		case Action.TOGGLE_DIALOG:
			return { ...state, isDialogActive: action.payload }

		case Action.SET_PROMOTION_MOVE:
			return { ...state, promotionMove: action.payload }
	}
}