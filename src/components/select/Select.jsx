import styles from "./select.module.css"

export default function Select({
  htmlFor, labelText,
  options, onChangeHandler
}) {
  return (
    <div className={styles.customSelect}>
      <label htmlFor={htmlFor}>
        {labelText}
      </label>
      <select
        name={htmlFor}
        id={htmlFor}
        onChange={e => {
          console.log("Selected value:", e.target.value);
          onChangeHandler(e.target.value);
        }}
      >
        {options.map((option, index) =>
          <option value={option} key={index}>
            {option}
          </option>
        )}
      </select>
    </div>
  )
}