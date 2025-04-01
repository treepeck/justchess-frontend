export enum Action {
	SET_LOGIN,
	SET_PASSWORD,
	SET_RESULT_MSG,
	SET_IS_VALIDATING,
	SET_IS_DIALOG_ACTIVE,
}

type State = {
	login: string // Mail or username.
	password: string
	resultMsg: string
	isValidating: boolean
	isDialogActive: boolean
}

export const init: State = {
	login: "",
	password: "",
	resultMsg: "",
	isValidating: false,
	isDialogActive: false,
}

type _Action = {
	type: Action,
	payload: any,
}

export function reducer(s: State, a: _Action) {
	switch (a.type) {
		case Action.SET_LOGIN: return { ...s, login: a.payload }
		case Action.SET_PASSWORD: return { ...s, password: a.payload }
		case Action.SET_RESULT_MSG: return { ...s, resultMsg: a.payload }
		case Action.SET_IS_VALIDATING: return { ...s, isValidating: a.payload }
		case Action.SET_IS_DIALOG_ACTIVE: return { ...s, isDialogActive: a.payload }
	}
}