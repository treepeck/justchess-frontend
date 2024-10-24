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
import { EventAction } from "../../api/ws/event"

export default function Home() {
  const { user } = useAuth()

  const { ws, isConnected, clientsCounter } = useConnection()

  const navigate = useNavigate()

  // const [bonus, setBonus] = useState("All")
  // const [control, setControl] = useState("All")
  /**
   * Stores all availible rooms.
   * @type {[[], Function]} 
   */
  const [rooms, setRooms] = useState([])
  const [popupMessage, setPopupMessage] = useState("")
  const [isPopupActive, setIsPopupActive] = useState(false)
  const [isDialogActive, setIsDialogActive] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      return
    }

    ws?.getRooms()

    /** set up event handlers for this page. */
    // ADD_ROOM adds a room to currently avalible rooms.
    ws?.setEventHandler(EventAction.ADD_ROOM, (r) => {
      // here the new array is created since React will only
      // re-render rooms if a new value is being set
      rooms.push(r)
      setRooms([...rooms])
    })

    // REMOVE_ROOM removes a room from currently avalible rooms.
    ws?.setEventHandler(EventAction.REMOVE_ROOM, (r) => {
      const nr = []
      for (const room of rooms) {
        if (room.id != r.id) {
          nr.push(room)
        }
      }
      setRooms(nr)
    })

    // Create room error arises when the user tries to create multiple rooms.
    ws?.setEventHandler(EventAction.CREATE_ROOM_ERR, () => {
      setIsPopupActive(true)
      setPopupMessage("Multiple rooms creation is prohibited.")
    })

    // Redirect to room redirects the user to the specified room.
    ws?.setEventHandler(EventAction.REDIRECT, (roomId) => {
      navigate(`/play/${roomId}`)
    })

    return () => {
      // clear event handlers which are needed only for this page.
      ws?.clearEventHandler(EventAction.ADD_ROOM)
      ws?.clearEventHandler(EventAction.REDIRECT)
      ws?.clearEventHandler(EventAction.CREATE_ROOM_ERR)
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
   * Tries to joing the specified room. 
   * @param {string} roomId 
   */
  function handleJoinRoom(roomId) {
    if (isConnected) {
      // remove double quotes from the room id.
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
          {rooms.length ?
            <>
              <h2>Availible games:</h2>
              <div className={styles.filters}>
                <Select
                  htmlFor="control"
                  labelText="Control:"
                  options={["All", "Bullet", "Blitz", "Rapid"]}
                  onChangeHandler={() => { }}
                />

                <Select
                  htmlFor="bonus"
                  labelText="Time bonus:"
                  options={["All", "0", "1", "2", "10"]}
                  onChangeHandler={() => { }}
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
                    </tr>
                  )}
                </tbody>
              </table>
            </> :
            <div>
              There are no games yet. To create a game, press the button below.
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