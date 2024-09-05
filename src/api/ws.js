import Event from "./event"

/** Describes the interactions using WebSockets.  */
export default class WS {
  /**
   * Establishes a WebSocket connection with the server.
   * The connection is stored in the socket field.
   * It also defines the serverUrl and WebSocket`s protocol fields.
   * @param {User} client
   */
  constructor(client) {
    // define the server url and ws protocol
    this.serverUrl = "localhost:3502"
    this.protocol = "ws://" // TODO: change to the wss after deploying backend
    this.client = client
    this.handlers = new Map()

    // establish a WebSocket connection
    this.socket =
      new WebSocket(`${this.protocol}${this.serverUrl}/ws`, 'echo-protocol')

    this.socket.onerror = () => {
      // TODO: implement error handling
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
   * @returns 
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
   * @returns
  */
  sendEvent(event) {
    this.socket.send(JSON.stringify(event))
  }

  /** Closes the WebSocket connection. */
  closeConnection() {
    this.socket.close()
  }
}
