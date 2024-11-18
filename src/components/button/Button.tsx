import "./Button.css"

type BtnProps = {
  text: string,
  onClickHandler: any,
}

export default function Button(props: BtnProps) {
  return (
    <button onClick={() => { props.onClickHandler() }} className="button">
      {props.text}
    </button>
  );
}