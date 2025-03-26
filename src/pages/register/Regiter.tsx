// Styling.
import "./Register.css"

// Components.
import Input from "../../components/input/Input"
import Header from "../../components/header/Header"
import Button from "../../components/button/Button"
import Dialog from "../../components/dialog/Dialog"

// React stuff.
import { useState, useEffect } from "react"
import { signUp } from "../../http/http"
import { useTheme } from "../../context/Theme"

const mailRE = /[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z0-9._]+/
const nameRE = /[a-zA-Z]{1}[a-zA-Z0-9_]+/

export default function Register() {
	const { theme } = useTheme()

	const [mail, setMail] = useState<string>("")
	const [username, setUsername] = useState<string>("")
	const [password, setPassword] = useState<string>("")

	const [isValidMail, setIsValidMail] = useState<boolean>(false)
	const [isValidUsername, setIsValidUsername] = useState<boolean>(false)
	const [isValidPassword, setIsValidPassword] = useState<boolean>(false)

	const [resultMsg, setResultMsg] = useState<string>("")
	const [isValidating, setIsValidating] = useState<boolean>(false)

	useEffect(() => {
		setIsValidMail(mailRE.test(mail))
	}, [mail])

	useEffect(() => {
		setIsValidUsername(nameRE.test(username))
	}, [username])

	useEffect(() => {
		setIsValidPassword(password.length > 4 && password.length < 73)
	}, [password])

	return (
		<div className="main-container" data-theme={theme}>
			<Header />

			<main>
				<section>
					<Input
						type="mail"
						isValid={isValidMail}
						minLength={6}
						maxLength={100}
						placeholder="Email"
						onChange={e => setMail(e.target.value)}
					/>
					{!isValidMail && (<p>
						Please, enter a valid email.
					</p>)}
				</section>

				<section>
					<Input
						type="username"
						isValid={isValidUsername}
						minLength={2}
						maxLength={36}
						placeholder="Username"
						onChange={e => setUsername(e.target.value)}
					/>
					{!isValidUsername && (<p>
						2 to 36 characters. Allowed only english characters, numbers, and '_'.
					</p>)}
				</section>

				<section>
					<Input
						type="password"
						isValid={isValidPassword}
						minLength={5}
						maxLength={72}
						placeholder="Password"
						onChange={e => setPassword(e.target.value)}
					/>
					{!isValidPassword && (<p>
						5 to 72 characters. Allowed any characters, digits, special symbols.
					</p>)}
				</section>

				<p>We only use email for password reset.</p>

				{resultMsg != "" && (<p className="result">
					{resultMsg}
				</p>)}

				<Button
					text="Submit"
					onClick={() => {
						if (!isValidMail || !isValidPassword || !isValidUsername) return
						setIsValidating(true)
						signUp({ mail: mail, username: username, password: password })
							.then(res => {
								if (res) {
									setResultMsg("You have been successfully registered! " +
										"Please, check your email to confirm a registration. " +
										"It may take several minutes for the email to be delivered and it may end up in spam."
									)
								} else {
									setResultMsg("The user cannot be registered. Username and email must be unique.")
								}
								setIsValidating(false)
							})
					}}
				/>

				<div className="form-footer">
					Already registered? <a href="http://localhost:3000/signin">Sign In</a>.
				</div>
			</main>

			{isValidating && (<Dialog caption="Processing..." onClick={() => { }}>
				<></>
			</Dialog>)}
		</div>
	)
}
