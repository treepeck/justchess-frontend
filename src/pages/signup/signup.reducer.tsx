export enum Action {
	SET_MAIL,
	SET_USERNAME,
	SET_PASSWORD,
	SET_RESULT_MSG,
	SET_IS_VALIDATING,
}

type State = {
	mail: string,
	isValidMail: boolean,
	username: string,
	isValidUsername: boolean,
	password: string,
	isValidPassword: boolean,
	resultMsg: string,
	isValidating: boolean,
}

export const init: State = {
	mail: "",
	isValidMail: false,
	username: "",
	isValidUsername: false,
	password: "",
	isValidPassword: false,
	resultMsg: "",
	isValidating: false,
}

type _Action = {
	type: Action,
	payload: any,
}

const nameRE = /[a-zA-Z]{1}[a-zA-Z0-9_]+/
const mailRE = /[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z0-9._]+/

export function reducer(s: State, a: _Action) {
	switch (a.type) {
		case Action.SET_MAIL: return {
			...s,
			mail: a.payload,
			isValidMail: mailRE.test(a.payload)
		}
		case Action.SET_USERNAME: return {
			...s,
			username: a.payload,
			isValidUsername: nameRE.test(a.payload)
		}
		case Action.SET_PASSWORD: return {
			...s,
			password: a.payload,
			isValidPassword: a.payload.length > 4 && a.payload.length < 73
		}
		case Action.SET_IS_VALIDATING: return { ...s, isValidating: a.payload }
		case Action.SET_RESULT_MSG: return { ...s, resultMsg: a.payload }
	}
}