// Client and server communicate by sending events.
export default class Event {
  a: EventAction // Action.
  p: any    // Payload.

  constructor(a: EventAction, p: any) {
    this.a = a
    this.p = p
  }
}

// Enum for storing types of event actions.
export enum EventAction {
  CREATE_ROOM = "cr",
  JOIN_ROOM = "jr",
  LEAVE_ROOM = "lr",
  GET_ROOMS = "gr",
  GET_GAME = "gg",
  MOVE = "m",
  CLIENTS_COUNTER = "cc",
  REDIRECT = "r",
  ADD_ROOM = "ar",
  REMOVE_ROOM = "rr",
  LAST_MOVE = "lm",
  VALID_MOVES = "vm",
  MOVES = "mh",
  STATUS = "s",
  GAME_INFO = "gi",
  UPDATE_TIME = "ut",
  // ERRORS
  UNPROCESSABLE_ENTITY = "ue",
  CREATE_ROOM_ERR = "cre",
  JOIN_ROOM_ERR = "jre",
}