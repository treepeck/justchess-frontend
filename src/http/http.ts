import { Game } from "../game/game"
import { Color, Result } from "../game/enums"

const serverUrl = process.env.REACT_APP_DOMAIN

export enum Role {
	Guest,
	Player
}

export type Player = {
	id: string
	username: string
	createdAt: string
	isEngine: boolean
	role: Role
}

export type Register = {
	mail: string
	username: string
	password: string
}

type PlayerDTO = {
	player: Player
	accessToken: string
	role: Role
}

export type PasswordReset = {
	mail: string
	password: string // New password.
}

export type ShortGameDTO = {
	id: string
	wn: string // White username.
	bn: string // Black username.
	wid: string // White id.
	bid: string // Black id.
	r: Result
	w: Color // Winner.
	m: number // Number or completed moves.
	tc: number // Time control.
	tb: number // Time bonus.
	ca: string // Created at.
}

export async function signUp(r: Register): Promise<boolean> {
	try {
		const res = await fetch(`${serverUrl}/auth/signup`, {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(r)
		})
		return res.ok
	} catch {
		return false
	}
}

export async function signIn(login: string, password: string): Promise<PlayerDTO | null> {
	try {
		const res = await fetch(`${serverUrl}/auth/signin`, {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({ login: login, password: password })
		})
		if (!res.ok) return null

		return await res.json()
	} catch {
		return null
	}
}

export async function sendVerify(action: string, token: string): Promise<PlayerDTO | null> {
	try {
		const res = await fetch(`${serverUrl}/auth/verify?action=${action}&token=${token}`, {
			method: "GET",
			credentials: "include"
		})
		if (!res.ok) return null

		return await res.json()
	} catch {
		return null
	}
}

export async function refresh(): Promise<PlayerDTO | null> {
	try {
		const res = await fetch(`${serverUrl}/auth/refresh`, {
			method: "GET",
			credentials: "include",
		})
		if (!res.ok) { return null }

		return await res.json()
	} catch {
		return null
	}
}

export async function guest(): Promise<PlayerDTO | null> {
	try {
		const res = await fetch(`${serverUrl}/auth/guest`, {
			method: "GET",
			credentials: "include",
		})
		if (!res.ok) { return null }

		return await res.json()
	} catch {
		return null
	}
}

export async function reset(pr: PasswordReset): Promise<boolean> {
	try {
		const res = await fetch(`${serverUrl}/auth/reset`, {
			method: "POST",
			body: JSON.stringify(pr)
		})
		return res.ok
	} catch {
		return false
	}
}

export async function getPlayerById(id: string, accessToken: string): Promise<Player | null> {
	try {
		const res = await fetch(`${serverUrl}/api/player/id/${id}`, {
			method: "GET",
			headers: {
				"Authorization": "Bearer " + accessToken
			}
		})
		if (!res.ok) return null

		return await res.json()
	} catch {
		return null
	}
}

export async function getGamesByPlayerId(id: string, accessToken: string): Promise<ShortGameDTO[]> {
	try {
		const res = await fetch(`${serverUrl}/game/player/${id}`, {
			method: "GET",
			headers: {
				"Authorization": "Bearer " + accessToken
			}
		})
		if (!res.ok) return []

		return await res.json()
	} catch {
		return []
	}
}

export async function getGameById(id: string, accessToken: string): Promise<Game | null> {
	try {
		const res = await fetch(`${serverUrl}/game/id/${id}`, {
			method: "GET",
			headers: {
				"Authorization": "Bearer " + accessToken
			}
		})
		if (!res) return null

		return await res.json()
	} catch {
		return null
	}
}