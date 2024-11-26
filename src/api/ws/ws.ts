import Event, { EventAction } from "./event"
import User from "../user"
import { MoveDTO } from "../../game/move"

// Describes the interactions with the Manager using WebSockets.
export default class WS {
  private serverUrl: string
  private protocol: string
  private handlers: Map<EventAction, Function>
  socket: WebSocket

  // Establishes a WebSocket connection with the HubManager.
  // The connection is stored in the socket field.
  // It also defines the serverUrl and WebSocket`s protocol fields.
  constructor(at: string) {
    // define the server url and ws protocol
    this.serverUrl = "localhost:3502"
    this.protocol = "ws://"
    this.handlers = new Map()

    // establish a WebSocket connection
    this.socket = new WebSocket(`${this.protocol}${this.serverUrl}/ws?at=${at}`)

    this.socket.onmessage = (e) => {
      // recieve and process the messages from the server
      const eventData = JSON.parse(e.data)
      const event = new Event(eventData.a, eventData.p)
      this.routeEvent(event)
    }
  }

  // Routes the incomming event. Ignores the events that didn`t have a handler.
  routeEvent(e: Event) {
    const h = this.handlers.get(e.a)
    if (!h) {
      return
    }
    h(e.p)
  }

  // The handler will be invoked when the action is emmited.
  setEventHandler(a: EventAction, h: Function) {
    this.handlers.set(a, h)
  }

  // Deletes the event handler.
  clearEventHandler(a: EventAction) {
    this.handlers.delete(a)
  }

  // Sends the specified Event to the server.
  private sendEvent(e: Event) {
    this.socket.send(JSON.stringify(e))
  }

  // Closes the WebSocket connection.
  closeConnection() {
    this.socket.close()
  }

  // Send a create room event with the specified parameters.
  createRoom(c: string, b: number, oId: string) {
    const e = new Event(EventAction.CREATE_ROOM, {
      control: c,
      bonus: b,
      ownerId: oId,
    })
    this.sendEvent(e)
  }

  // Joines a room with the specified id.
  joinRoom(roomId: string) {
    const e = new Event(EventAction.JOIN_ROOM, roomId)
    this.sendEvent(e)
  }

  // Leaves a current room.
  leaveRoom() {
    const e = new Event(EventAction.LEAVE_ROOM, null)
    this.sendEvent(e)
  }

  // Starts a process of getting all availible rooms one by one.
  getRooms() {
    const e = new Event(EventAction.GET_ROOMS, null)
    this.sendEvent(e)
  }

  // Gets the latest data about the specified game.
  getGame(gameId: string) {
    const e = new Event(EventAction.GET_GAME, gameId)
    this.sendEvent(e)
  }

  // Sends the MOVE event with the specified move.
  move(move: MoveDTO) {
    const e = new Event(EventAction.MOVE, move)
    this.sendEvent(e)
  }

  // Sends the chat message.
  sendMsg(m: string) {
    const e = new Event(EventAction.SEND_MESSAGE, m)
    this.sendEvent(e)
  }
}