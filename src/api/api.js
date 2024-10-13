import { GameDTO } from "../game/game"
import User from "./user"

/** Describes the interactions with the API.  */
export default class API {
  /** @type {string} serverUrl */
  #serverUrl

  /** Initializes the server url constant. */
  constructor() {
    this.#serverUrl = "http://localhost:3502"
  }

  /**
   * Fetches the user info by Id provided in a userId cookie.
   * @returns {Promise<User | string>}  
   */
  async getUserByCookie() {
    try {
      const res = await fetch(`${this.#serverUrl}/auth/cookie`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) {
        return "Unauthorized"
      }

      /** @type {User} */
      const user = await res.json()
      return user
    } catch {
      return "Internal server error"
    }
  }

  /**
   * Fetches the user info by Id.
   * @param {string} userId 
   * @returns {Promise<User | string>} 
   */
  async getUserById(userId) {
    try {
      const res = await fetch(`${this.#serverUrl}/user/id/${userId}`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) {
        return "User not found"
      }

      /** @type {User} */
      const user = await res.json()
      return user
    } catch {
      return "Internal server error"
    }
  }

  /**
   * Registers a new guest. 
   * @param {string} userId
   * @returns {Promise<User | string>}
   */
  async createGuest(userId) {
    try {
      const res = await fetch(`${this.#serverUrl}/auth/guest`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId
        })
      })
      if (!res.ok) {
        return "Conflict. Try to reload the page"
      }

      /** @type {User} */
      const user = await res.json()
      return user
    } catch {
      return "Internal server error"
    }
  }
}