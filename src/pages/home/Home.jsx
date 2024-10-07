import styles from "./home.module.css"
import Popup from "../../components/popup/Popup"
import Button from "../../components/button/Button"
import Select from "../../components/select/Select"
import Dialog from "../../components/dialog/Dialog"

import error from "../../assets/error.png"
import check from "../../assets/check.png"

import React, {
  useState,
  useEffect,
} from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../context/useAuth"
import { useConnection } from "../../context/connection"

export default function Home() {

  const { user } = useAuth()

  const { ws, isConnected, clientsCounter } = useConnection()

  const navigate = useNavigate()

  /**
   * Stores all availible rooms.
   * @type {[Object[] | null, Function]} 
   */
  const [rooms, setRooms] = useState(/** @type {Object[] | null}*/(null))
  const [bonus, setBonus] = useState("All")
  const [control, setControl] = useState("All")
  const [popupMessage, setPopupMessage] = useState("")
  const [isPopupActive, setIsPopupActive] = useState(false)
  const [isDialogActive, setIsDialogActive] = useState(false)

  useEffect(() => {
    ws?.getRooms(control, bonus)
  }, [control, bonus])

  useEffect(() => {
    if (isConnected) {
      // set up event handlers
      ws?.setEventHandler("UPDATE_ROOMS", setRooms)
      ws?.setEventHandler("CHANGE_ROOM", handleChangeRoom)
    }

    return () => {
      ws?.clearEventHandler("UPDATE_ROOMS")
      ws?.clearEventHandler("CHANGE_ROOMS")
    }
  }, [])

  /**
   * Handles the CREATE_ROOM Event.
   * @param {string} control 
   * @param {number} bonus 
   */
  function handleCreateRoom(control, bonus) {
    if (isConnected) {
      ws?.createRoom(control, bonus, user)
    } else {
      setIsPopupActive(true)
      setPopupMessage("Connection with the server was lost. Please, try to reload the page.")
    }
  }

  /**
   * Redirects the User to the other room.
   * @param {string} roomId 
   */
  function handleChangeRoom(roomId) {
    navigate(`/play/${roomId}`)
  }

  /**
   * Tries to joing the specified room. 
   * @param {string} roomId 
   */
  function handleJoinRoom(roomId) {
    if (isConnected) {
      roomId = roomId.replace("\"", "")
      roomId = roomId.replace("\"", "")
      ws?.joinRoom(roomId)
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
          {rooms && rooms.length > 0 ?
            <>
              <h2>Availible games:</h2>
              <div className={styles.filters}>
                <Select
                  htmlFor="control"
                  labelText="Control:"
                  options={["All", "Bullet", "Blitz", "Rapid"]}
                  onChangeHandler={setControl}
                />

                <Select
                  htmlFor="bonus"
                  labelText="Time bonus:"
                  options={["All", "0", "1", "2", "10"]}
                  onChangeHandler={setBonus}
                />
              </div>
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
                  {rooms.map((room, index) =>
                    <tr
                      key={index}
                      onClick={room.owner.id !== user.id ?
                        () => { handleJoinRoom(room.id) } : () => { }}
                    >
                      <td>
                        {room.game.control}
                      </td>
                      <td>
                        {room.game.bonus}
                      </td>
                      <td>
                        {room.owner.username}
                      </td>
                      <td>
                        {room.owner[`${room.game.control}Rating`]}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </> :
            <div>
              No availible games. To create a game, press the button bellow.
            </div>
          }
        </div>

        <Button
          onClickHandler={() => setIsDialogActive(true)}
          text="Create a game"
        />
      </div>
      <div className="playersCounter">
        Players online: {clientsCounter}
      </div>
      <div className="playerStatus">
        Connection: {
          isConnected
            ? <img src={check} alt="yes" />
            : <img src={error} alt="no" />
        }
      </div>

      {isPopupActive
        ? <Popup
          setIsActive={setIsPopupActive}
          message={popupMessage}
        />
        : null}

      {isDialogActive
        ? <Dialog
          onCreateRoom={handleCreateRoom}
          onClose={setIsDialogActive}
        />
        : null}
    </div >
  )
}