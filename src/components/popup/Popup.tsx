import styles from "./popup.module.css"

type PopupProps = {
  message: string,
  setIsActive: (ia: boolean) => void,
}

export default function Popup(props: PopupProps) {
  return (
    <div className={styles.container} onClick={() => props.setIsActive(false)}>
      <div className={styles.content}>
        {props.message}
      </div>
    </div>
  )
}