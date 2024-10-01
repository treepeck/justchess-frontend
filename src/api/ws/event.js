/** Represents a client or server event. */
export default class Event {
  /**
   * Creates a new Event.
   * @param {string} action 
   * @param {*} payload 
   */
  constructor(action, payload) {
    /** @type {string} */
    this.action = action
    /** @type {*} */
    this.payload = payload
  }
}

