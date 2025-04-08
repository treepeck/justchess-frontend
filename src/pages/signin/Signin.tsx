import { useReducer } from "react"
import { useTheme } from "../../context/Theme"
import Input from "../../components/input/Input"
import Header from "../../components/header/Header"
import Button from "../../components/button/Button"
import { reducer, Action, init } from "./signin.reducer"
import Dialog from "../../components/dialog/Dialog"
import { useAuth } from "../../context/Auth"
import { reset, signIn } from "../../http/http"

export default function Signin() {
	const { theme } = useTheme()!
	const { setUser, setAccessToken } = useAuth()!
	const [state, dispatch] = useReducer(reducer, init)

	function submit() {
		signIn(state.login, state.password)
			.then(res => {
				if (res) {
					setUser(res.player)
					setAccessToken(res.accessToken)
					window.location.replace("/")
				} else {
					dispatch({ type: Action.SET_RESULT_MSG, payload: "Incorrect username or password." })
				}
			})
	}

	function passwordResetHandler() {
		dispatch({ type: Action.SET_IS_DIALOG_ACTIVE, payload: false })
		dispatch({ type: Action.SET_IS_VALIDATING, payload: true })

		reset({ mail: state.login, password: state.password })
			.then(res => {
				if (res) {
					dispatch({
						type: Action.SET_RESULT_MSG, payload: "Please, check your email to confirm the reset. " +
							"It may take several minutes for the email to be delivered and it may end up in spam."
					})
				} else {
					dispatch({
						type: Action.SET_RESULT_MSG, payload: "Invalid mail or password. Please, try again."
					})
				}
				dispatch({ type: Action.SET_IS_VALIDATING, payload: false })
			})
	}

	return <main data-theme={theme}>
		<Header />

		<form onSubmit={e => e.preventDefault()}>
			<h2>Sign In</h2>

			<section>
				<Input
					type="username"
					hasIcon={false}
					isValid={false}
					minLength={2}
					maxLength={120}
					placeholder="Username or email"
					onChange={e =>
						dispatch({ type: Action.SET_LOGIN, payload: e.target.value })
					}
				/>
			</section>

			<section>
				<Input
					type="password"
					hasIcon={false}
					isValid={false}
					minLength={5}
					maxLength={72}
					placeholder="Password"
					onChange={e =>
						dispatch({ type: Action.SET_PASSWORD, payload: e.target.value })
					}
				/>
			</section>

			{state.resultMsg != "" && (<p className="result">
				{state.resultMsg}
			</p>)}

			<Button
				text="Submit"
				onClick={submit}
			/>

			<footer>
				Not registered? <a href="http://localhost:3000/signup">Sign Up</a>
				<br />
				<br />
				Forgot password? <button onClick={() =>
					dispatch({ type: Action.SET_IS_DIALOG_ACTIVE, payload: true })
				}>Reset here</button>
			</footer>
		</form>

		{state.isValidating && <Dialog caption="Processing..." onClick={() => { }}>
			<></>
		</Dialog>}

		{state.isDialogActive && <Dialog caption="Password reset" onClick={() =>
			dispatch({ type: Action.SET_IS_DIALOG_ACTIVE, payload: false })
		}>
			<form onSubmit={e => e.preventDefault()}>
				<Input
					type="email"
					hasIcon={false}
					isValid={false}
					minLength={6}
					maxLength={120}
					placeholder="Email for reset"
					onChange={e =>
						dispatch({ type: Action.SET_LOGIN, payload: e.target.value })
					}
				/>
				<Input
					type="password"
					hasIcon={false}
					isValid={false}
					minLength={5}
					maxLength={72}
					placeholder="New password"
					onChange={e =>
						dispatch({ type: Action.SET_PASSWORD, payload: e.target.value })
					}
				/>
				<Button text="Reset" onClick={passwordResetHandler} />
			</form>
		</Dialog>}
	</main>
}