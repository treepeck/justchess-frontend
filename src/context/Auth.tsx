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
}

const AuthContext = createContext<AuthCtx>({
  user: new User("err", "err", "err"),
  setUser: (_: User) => { },
})

export function AuthProvider() {
  // Stores the User.
  const [user, setUser] = useState(useContext(AuthContext).user)
  // Stores the current state of completing the async operation.
  // Used to provide a correct rendering.
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const fetchMe = async () => {
      const api = new API()

      const r = await api.getUserByRefreshToken()
      if (r.err != null) {
        const _r = await api.createGuest()
        if (r.err != null) {
          setUser(_r.user as User)
          setIsReady(true)
        }
      } else {
        setUser(r.user as User)
        setIsReady(true)
      }
    }
    fetchMe()
  }, [])

  return (
    <AuthContext.Provider value={{
      user: user, setUser: setUser,
    }} >
      {isReady ? (
        <Outlet /> // render child component when ready with fetching.
      ) : null}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)