/** Describes the interactions with the API.  */
export default class API {
  /** Initializes the server url constant. */
  constructor() {
    this.serverUrl = "http://localhost:3502"
  }

  /**
   * Fetches the user info by Id provided in a userId cookie.
   * @returns {Promise<User | string>}  
   */
  async getUserByCookie() {
    try {
      const res = await fetch(`${this.serverUrl}/auth/cookie`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) {
        return "Unauthorized"
      }

      const user = await res.json()
      return user
    } catch {
      return "Internal server error"
    }
  }

  async getUserById(userId) {
    try {
      const res = await fetch(`${this.serverUrl}/user/id/${userId}`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) {
        return "User not found"
      }
      const user = await res.json()
      return user
    } catch {
      return "Internal server error"
    }
  }

  async createGuest(userId) {
    try {
      const res = await fetch(`${this.serverUrl}/auth/guest`, {
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
      const user = await res.json()
      return user
    } catch {
      return "Internal server error"
    }
  }
}