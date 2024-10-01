import styles from "./dialog.module.css"
import Select from "../select/Select"
import Button from "../button/Button"

import { useState } from "react"

export default function Dialog({ onCreateRoom, onClose }) {

  const [bonus, setBonus] = useState(0)
  const [control, setControl] = useState("bullet")

  return (
    <div className={styles.dialogContainer} onClick={() => onClose(false)}>
      <div className={styles.dialogContent} onClick={e => e.stopPropagation()}>
        <p>Game parameters:</p>

        <div className={styles.filters}>
          <Select
            htmlFor="control"
            labelText="Control:"
            options={["bullet", "blitz", "rapid"]}
            onChangeHandler={setControl}
          />

          <Select
            htmlFor="bonus"
            labelText="Time bonus:"
            options={[0, 1, 2, 10]}
            onChangeHandler={setBonus}
          />
        </div>

        <Button
          text="Create a game"
          onClickHandler={() => {
            onClose(false)
            onCreateRoom(control, Number(bonus))
          }}
        />

        <button className={styles.close} onClick={() => onClose(false)}>
        </button>
      </div>
    </div>
  )
}