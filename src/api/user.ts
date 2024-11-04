// Represents the User.
export default class User {
  id: string
  username: string
  gamesCount: number
  blitzRating: number
  rapidRating: number
  bulletRating: number

  constructor(
    id: string, username: string, gamesCount: number,
    blitzRating: number, rapidRating: number, bulletRating: number,
    accessToken: string, role: number,
  ) {
    this.id = id
    this.username = username
    this.gamesCount = gamesCount
    this.blitzRating = blitzRating
    this.rapidRating = rapidRating
    this.bulletRating = bulletRating
  }
}