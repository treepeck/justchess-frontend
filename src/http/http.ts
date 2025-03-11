import { CompletedMove, LegalMove } from "../game/move"
import User from "./user"

export default class HTTP {
	private serverUrl: string

	constructor() {
		this.serverUrl = "http://localhost:3502"
	}

	// Registers a new guest.
	async createGuest(): Promise<User | null> {
		try {
			const r = await fetch(`${this.serverUrl}/auth/`, {
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			})
			if (!r.ok) { return null }

			return await r.json()
		} catch {
			return null
		}
	}

	// Fetches the user info by refresh token provided in a request cookie.
	async getUserByRefreshToken(): Promise<User | null> {
		try {
			const r = await fetch(`${this.serverUrl}/auth/`, {
				method: "GET",
				credentials: "include",
			})

			if (!r.ok) { return null }

			return await r.json()
		} catch {
			return null
		}
	}

	// Tries to update refresh and access tokens.
	// It only will succeed if the refresh token is valid and
	// is stored in a http-only cookie.
	async refreshTokens(): Promise<string | null> {
		try {
			const r = await fetch(`${this.serverUrl}/auth/tokens`, {
				method: "GET",
				credentials: "include",
			})
			if (!r.ok) { return null }

			return await r.text()
		} catch {
			return null
		}
	}
}