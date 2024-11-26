import "./Miniprofile.css"
import Timer from "../timer/Timer"

import error from "../../assets/error.png"
import check from "../../assets/check.png"

type MiniprofileProps = {
  id: string
  ic: boolean // is connected
  dur: number // timer duration
  ita: boolean // is timer active
}

export default function Miniprofile({ id, ic, dur, ita }: MiniprofileProps) {

  return (
    <div className="miniprofile">
      <div className="status">
        <p>{"Guest-" + id.substring(0, 8)}</p> {
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