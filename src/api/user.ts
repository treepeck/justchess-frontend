// Represents the User.
export default class User {
  id: string
  username: string
  accessToken: string

  constructor(
    id: string, username: string, accessToken: string,
  ) {
    this.id = id
    this.username = username
    this.accessToken = accessToken
  }
}