import User from "./user"

// Describes the interactions with the API.
export default class API {
  private serverUrl: string

  constructor() {
    this.serverUrl = "http://localhost:3502"
  }

  // Fetches the user info by id provided in a userId cookie.
  // May return error string.
  async getUserByAccessToken(at: string):
    Promise<{ user: User | null, err: string | null }> {
    try {
      const r = await fetch(`${this.serverUrl}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": "Bearer " + at
        }
      })

      if (!r.ok) {
        return { user: null, err: "Unauthorized" }
      }

      const u: User = await r.json()
      return { user: u, err: null }
    } catch {
      return { user: null, err: "Internal server error" }
    }
  }

  // Fetches the user info by id.
  // May return error string.
  async getUserById(userId: string):
    Promise<{ user: User | null, err: string | null }> {
    try {
      const r = await fetch(`${this.serverUrl}/user/id/${userId}`, {
        method: "GET",
        credentials: "include",
      })

      if (!r.ok) {
        return { user: null, err: "User not found" }
      }

      const u: User = await r.json()
      return { user: u, err: null }
    } catch {
      return { user: null, err: "Internal server error" }
    }
  }

  // Registers a new guest.
  // May return error string.
  async createGuest():
    Promise<{ at: string | null, err: string | null }> {
    try {
      const r = await fetch(`${this.serverUrl}/auth/guest`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!r.ok) {
        return { at: null, err: "Conflict. Try to reload the page" }
      }

      const at: string = await r.text()
      return { at: at, err: null }
    } catch {
      return { at: null, err: "Internal server error" }
    }
  }

  // Tries to update refresh and access tokens.
  // It only will succeed if the refresh token is valid and
  // is stored in a http-only cookie.
  // Returns encoded access token and error string. 
  async getTokens(): Promise<{ at: string, err: string }> {
    try {
      const r = await fetch(`${this.serverUrl}/auth/tokens`, {
        method: "GET",
        credentials: "include"
      })
      if (!r.ok) {
        return { at: "", err: "Unauthorized" }
      }

      const accessToken = await r.text()
      return { at: accessToken, err: "" }
    } catch {
      return { at: "", err: "Internal server error" }
    }
  }
}