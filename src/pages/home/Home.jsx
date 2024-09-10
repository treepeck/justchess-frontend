import styles from "./home.module.css"
import Button from "../../components/button/Button"

import error from "../../assets/error.png"
import check from "../../assets/check.png"

import {
  useRef,
  useState,
  useEffect,
} from "react"
import { useNavigate } from "react-router-dom"

import HubWS from "../../api/ws"
import { useAuth } from "../../context/useAuth"

export default function Home() {

  const { user } = useAuth()

  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [clientsCounter, setClientsCounter] = useState(0)
  const [control, setControl] = useState("bullet")
  const [bonus, setBonus] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  const ws = useRef()

  useEffect(() => {
    ws.current = new HubWS(user.id)

    // set up event handlers
    ws.current.setEventHandler("UPDATE_CLIENTS_COUNTER", setClientsCounter)
    ws.current.setEventHandler("UPDATE_ROOMS", setRooms)
    ws.current.setEventHandler("CHANGE_ROOM", handleChangeRoom)
    ws.current.socket.onclose = () => {
      setIsConnected(false)
      setClientsCounter(0)
    }
    ws.current.socket.onopen = () => {
      setIsConnected(true)
      ws.current.getRooms()
    }

    return () => {
      ws.current.closeConnection()
    }
  }, [])

  function handleCreateRoom() {
    if (isConnected) {
      // TODO: check if the user is already in the room. if so, deny the request
      ws.current.createRoom(control, bonus, user)
    } else {
      alert("Connection with the server was lost. Please, try to reload the page.")
    }
  }

  function handleJoinRoom(roomId) {
    if (isConnected) {
      // TODO: check if the user is already in the room. if so, deny the request
      ws.current.joinRoom(roomId)
    } else {
      alert("Connection with the server was lost. Please, try to reload the page.")
    }
  }

  function handleChangeRoom(roomId) {
    roomId = roomId.replace("\"", "")
    roomId = roomId.replace("\"", "")
    navigate(`play/${roomId}`)
  }

  return (
    <div className="mainContainer">
      <div className={styles.contentContainer}>
        <h1>Welcome, {user.username}!</h1>

        <div className={styles.lobbyContainer}>
          <h2>Availible games:</h2>
          {rooms?.length > 0 ?
            <table>
              <thead>
                <tr>
                  <th>Control</th>
                  <th>Time bonus<br />(sec.)</th>
                  <th>Owner</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, _) =>
                  <tr key={room.id}>
                    <td>
                      {room.control}
                    </td>
                    <td>
                      {room.bonus}
                    </td>
                    <td>
                      {room.owner.username}
                    </td>
                    <td>
                      {room.owner[`${control}Rating`]}
                    </td>
                    {room.owner.id === user.id ?
                      null :
                      <td>
                        <Button
                          onClickHandler={() => {
                            handleJoinRoom(room.id)
                          }}
                          text="Join"
                        />
                      </td>
                    }
                  </tr>
                )}
              </tbody>
            </table> :
            <div>
              No availible games. To create a game, press the "Create game" button.
            </div>
          }
        </div>

        <h2>Game parameters:</h2>
        <div className={styles.filters}>
          <label htmlFor="control">
            Control:
          </label>
          <select
            name="control"
            id="control"
            onChange={(e) => setControl(e.target.value)}
          >
            <option value="bullet">Bullet</option>
            <option value="blitz">Blitz</option>
            <option value="rapid">Rapid</option>
          </select>

          <label htmlFor="bonus">
            Time bonus:
          </label>
          <select
            name="bonus"
            id="bonus"
            onChange={(e) => setBonus(Number.parseInt(e.target.value))}
          >
            <option value={0}>0</option>
            <option value={2}>2</option>
            <option value={10}>10</option>
          </select>
        </div>

        <Button
          onClickHandler={handleCreateRoom}
          text="CreateGame"
        />
      </div>
      <div className={styles.playersCounter}>
        Players online: {clientsCounter}
      </div>
      <div className={styles.playerStatus}>
        Connection: {
          isConnected
            ? <img src={check} alt="yes" />
            : <img src={error} alt="no" />
        }
      </div>
    </div>
  )
}