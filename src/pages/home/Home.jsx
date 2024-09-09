import styles from "./home.module.css"
import Button from "../../components/button/Button"

import {
  useRef,
  useState,
  useEffect,
} from "react"
import { useNavigate } from "react-router-dom"

import WS from "../../api/ws"
import { useAuth } from "../../context/useAuth"

export default function Home() {

  const { user } = useAuth()

  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [clientsCounter, setClientsCounter] = useState(0)
  const [control, setControl] = useState("bullet")
  const [bonus, setBonus] = useState(0)

  const ws = useRef()

  useEffect(() => {
    ws.current = new WS(user.id)

    // set up event handlers
    ws.current.setEventHandler("UPDATE_CLIENTS_COUNTER", setClientsCounter)
    ws.current.setEventHandler("UPDATE_ROOMS", setRooms)

    return () => {
      ws.current.closeConnection()
    }
  }, [])

  function handleCreateRoom() {
    // TODO: check if the user is already in the room. if so, deny the request
    ws.current.createRoom(control, bonus)
    navigate(`play/${user.id}`)
  }

  function handleJoinRoom(roomId) {
    // TODO: check if the user is already in the room. if so, deny the request
    console.log(roomId)
    ws.current.joinRoom(roomId)
  }

  function handleChangeRoom(roomId) {
    console.log("Current room: ", roomId)
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
                  <th>Player</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, _) =>
                  <tr key={room.ownerId}>
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
                    {room.ownerId === user.id ?
                      null :
                      <td>
                        <Button
                          onClickHandler={() => {
                            handleJoinRoom(room.ownerId)
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
      <div className={styles.playersCounter}>Players online: {clientsCounter}</div>
    </div>
  )
}