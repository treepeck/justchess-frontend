import {
  useState,
  useEffect,
  useContext,
  createContext,
} from "react"

import { Outlet } from "react-router-dom"

import WS from "../api/ws/ws"
import { useAuth } from "./Auth"
import { EventAction } from "../api/ws/event"

type ConnCtx = {
  ws: WS | null,
  setWS: (_: WS) => void,
  cc: number, // clients counter.
  ic: boolean, // Connection status | isConnected.  
}

const ConnContext = createContext<ConnCtx>({ ws: null, setWS: (_) => { }, cc: 0, ic: false })

export default function ConnProvider() {
  // Stores the WS connection.
  const [conn, setConn] = useState<WS | null>(null)
  // Stores the currently state of the connection in a boolean value.
  const [isConnected, setIsConnected] = useState(false)
  // Stores the current state of completing the async operation.
  const [clientsCounter, setClientsCounter] = useState(0)
  // Used to provide a correct rendering.
  const [isReady, setIsReady] = useState(false)

  const { user, accessToken } = useAuth()

  useEffect(() => {
    // connect to the WS and store the connection in a state
    const ws = new WS(accessToken)

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
      setConn(ws)
    }

    return () => {
      ws.closeConnection()
    }
  }, [])

  return (
    <ConnContext.Provider value={{
      ws: conn, setWS: setConn,
      cc: clientsCounter, ic: isConnected,
    }}>
      {isReady ? (
        <Outlet /> // render child component when ready with fetching.
      ) : null}
    </ConnContext.Provider>
  )
}

export const useConn = () => useContext(ConnContext)