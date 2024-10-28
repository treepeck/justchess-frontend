/** Represents a client or server event. */
export default class Event {
  /**
   * Creates a new Event.
   * @param {string} a action.
   * @param {*} p payload.
   */
  constructor(a, p) {
    /** @type {string} */
    this.a = a
    /** @type {*} */
    this.p = p
  }
}

/**
* Enum for storing types of event action.
* @readonly 
* @enum {string}
*/
export const EventAction = {
  CREATE_ROOM: "cr",
  JOIN_ROOM: "jr",
  LEAVE_ROOM: "lr",
  GET_ROOMS: "gr",
  GET_GAME: "gg",
  MOVE: "m",
  CLIENTS_COUNTER: "cc",
  REDIRECT: "r",
  ADD_ROOM: "ar",
  REMOVE_ROOM: "rr",
  UPDATE_BOARD: "ub",
  VALID_MOVES: "vm",
  MOVES: "mh",
  STATUS: "s",
  // ERRORS
  UNPROCESSABLE_ENTITY: "ue",
  CREATE_ROOM_ERR: "cre",
  JOIN_ROOM_ERR: "jre",
}