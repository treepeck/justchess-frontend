import { useEffect } from "react"
import { useAuth } from "../../context/Auth"
import { sendVerify } from "../../http/http"

const action = window.location.search.substring(8, window.location.search.lastIndexOf("&"))
const token = window.location.search.substring(window.location.search.lastIndexOf("=") + 1)

export default function MailVerify() {

	const { setUser, setAccessToken } = useAuth()!

	useEffect(() => {
		const verify = async function () {
			if (!action || !token) { window.location.replace("/404"); return }

			const res = await sendVerify(action, token)
			if (res) {
				setAccessToken(res.accessToken)
				setUser({ ...res.player, role: res.role })
				window.location.replace("/")
			}
		}
		verify()
	}, [])

	return <div></div>
}