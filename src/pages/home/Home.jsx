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
    <div className="mainContainer">
      <div className={styles.contentContainer}>
        <h1>Welcome, {user.username}!</h1>


        <div className={styles.lobbyContainer}>
          <h2>Availible games: </h2>
          <table>
            <tr>
              <th>Control</th>
              <th>Time bonus<br />(sec.)</th>
              <th>User</th>
              <th>Rating</th>
            </tr>
            {rooms?.map((room, _) =>
              <tr>
                <td>
                  {room.control}
                </td>
                <td>
                  {room.bonus}
                </td>
                <td>
                  {room.ownerName}
                </td>
                <td>
                  {room.ownerRating}
                </td>
              </tr>
            )}
          </table>
        </div >
      </div>

      <div>Players online: {clientsCounter}</div>
    </div>
  )
}