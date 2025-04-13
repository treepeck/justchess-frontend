import "./Input.css"
import { useState } from "react"

type InputProps = {
	type: string,
	hasIcon: boolean,
	isValid: boolean,
	minLength: number,
	maxLength: number,
	placeholder: string,
	onChange: React.ChangeEventHandler<HTMLInputElement>,
}

export default function Input({ type, isValid, minLength, maxLength,
	placeholder, onChange, hasIcon, }: InputProps) {

	const [_type, setType] = useState<string>(type)

	return (
		<label className="input-label">
			<i className={type} />
			<input className={type} type={_type} placeholder={placeholder}
				minLength={minLength}
				maxLength={maxLength}
				onChange={onChange}
			/>
			{type == "password" && (<i className="eye" onClick={() =>
				setType(_type === "password" ? "text" : "password")
			} />)}
			{hasIcon && <i className={isValid ? "check" : "error"} />}
		</label>
	)
}