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

type _Action = {
	type: Action,
	payload: any
}

export function reducer(s: State, a: _Action) {
	switch (a.type) {
		case Action.SET_SELECTED:
			return { ...s, selected: a.payload }

		case Action.ADD_MARKED:
			return { ...s, marked: [...s.marked, a.payload] }

		case Action.REMOVE_MARKED:
			return { ...s, marked: s.marked.filter(el => el !== a.payload) }

		case Action.CLEAR_MARKED:
			return { ...s, marked: [] }

		case Action.TOGGLE_DIALOG:
			return { ...s, isDialogActive: a.payload }

		case Action.SET_PROMOTION_MOVE:
			return { ...s, promotionMove: a.payload }
	}
}