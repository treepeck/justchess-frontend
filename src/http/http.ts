const serverUrl = "http://localhost:3502"

export enum Role {
	Guest,
	User
}

export type User = {
	id: string
	username: string
	registeredAt: Date
	role: Role
}

export type Register = {
	mail: string
	username: string
	password: string
}

type UserDTO = {
	user: User
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

export async function signIn(login: string, password: string): Promise<UserDTO | null> {
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

export async function sendVerify(action: string, token: string): Promise<UserDTO | null> {
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

export async function refresh(): Promise<UserDTO | null> {
	try {
		const res = await fetch(`${serverUrl}/auth`, {
			method: "GET",
			credentials: "include",
		})
		if (!res.ok) { return null }

		return await res.json()
	} catch {
		return null
	}
}

export async function guest(): Promise<UserDTO | null> {
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