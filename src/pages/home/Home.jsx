import styles from "./home.module.css"

import {
  useRef,
  useState,
  useEffect,
} from "react"

import WS from "../../api/ws"
import { useAuth } from "../../context/useAuth"

export default function Home() {

  const { user } = useAuth()

  const [rooms, setRooms] = useState([])
  const [clientsCounter, setClientsCounter] = useState(0)

  const ws = useRef()

  useEffect(() => {
    ws.current = new WS(user)

    // set up event handlers
    ws.current.setEventHandler("UPDATE_CLIENTS_COUNTER", setClientsCounter)
    ws.current.setEventHandler("UPDATE_ROOMS", setRooms)

    return () => {
      ws.current.closeConnection()
    }
  }, [])

  return (
    <div>
      <div>Welcome, {user.username}</div>
      <div>Clients counter: {clientsCounter}</div>
    </div>

  )
}