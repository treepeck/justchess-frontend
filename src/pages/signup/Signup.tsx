import "./Signup.css"

import { useReducer } from "react"
import { Action, init, reducer } from "./signup.reducer"

import { signUp } from "../../http/http"
import { useTheme } from "../../context/Theme"

import Input from "../../components/input/Input"
import Header from "../../components/header/Header"
import Button from "../../components/button/Button"
import Dialog from "../../components/dialog/Dialog"


export default function Signup() {
	const { theme } = useTheme()!
	const [state, dispatch] = useReducer(reducer, init)

	function submit() {
		if (!state.isValidMail || !state.isValidPassword || !state.isValidUsername) return

		dispatch({ type: Action.SET_IS_VALIDATING, payload: true })

		signUp({ mail: state.mail, username: state.username, password: state.password })
			.then(res => {
				if (res) {
					dispatch({
						type: Action.SET_RESULT_MSG, payload: "You have been successfully registered! " +
							"Please, check your email to confirm the registration. " +
							"It may take several minutes for the email to be delivered and it may end up in spam."
					})
				} else {
					dispatch({
						type: Action.SET_RESULT_MSG, payload: "The player cannot be registered. Username and email must be unique."
					})
				}

				dispatch({ type: Action.SET_IS_VALIDATING, payload: false })
			})
	}

	return <main data-theme={theme}>
		<Header />

		<form onSubmit={e => e.preventDefault()}>
			<h2>Sign Up</h2>

			<section>
				<Input
					type="email"
					hasIcon={true}
					isValid={state.isValidMail}
					minLength={6}
					maxLength={120}
					placeholder="Email"
					onChange={e =>
						dispatch({ type: Action.SET_MAIL, payload: e.target.value })
					}
				/>
				{!state.isValidMail && <p>
					Please, enter a valid email.
				</p>}
			</section>

			<section>
				<Input
					type="username"
					hasIcon={true}
					isValid={state.isValidUsername}
					minLength={2}
					maxLength={36}
					placeholder="Username"
					onChange={e =>
						dispatch({ type: Action.SET_USERNAME, payload: e.target.value })
					}
				/>
				{!state.isValidUsername && <p>
					2 to 36 characters. Allowed only english characters, numbers, and '_'.
				</p>}
			</section>

			<section>
				<Input
					type="password"
					hasIcon={true}
					isValid={state.isValidPassword}
					minLength={5}
					maxLength={72}
					placeholder="Password"
					onChange={e =>
						dispatch({ type: Action.SET_PASSWORD, payload: e.target.value })
					}
				/>
				{!state.isValidPassword && (<p>
					5 to 72 characters. Allowed any characters, digits, special symbols.
				</p>)}
			</section>

			<p>We only use email for password reset.</p>

			{state.resultMsg != "" && (<p className="result">
				{state.resultMsg}
			</p>)}

			<Button
				text="Submit"
				onClick={submit}
			/>

			<footer>
				Already registered? <a href="http://localhost:3000/signin">Sign In</a>
			</footer>
		</form>

		{/* {state.isValidating && (<Dialog caption="Processing..." onClick={() => { }}>
			<></>
		</Dialog>)} */}
	</main>
}