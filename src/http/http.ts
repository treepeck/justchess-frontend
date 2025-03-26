import { Register } from "./types"

const serverUrl = "http://localhost:3502"

export async function signUp(r: Register): Promise<boolean> {
	try {
		const res = await fetch(`${serverUrl}/auth/signup`, {
			method: "POST",
			body: JSON.stringify(r)
		})
		return res.ok
	} catch {
		return false
	}
}

export async function sendVerify(id: string): Promise<string | null> {
	try {
		const res = await fetch(`${serverUrl}/auth/verify?id=${id}`, {
			method: "GET"
		})
		if (!res.ok) return null

		return await res.text()
	} catch {
		return null
	}
}

export async function refresh(): Promise<string | null> {
	try {
		const res = await fetch(`${serverUrl}/auth/`, {
			method: "GET",
			credentials: "include",
		})
		if (!res.ok) { return null }

		return await res.text()
	} catch {
		return null
	}
}