import {
	useState,
	useEffect,
	useContext,
	createContext,
} from "react"
import { Role, Player, guest, refresh } from "../http/http"
import { Outlet } from "react-router-dom"

type AuthCtx = {
	player: Player
	setUser: React.Dispatch<React.SetStateAction<Player>>
	accessToken: string
	setAccessToken: React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = createContext<AuthCtx | null>(null)

export default function AuthProvider() {
	const [isReady, setIsReady] = useState<boolean>(false)
	const [accessToken, setAccessToken] = useState<string>("")
	const [player, setUser] = useState<Player>({
		id: "", username: "", createdAt: "",
		role: Role.Guest
	})

	useEffect(() => {
		const getUser = async function () {
			const res = await refresh()
			if (res) {
				setUser({ ...res.player, role: res.role })
				setAccessToken(res.accessToken)
				setIsReady(true)
			} else {
				const player = await guest()
				if (player) {
					setUser({ ...player.player, role: player.role })
					setAccessToken(player.accessToken)
					setIsReady(true)
				}
			}
		}
		getUser()
	}, [])

	return <AuthContext.Provider value={{ player, setUser, accessToken, setAccessToken }}>
		{isReady && <Outlet />}
	</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }