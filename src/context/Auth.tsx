import {
	useState,
	useEffect,
	useContext,
	createContext,
} from "react"
import { Role, User, guest, refresh } from "../http/http"
import { Outlet } from "react-router-dom"

type AuthCtx = {
	user: User
	setUser: React.Dispatch<React.SetStateAction<User>>
	accessToken: string
	setAccessToken: React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = createContext<AuthCtx | null>(null)

export default function AuthProvider() {
	const [isReady, setIsReady] = useState<boolean>(false)
	const [accessToken, setAccessToken] = useState<string>("")
	const [user, setUser] = useState<User>({ id: "", username: "", registeredAt: new Date(0), role: Role.Guest })

	useEffect(() => {
		const getUser = async function () {
			const res = await refresh()
			if (res) {
				setUser({ ...res.user, role: res.role })
				setAccessToken(res.accessToken)
				setIsReady(true)
			} else {
				const user = await guest()
				if (user) {
					setUser({ ...user.user, role: user.role })
					setAccessToken(user.accessToken)
					setIsReady(true)
				}
			}
		}
		getUser()
	}, [])

	return <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>
		{isReady && <Outlet />}
	</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }