import { refresh } from "../http/http"
import { User } from "../http/types"
import { Outlet } from "react-router-dom"
import { createContext, useContext, useEffect, useState } from "react"

type AuthenticationCtx = {
	user: User,
	accessToken: string,
	setUser: (_: User) => void
}

const AuthenticationContext = createContext<AuthenticationCtx>({
	user: { id: "", username: "", registeredAt: new Date(Date.now()) },
	accessToken: "",
	setUser: (_: User) => { }
})

export default function AuthenticationProvider() {
	const [user, setUser] = useState<User | null>(null)
	const [isReady, setIsReady] = useState<boolean>(false)
	const [accessToken, setAccessToken] = useState<string | null>(null)

	useEffect(() => {
		const fetchMe = async function () {
			// First of all, refresh tokens to gain access to the server resources.
			const accessToken = await refresh()
			if (accessToken) {
				const username = localStorage.getItem("username")

			} else {

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