import React, {
  useState,
  useEffect,
  useContext,
  createContext
} from "react"

import { useNavigate, useLocation, Outlet } from "react-router-dom"

import WS from "../api/ws/ws"
import { useAuth } from "./useAuth"
import { EventAction } from "../api/ws/event"

class ConnCtx {
  /** @type {WS | null} */
  ws
  /** @type {Function} */
  setWs
  /** @type {number} */
  clientsCounter
  /** @type {boolean} */
  isConnected

  /**
   * @param {WS | null} ws 
   * @param {Function} setWs
   * @param {number} clientsCounter 
   * @param {boolean} isConnected
   */
  constructor(ws, setWs, clientsCounter, isConnected) {
    this.ws = ws
    this.setUser = setWs
    this.isConnected = isConnected
    this.clientsCounter = clientsCounter
  }
}

/**
 * @type {React.Context<ConnCtx>}
 */
const ConnectionContext = createContext(new ConnCtx(null, () => { }, 0, false))

export default function ConnectionProvider() {
  /**
   * Stores the WS connection.
   * @type {[WS | null, Function]} 
   */
  const [connection, setConnection] = useState(null)
  /**
   * Stores the currently state of the connection in a boolean value.
   * @type {[boolean, Function]} 
   */
  const [isConnected, setIsConnected] = useState(false)
  /**
   * Stores the current state of completing the async operation.
   * @type {[boolean, Function]} 
   */
  const [isReady, setIsReady] = useState(false)
  /**
   * Stores the number of currenlty connected clients.
   * @type {[number, Function]} 
   */
  const [clientsCounter, setClientsCounter] = useState(0)

  const user = useAuth()?.user

  useEffect(() => {
    // @ts-ignore
    // connect to the WS and store the connection in a state
    // at this point we know that the user is a valid User object.
    const ws = new WS(user.id)

    ws.setEventHandler(EventAction.CLIENTS_COUNTER, setClientsCounter)

    ws.socket.onclose = () => {
      setIsConnected(false)
      setClientsCounter(0)
      setIsReady(true)
    }

    ws.socket.onopen = () => {
      setIsConnected(true)
      setIsReady(true)
      // store the active connection
      setConnection(ws)
    }

    return () => {
      ws.closeConnection()
    }
  }, [])

  return (
    <ConnectionContext.Provider value={new ConnCtx(
      connection, setConnection, clientsCounter, isConnected
    )}
    >
      {
        isReady ? (
          <Outlet />
        ) : null
      }
    </ConnectionContext.Provider>
  )
}

export const useConnection = () => useContext(ConnectionContext)