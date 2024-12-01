import "./Home.css"
import check from "../../assets/check.png"
import error from "../../assets/error.png"

import Popup from "../../components/popup/Popup"
import Button from "../../components/button/Button"
import Dialog from "../../components/dialog/Dialog"
import Select from "../../components/select/Select"

import {
  useState,
  useEffect,
} from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../context/Auth"
import { useConn } from "../../context/Conn"
import { EventAction } from "../../api/ws/event"


export default function Home() {
  const { user } = useAuth()

  const { ws, ic, cc } = useConn()

  const navigate = useNavigate()

  // game parameters.
  const [bonus, setBonus] = useState<number>(0)
  const [control, setControl] = useState<string>("bullet")

  // helper type that represents a room.
  type Room = { id: string, control: string, bonus: number, ownerId: string }
  // Stores all availible rooms.
  const [rooms, setRooms] = useState<Room[]>([])

  const [isDialogActive, setIsDialogActive] = useState<boolean>(false)
  const [isPopupActive, setIsPopupActive] = useState<boolean>(false)
  const [popupMessage, setPopupMessage] = useState<string>("")

  useEffect(() => {
    if (!ic) {
      return
    }

    ws?.getRooms()

    // ADD_ROOM adds a room to currently avalible rooms.
    ws?.setEventHandler(EventAction.ADD_ROOM, (r: Room) => {
      setRooms(_rooms => [..._rooms, r])
    })

    // REMOVE_ROOM removes a room from currently avalible rooms.
    ws?.setEventHandler(EventAction.REMOVE_ROOM, (r: Room) => {
      setRooms((prevRooms) => prevRooms.filter((room) =>
        room.id !== r.id
      ))
    })

    // Redirect to room redirects the user to the specified room.
    ws?.setEventHandler(EventAction.REDIRECT, (roomId: string) => {
      navigate(`/play/${roomId}`)
    })

    return () => {
      // clear event handlers which are needed only for this page.
      ws?.clearEventHandler(EventAction.ADD_ROOM)
      ws?.clearEventHandler(EventAction.REDIRECT)
    }
  }, [])

  // Handles the CREATE_ROOM Event.
  function handleCreateRoom(control: string, bonus: number) {
    // @ts-ignore
    bonus = Number.parseInt(bonus)
    if (!ic) {
      setIsPopupActive(true)
      setPopupMessage("Connection with the server was lost. Please, try to reload the page.")
      return
    }
    ws?.createRoom(control, bonus, user.id)
  }

  // Tries to joing the specified room. 
  function handleJoinRoom(roomId: string) {
    if (!ic) {
      // setIsPopupActive(true)
      setPopupMessage("Connection with the server was lost. Please, try to reload the page.")
      return
    }
    // remove double quotes from the room id.
    roomId = roomId.replace("\"", "")
    roomId = roomId.replace("\"", "")
    ws?.joinRoom(roomId)
  }

  return (
    <div className="home">
      <div className="playersCounter">
        Players online: {cc}
      </div>

      <h1>Welcome, {user.username}!</h1>

      {rooms.length === 0 && <div>
        There are no availible games yet.
      </div>}

      {rooms.length > 0 && <div className="rooms">
        <div className="headRow">
          <div className="col">Owner</div>
          <div className="col">Control</div>
          <div className="col">Time bonus<br />(sec.)</div>
          <div className="col">Rating</div>
        </div>
        <div className="roomsTable">
          {rooms.map((room, index) =>
            <div
              key={index}
              className="row"
              onClick={room.ownerId !== user.id ?
                () => { handleJoinRoom(room.id) } : () => { }}
            >
              <div className="col">
                {"Guest-" + room.ownerId.substring(0, 8)}
              </div>
              <div className="col">
                {room.control}
              </div>
              <div className="col">
                {room.bonus}
              </div>
              <div className="col" />
            </div>
          )}
        </div>
      </div>}

      <Button
        onClickHandler={() => { setIsDialogActive(true) }}
        text="Create a game"
      />

      <div className="footer">
        <a href="https://github.com/BelikovArtem/justchess_fullstack">
          Source code
        </a>
        <br />
        [<a href="https://www.figma.com/community/file/971870797656870866">
          Chess Simple Assets
        </a>] by [<a href="https://www.figma.com/@swierq">Maciej Świerczek</a>]
        used under [
        <a href="https://creativecommons.org/licenses/by/4.0/">
          CC BY 4.0
        </a>
        ] licence terms
      </div>
      {isDialogActive && (<Dialog
        header="Game parameters"
        content={[
          <Select
            key="control"
            htmlFor="control"
            labelText="Control: "
            options={["bullet", "blitz", "rapid"]}
            onChangeHandler={setControl}
          />,
          <Select
            key="bonus"
            htmlFor="bonus"
            labelText="bonus: "
            options={[0, 1, 2, 10]}
            onChangeHandler={setBonus}
          />
        ]}
        onSubmit={() => handleCreateRoom(control, bonus)}
        onSubmitText="Create a game"
        setIsActive={setIsDialogActive}
      />)}

      {isPopupActive && (<Popup
        message={popupMessage}
        setIsActive={setIsPopupActive}
      />)}
    </div>
  )
}