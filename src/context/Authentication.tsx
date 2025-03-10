import HTTP from "../http/http"
import User from "../http/user"
import { Outlet } from "react-router-dom"
import { createContext, useContext, useEffect, useState } from "react"

type AuthenticationCtx = {
	user: User,
	accessToken: string,
	setUser: (_: User) => void
}

const AuthenticationContext = createContext<AuthenticationCtx>({
	user: new User("", "", 0, 0, 0, 0, 0, new Date(), false, 0, ""),
	accessToken: "",
	setUser: (_: User) => { }
})

export default function AuthenticationProvider() {
	const [user, setUser] = useState<User | null>(null)
	const [isReady, setIsReady] = useState<boolean>(false)
	const [accessToken, setAccessToken] = useState<string | null>(null)

	useEffect(() => {
		const fetchMe = async function () {
			const api = new HTTP()

			const r = await api.getUserByRefreshToken()
			if (r == null) {
				const g = await api.createGuest()
				if (g != null) {
					setUser(g)

					const t = await api.refreshTokens()
					if (t != null) {
						setAccessToken(t)
						setIsReady(true)
					}
				}
			} else {
				setUser(r)

				const t = await api.refreshTokens()
				if (t != null) {
					setAccessToken(t)
					setIsReady(true)
				}
			}
		}
		fetchMe()
	}, [])

	return isReady && (
		<AuthenticationContext.Provider value={{
			user: user!,
			accessToken: accessToken!,
			setUser: setUser
		}}>
			<Outlet />
		</AuthenticationContext.Provider>
	)
}

export function useAuthentication() { return useContext(AuthenticationContext) } 