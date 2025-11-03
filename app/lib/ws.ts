'use client';

import { WebSocketEvent } from './definitions';

const GATEKEEPER_URL = process.env.NEXT_PUBLIC_GATEKEEPER_URL!;

/*
WebSocketClient wraps a WebSocket connection socket and provides methods for
sending messages.
*/
export default class WebSocketClient {
  socket: WebSocket;

  /*
  Establishes a WebSocket connection with the server.  The connection is
  stored in the socket field.
  */
  constructor(roomId: string) {
    // Trim to get a valid WebSocket url.
    this.socket = new WebSocket(`${GATEKEEPER_URL}/ws?rid=${roomId}`);
  }

  sendEvent(e: WebSocketEvent) {
    this.socket.send(JSON.stringify(e));
  }

  /*
  close must be called each time the page that uses the WebSocket connection
  is closed.
  */
  close() {
    this.socket.close();
  }
}
