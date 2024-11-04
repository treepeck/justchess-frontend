import styles from "./button.module.css"

type BtnProps = {
  text: string,
  onClickHandler: any,
}

export default function Button(props: BtnProps) {
  return (
    <button onClick={() => { props.onClickHandler() }} className={styles.button}>
      {props.text}
    </button>
  );
}