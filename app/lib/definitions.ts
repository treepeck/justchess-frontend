export interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebSocketEvent {
  a: EventAction;
  p: any;
}

/*
Must be exactly the same values as in gatekeeper/pkg/event/event.go
*/
export enum EventAction {
  // Recieved from server.
  Ping = 0,
  GameInfo = 1,
  Redirect = 2,
  CompletedMove = 3,
  ClientsCounter = 4,

  // Sended by client.
  Pong = 9,
  MakeMove = 10,
  EnterMatchmaking = 11,
  Chat = 12,
}
