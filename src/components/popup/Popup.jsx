import styles from "./popup.module.css"

export default function Popup({ setIsActive, message }) {
  return (
    <div className={styles.popupContainer} onClick={() => { setIsActive(false) }}>
      <div className={styles.popupContent}>
        {message}
      </div>
    </div>
  )
}