import {
  useState,
  useEffect,
  useContext,
  createContext,
} from "react"

import { Outlet } from "react-router-dom"

import User from "../api/user"
import { v4 as uuidv4 } from "uuid"

const UserContext = createContext()

export function UserProvider() {
  const [user, setUser] = useState(UserContext)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const uid = uuidv4()
    const user = new User({
      id: uid,
      username: "Guest-" + uid.substring(0, 8),
      gamesCount: 0,
      blitzRating: 400,
      rapidRating: 400,
      bulletRating: 400,
    })

    setUser(user)
    setIsReady(true)
  }, [])

  return (
    <UserContext.Provider value={{ user: user, setUser }}>
      {
        isReady ? (
          <Outlet />
        ) : null
      }
    </UserContext.Provider>
  )
}

export const useAuth = () => useContext(UserContext)