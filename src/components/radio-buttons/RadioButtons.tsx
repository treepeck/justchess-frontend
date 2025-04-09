import { useState } from "react"
import "./RadioButtons.css"

type RadioButtonsProps = {
	caption: string,
	options: string[],
	value: any,
	setValue: React.Dispatch<React.SetStateAction<any>>
}

export default function RadioButtons({ caption, options, value, setValue }: RadioButtonsProps) {
	return (
		<fieldset>
			<legend>{caption}</legend>

			{options.map((option, index) => (
				<label key={index}>
					<input
						type="radio"
						name={caption}
						value={value}
						onChange={() => {
							if (typeof value == "number") {
								setValue(parseInt(option))
							} else {
								setValue(option)
							}
						}}
						checked={value == option}
					/>
					<p>{option == "User" ? "Human" : option}</p>
				</label>
			))}
		</fieldset>
	)
}