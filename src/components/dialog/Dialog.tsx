import styles from "./dialog.module.css"

import ReactDOM from "react-dom"
import React, { ReactNode, useState } from "react"
import Button from "../button/Button"

type DlgProps = {
  header: string,
  content: ReactNode[], // child elements,
  onSubmit: (...args: any) => void,
  onSubmitText: string,
  setIsActive: (ia: boolean) => void,
}

export default function Dialog(props: DlgProps) {
  return (
    <div className={styles.container} onClick={() => props.setIsActive(false)}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <p>{props.header}</p>

        <div className={styles.box}>
          {props.content.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}

          <Button
            text={props.onSubmitText}
            onClickHandler={() => { props.onSubmit() }}
          />
        </div>

        <button className={styles.close} onClick={() => props.setIsActive(false)} />
      </div>
    </div>
  )
}