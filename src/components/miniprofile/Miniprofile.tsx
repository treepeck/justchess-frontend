import "./Miniprofile.css"
import Timer from "../timer/Timer"

import error from "../../assets/error.png"
import check from "../../assets/check.png"

type MiniprofileProps = {
  id: string
  dur: number // timer duration
  ita: boolean // is timer active
}

export default function Miniprofile({ id, dur, ita }: MiniprofileProps) {

  return (
    <div className="miniprofile">
      <div className="status">
        <p>{"Guest-" + id.substring(0, 8)}</p>
      </div>

      <Timer
        dur={dur}
        ia={ita}
      />
    </div>
  )
}