import styles from "./select.module.css"

type SelectProps = {
  htmlFor: string,
  labelText: string,
  options: any[],
  onChangeHandler: any
}

export default function Select(props: SelectProps) {
  return (
    <div className={styles.select}>
      <label htmlFor={props.htmlFor}>
        {props.labelText}
      </label>
      <select
        name={props.htmlFor}
        id={props.htmlFor}
        onChange={e => {
          props.onChangeHandler(e.target.value)
        }}
      >
        {props.options.map((option, index) =>
          <option value={option} key={index}>
            {option}
          </option>
        )}
      </select>
    </div>
  )
}