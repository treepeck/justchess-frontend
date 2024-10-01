import React, {
  useState,
  useEffect,
  useContext,
  createContext,
} from "react"

import { Outlet } from "react-router-dom"

import { v4 as uuidv4 } from "uuid"
import API from "../api/api"
import User from "../api/user"

class UserCtx {
  /** @type {User} */
  user
  /** @type {Function} */
  setUser

  /**
   * @param {User} user 
   * @param {Function} setUser 
   */
  constructor(user, setUser) {
    this.user = user
    this.setUser = setUser
  }
}

/**
 * @type {React.Context<UserCtx>}
 */
const UserContext = createContext(new UserCtx(
  new User("err", "err", 0, 0, 0, 0),
  () => { }
))

export function UserProvider() {
  /**
   * Stores the User.
   * @type {[User, Function]} 
   */
  const [user, setUser] = useState(useContext(UserContext).user)
  /**
   * Stores the current state of completing the async operation.
   * @type {[boolean, Function]} 
   */
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
    <UserContext.Provider value={new UserCtx(user, setUser)}>
      {isReady ? (
        <Outlet />
      ) : null}
    </UserContext.Provider>
  )
}

export const useAuth = () => useContext(UserContext)