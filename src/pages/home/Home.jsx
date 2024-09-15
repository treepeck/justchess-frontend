import styles from "./home.module.css"
import Popup from "../../components/popup/Popup"
import Button from "../../components/button/Button"

import error from "../../assets/error.png"
import check from "../../assets/check.png"

import {
  useState,
  useEffect,
} from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../context/useAuth"
import { useConnection } from "../../context/connection"

export default function Home() {

  const { user } = useAuth()
  const { ws, clientsCounter, isConnected } = useConnection()

  const navigate = useNavigate()

  const [bonus, setBonus] = useState(0)
  const [rooms, setRooms] = useState([])
  const [control, setControl] = useState("bullet")
  const [popupMessage, setPopupMessage] = useState("")
  const [isPopupActive, setIsPopupActive] = useState(false)

  useEffect(() => {
    if (isConnected) {
      // set up event handlers
      ws.setEventHandler("UPDATE_ROOMS", setRooms)
      ws.setEventHandler("CHANGE_ROOM", handleChangeRoom)

      // get all availible rooms
      ws.getRooms()
    }

    return () => {
      ws.clearEventHandler("UPDATE_ROOMS")
      ws.clearEventHandler("CHANGE_ROOMS")
    }
  }, [])

  function handleCreateRoom() {
    if (isConnected) {
      ws.createRoom(control, bonus, user)
    } else {
      setIsPopupActive(true)
      setPopupMessage("Connection with the server was lost. Please, try to reload the page.")
    }
  }

  function handleChangeRoom(roomId) {
    navigate(`/play/${roomId}`)
  }

  function handleJoinRoom(roomId) {
    if (isConnected) {
      roomId = roomId.replace("\"", "")
      roomId = roomId.replace("\"", "")
      navigate(`play/${roomId}`)
    } else {
      setIsPopupActive(true)
      setPopupMessage("Connection with the server was lost. Please, try to reload the page.")
    }
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
                      {room.owner[`${room.control}Rating`]}
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
          text="Create game"
        />
      </div>
      <div className="playersCounter">
        Players in lobby: {clientsCounter}
      </div>
      <div className="playerStatus">
        Connection: {
          isConnected
            ? <img src={check} alt="yes" />
            : <img src={error} alt="no" />
        }
      </div>

      {
        isPopupActive
          ? <Popup
            setIsActive={setIsPopupActive}
            message={popupMessage}
          />
          : null
      }
    </div >
  )
}