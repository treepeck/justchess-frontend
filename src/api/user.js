/**
 * Represents the user.
 */
export default class User {
  /** @type {string} */
  id
  /** @type {string} */
  username
  /** @type {number} */
  gamesCount
  /** @type {number} */
  blitzRating
  /** @type {number} */
  rapidRating
  /** @type {number} */
  bulleRating

  /**
   * Creates a new user.
   * @param {string} id 
   * @param {string} username 
   * @param {number} gamesCount 
   * @param {number} blitzRating 
   * @param {number} rapidRating 
   * @param {number} bulletRating
   */
  constructor(id, username, gamesCount,
    blitzRating, rapidRating, bulletRating
  ) {
    this.id = id
    this.username = username
    this.gamesCount = gamesCount
    this.blitzRating = blitzRating
    this.rapidRating = rapidRating
    this.bulleRating = bulletRating
  }
}