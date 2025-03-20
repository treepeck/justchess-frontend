enum Role {
	Guest,
	User,
}

export default class User {
	id: string
	username: string
	registeredAt: Date
	role: Role
	accessToken: string

	constructor(id: string, name: string,
		registeredAt: Date, role: Role, accessToken: string
	) {
		this.id = id
		this.username = name
		this.registeredAt = registeredAt
		this.role = role
		this.accessToken = accessToken
	}
}