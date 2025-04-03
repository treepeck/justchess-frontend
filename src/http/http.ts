const serverUrl = "http://localhost:3502"

export enum Role {
	Guest,
	Player
}

export type Player = {
	id: string
	username: string
	createdAt: string
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

export async function getUserByName(name: string, accessToken: string): Promise<Player | null> {
	try {
		const res = await fetch(`${serverUrl}/player/name/${name}`, {
			method: "GET",
			headers: {
				"Authorization": "Bearer " + accessToken
			}
		})
		if (!res.ok) return null

		return res.json()
	} catch {
		return null
	}
}

export async function getUserById(id: string, accessToken: string): Promise<Player | null> {
	try {
		const res = await fetch(`${serverUrl}/player/id/${id}`, {
			method: "GET",
			headers: {
				"Authorization": "Bearer " + accessToken
			}
		})
		if (!res.ok) return null

		return res.json()
	} catch {
		return null
	}
}

export async function commend(name: string, accessToken: string): Promise<boolean> {
	try {
		const res = await fetch(`${serverUrl}/player/${name}`, {
			method: "POST",
			headers: {
				"Authorization": "Bearer " + accessToken
			}
		})
		return res.ok
	} catch {
		return false
	}
}