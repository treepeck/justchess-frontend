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

import User from "../../api/user"
import { useAuth } from "../../context/Auth"
import { useConn } from "../../context/Conn"
import { EventAction } from "../../api/ws/event"


export default function Home() {
  const { user, accessToken } = useAuth()

  const { ws, ic, cc } = useConn()

  const navigate = useNavigate()

  // game parameters.
  const [bonus, setBonus] = useState<number>(0)
  const [control, setControl] = useState<string>("bullet")

  // helper type that represents a room.
  type Room = { id: string, control: string, bonus: number, owner: User }
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

    // Create room error arises when the user tries to create multiple rooms.
    ws?.setEventHandler(EventAction.CREATE_ROOM_ERR, () => {
      setIsPopupActive(true)
      setPopupMessage("Multiple rooms creation is prohibited.")
    })

    // Redirect to room redirects the user to the specified room.
    ws?.setEventHandler(EventAction.REDIRECT, (roomId: string) => {
      navigate(`/play/${roomId}`)
    })

    return () => {
      // clear event handlers which are needed only for this page.
      ws?.clearEventHandler(EventAction.ADD_ROOM)
      ws?.clearEventHandler(EventAction.REDIRECT)
      ws?.clearEventHandler(EventAction.CREATE_ROOM_ERR)
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
    ws?.createRoom(control, bonus, user)
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

  // Helper function that returns a user rating in a specified control.
  function getRating(u: User, c: string): string {
    switch (c) {
      case "bullet":
        return u.bulletRating + ""
      case "blitz":
        return u.blitzRating + ""
      case "rapid":
        return u.rapidRating + ""
      default:
        return "No access"
    }
  }

  return (
    <div className="mainContainer">
      <div className="home">
        <div className="playersCounter">
          Players online: {cc}
        </div>

        <h1>Welcome, {user.username}!</h1>

        {rooms.length ?
          <div className="rooms">
            <h2>Availible games:</h2>
            <div className="filters">
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
                  <th>Owner</th>
                  <th>Control</th>
                  <th>Time bonus<br />(sec.)</th>
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
                      {room.owner.username}
                    </td>
                    <td>
                      {room.control}
                    </td>
                    <td>
                      {room.bonus}
                    </td>
                    <td>
                      {getRating(room.owner, room.control)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div > :
          <div>
            There are no availible games yet.
          </div>}

        <Button
          onClickHandler={() => { setIsDialogActive(true) }}
          text="Create a game"
        />

        {/* <div className="playerStatus">
          Connection: {ic
            ? <img src={check} alt="yes" />
            : <img src={error} alt="no" />
          }
        </div> */}

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
    </div >
  )
}