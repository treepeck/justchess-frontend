enum Role {
	Guest,
	User,
}

export default class User {
	id: string
	name: string
	likes: number
	gamesCount: number
	blitzRating: number
	rapidRating: number
	bulletRating: number
	registeredAt: Date
	isDeleted: boolean
	role: Role
	accessToken: string

	constructor(id: string, name: string, likes: number, gamesCount: number,
		blitzRating: number, rapidRating: number, bulletRating: number,
		registeredAt: Date, isDeleted: boolean, role: Role, accessToken: string
	) {
		this.id = id
		this.name = name
		this.likes = likes
		this.gamesCount = gamesCount
		this.blitzRating = blitzRating
		this.bulletRating = bulletRating
		this.rapidRating = rapidRating
		this.registeredAt = registeredAt
		this.isDeleted = isDeleted
		this.role = role
		this.accessToken = accessToken
	}
}