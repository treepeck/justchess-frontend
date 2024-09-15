import {
  useState,
  useEffect,
  useContext,
  createContext,
} from "react"

import { Outlet } from "react-router-dom"

import { v4 as uuidv4 } from "uuid"
import API from "../api/api"

const UserContext = createContext()

export function UserProvider() {
  const [user, setUser] = useState(UserContext)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const fetchMe = async () => {
      const api = new API()
      const resUser = await api.getUserByCookie()

      if (typeof resUser !== "string") {
        setUser(resUser)
        setIsReady(true)
      } else {
        const uid = uuidv4()
        const newUser = await api.createGuest(uid)
        if (typeof newUser !== "string") {
          setUser(newUser)
          setIsReady(true)
        }
      }
    }
    fetchMe()
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