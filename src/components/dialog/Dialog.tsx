import "./Dialog.css"

import React, { ReactNode } from "react"
import Button from "../button/Button"

type DlgProps = {
  header: string,
  content: ReactNode[], // child elements
  onSubmit: (...args: any) => void,
  onSubmitText: string,
  setIsActive: (ia: boolean) => void,
}

export default function Dialog({ header, content, onSubmit,
  onSubmitText, setIsActive }: DlgProps) {
  return (
    <div className="dialog" onClick={() => setIsActive(false)}>
      <div className="dialogContent" onClick={e => e.stopPropagation()}>
        <p>{header}</p>

        <div className="box">
          {content.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}

          <Button
            text={onSubmitText}
            onClickHandler={() => { onSubmit() }}
          />
        </div>

        <button className="close" onClick={() => setIsActive(false)} />
      </div>
    </div>
  )
}