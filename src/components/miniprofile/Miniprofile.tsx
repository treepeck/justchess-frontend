import "./Miniprofile.css"
import Timer from "../timer/Timer"

import API from "../../api/api"
import User from "../../api/user"
import { useEffect, useState } from "react"
import error from "../../assets/error.png"
import check from "../../assets/check.png"
import { useAuth } from "../../context/Auth"

type MiniprofileProps = {
  id: string
  ic: boolean // is connected
  dur: number // timer duration
  ita: boolean // is timer active
}

export default function Miniprofile({ id, ic, dur, ita }: MiniprofileProps) {

  const { user, accessToken } = useAuth()
  const [u, setU] = useState<User>()

  useEffect(() => {
    const fetchUser = async () => {
      const api = new API()
      const r = await api.getUserById(id, accessToken)
      if (r.user) {
        setU(r.user)
      } else { // user not found, it basically means that the user is guest.
        const guest = new User(id, "Guest-" + id.substring(0, 8), 0, 400, 400, 400)
        setU(guest)
      }
    }
    if (user.id !== id) {
      fetchUser()
    } else {
      setU(user)
    }
  }, [])

  return (
    <div className="miniprofile">
      <div className="status">
        <p>{u?.username}</p> {
          ic
            ? <img src={check} alt="yes" />
            : <img src={error} alt="no" />
        }
      </div>

      <Timer
        dur={dur}
        ia={ita}
      />
    </div>
  )
}