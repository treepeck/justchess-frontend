/** This class represents the user DTO. */
export default class User {
  /**
   * Creates a new user.
   * @param {string} id 
   * @param {string} username 
   * @param {number} gamesCount 
   * @param {number} blitzRating 
   * @param {number} rapidRating 
   * @param {number} bulletRating
   */
  constructor(
    options
  ) {
    for (const key in options) {
      this[key] = options[key]
    }
  }
}