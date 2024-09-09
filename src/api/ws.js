import Event from "./event"

/** Describes the interactions using WebSockets.  */
export default class WS {
  /**
   * Establishes a WebSocket connection with the server.
   * The connection is stored in the socket field.
   * It also defines the serverUrl and WebSocket`s protocol fields.
   * @param {string} userId
   */
  constructor(userId) {
    // define the server url and ws protocol
    this.serverUrl = "localhost:3502"
    this.protocol = "ws://" // TODO: change to the wss after deploying backend
    this.userId = userId
    this.handlers = new Map()

    // establish a WebSocket connection
    this.socket =
      new WebSocket(`${this.protocol}${this.serverUrl}/ws?id=${userId}`)

    this.socket.onerror = () => {
      // TODO: implement error handling
    }

    this.socket.onopen = () => {
      const event = new Event("GET_ROOMS", null)
      this.sendEvent(event)
    }

    this.socket.onmessage = (ev) => {
      // recieve and process all messages from the server
      const eventData = JSON.parse(ev.data)
      const event = new Event(eventData.action, eventData.payload)
      this.routeEvent(event)
    }
  }

  /**
   * Invokes the handler when the action is emmited.
   * @param {string} action 
   * @param {callback} handler
   */
  setEventHandler(action, handler) {
    this.handlers.set(action, handler)
  }

  /**
   * Routes the incomming event.
   * @param {Event} event 
   */
  routeEvent(event) {
    const handler = this.handlers.get(event.action)
    if (handler) {
      handler(event.payload)
    } else {
      alert("Event cannot be handled")
    }
  }

  /** Sends the specified Event to the server.
   * @param {Event} event
  */
  sendEvent(event) {
    this.socket.send(JSON.stringify(event))
  }

  /** Closes the WebSocket connection. */
  closeConnection() {
    this.socket.close()
  }

  /**
   * Creates a room with the specified parameters.
   * @param {string} control 
   * @param {number} bonus 
   */
  createRoom(control, bonus) {
    const e = new Event("CREATE_ROOM", {
      control: control,
      bonus: bonus,
    })
    this.sendEvent(e)
  }

  /**
   * Joines a room with the specified id.
   * @param {string} roomId 
   */
  joinRoom(roomId) {
    const e = new Event("JOIN_ROOM", JSON.stringify(roomId))
    this.sendEvent(e)
  }
}
