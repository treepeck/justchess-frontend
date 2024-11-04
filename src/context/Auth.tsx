import {
  useState,
  useEffect,
  useContext,
  createContext,
} from "react"

import { Outlet } from "react-router-dom"

import API from "../api/api"
import User from "../api/user"

type AuthCtx = {
  user: User,
  setUser: (u: User) => void
  accessToken: string
}

const AuthContext = createContext<AuthCtx>({
  user: new User("err", "err", 0, 0, 0, 0, "", 0),
  setUser: (_: User) => { },
  accessToken: "",
})

export function AuthProvider() {
  // Stores the User.
  const [user, setUser] = useState(useContext(AuthContext).user)
  const [accessToken, setAccessToken] = useState<string>("")
  // Stores the current state of completing the async operation.
  // Used to provide a correct rendering.
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const fetchMe = async () => {
      const api = new API()
      const r = await api.getTokens()

      let at: string = ""
      // if the err is not null, the user was not signed in or 
      // the refresh token has expired. In both cases, the user will be 
      // signed in as a new guest.
      if (r.err !== null) {
        const _r = await api.createGuest()
        if (_r.err === null) {
          at = _r.at as string
        }
      } else {
        at = r.at
      }
      setAccessToken(at)
      const _r = await api.getUserByAccessToken(at)
      setUser(_r.user as User)
      setIsReady(true)
    }
    fetchMe()
  }, [])

  return (
    <AuthContext.Provider value={{
      user: user, setUser: setUser, accessToken: accessToken
    }} >
      {isReady ? (
        <Outlet /> // render child component when ready with fetching.
      ) : null}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)