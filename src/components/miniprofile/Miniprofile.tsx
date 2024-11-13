import styles from "./miniprofile.module.css"
import Timer from "../timer/Timer"

import User from "../../api/user"
import { useEffect, useState } from "react"
import error from "../../assets/error.png"
import check from "../../assets/check.png"
import API from "../../api/api"
import { useAuth } from "../../context/Auth"

type MiniprofileProps = {
  id: string,
  isConnected: boolean
  duration: number
  isTimerActive: boolean
}

export default function Miniprofile(props: MiniprofileProps) {

  const { user, accessToken } = useAuth()
  const [u, setU] = useState<User>()

  useEffect(() => {
    const fetchUser = async () => {
      const api = new API()
      const r = await api.getUserById(props.id, accessToken)
      if (r.user) {
        setU(r.user)
      } else { // user not found, it basically means that the user is guest.
        const guest = new User(props.id, "Guest-" + props.id.substring(0, 8), 0, 400, 400, 400)
        setU(guest)
      }
    }
    if (user.id !== props.id) {
      fetchUser()
    } else {
      setU(user)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.status}>
        {u?.username} {
          props.isConnected
            ? <img src={check} alt="yes" />
            : <img src={error} alt="no" />
        }
      </div>

      <Timer
        duration={props.duration}
        isActive={props.isTimerActive}
      />
    </div>
  )
}