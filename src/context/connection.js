import {
  useState,
  useEffect,
  useContext,
  createContext
} from "react"

import { Outlet } from "react-router-dom"

import WS from "../api/ws/ws"
import { useAuth } from "./useAuth"

const ConnectionContext = createContext()

export default function ConnectionProvider() {
  const [connection, setConnection] = useState(ConnectionContext)
  const [isConnected, setIsConnected] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const [clientsCounter, setClientsCounter] = useState(0)

  const { user } = useAuth()

  useEffect(() => {
    // connect to the WS and store the connection in a state
    const ws = new WS(user.id)

    ws.setEventHandler("UPDATE_CLIENTS_COUNTER", setClientsCounter)

    ws.socket.onclose = () => {
      setIsConnected(false)
      setClientsCounter(0)
      setIsReady(true)
    }

    ws.socket.onopen = () => {
      setIsConnected(true)
      setIsReady(true)
      setConnection(ws)
    }

    return () => {
      ws.closeConnection()
    }
  }, [])

  return (
    <ConnectionContext.Provider value={{ ws: connection, clientsCounter: clientsCounter, isConnected: isConnected }}>
      {
        isReady ? (
          <Outlet />
        ) : null
      }
    </ConnectionContext.Provider>
  )
}

export const useConnection = () => useContext(ConnectionContext)