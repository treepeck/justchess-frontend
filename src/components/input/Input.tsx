import { useState } from "react"
import "./Input.css"

type InputProps = {
	type: string,
	isValid: boolean,
	minLength: number,
	maxLength: number,
	placeholder: string,
	onChange: React.ChangeEventHandler<HTMLInputElement>,
}

export default function Input({ type, isValid, minLength, maxLength,
	placeholder, onChange }: InputProps) {

	const [_type, setType] = useState<string>(type)

	return (
		<label>
			<i className={type} />
			<input className={type} type={_type} placeholder={placeholder}
				minLength={minLength}
				maxLength={maxLength}
				onChange={onChange}
			/>
			{type == "password" && (<i className="eye" onClick={() =>
				setType(_type === "password" ? "text" : "password")
			} />)}
			<i className={isValid ? "check" : "error"} />
		</label>
	)
}