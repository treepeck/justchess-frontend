import { useEffect } from "react"
import { useAuth } from "../../context/Auth"
import { sendVerify } from "../../http/http"
import { useTheme } from "../../context/Theme"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function MailVerify() {
	const { theme } = useTheme()!
	const navigate = useNavigate()
	const [params, _] = useSearchParams()
	const { setUser, setAccessToken } = useAuth()!

	useEffect(() => {
		const verify = async function () {
			const action = params.get("action")
			const token = params.get("token")

			if (!action || !token) { return }

			const res = await sendVerify(action, token)
			if (res) {
				setAccessToken(res.accessToken)
				setUser({ ...res.user, role: res.role })
				navigate("/")
			}
		}
		verify()
	}, [])

	return <main data-theme={theme}>
		<h1>
			The requested token wasn't found.
			<br />
			<a href="http://localhost:3000/signin">Sign in</a>
		</h1>
	</main>
}