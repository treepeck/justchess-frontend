import styles from "./button.module.css"

export default function Button({ onClickHandler, text }) {
  return (
    <button onClick={onClickHandler} className={styles.customButton}>
      {text}
    </button>
  );
}