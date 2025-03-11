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
		<div className="radio-group">
			<div className="r-caption">{caption}</div>

			{options.map((option, index) => (
				<div key={index} className="r-option">
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
					<label htmlFor={option}>{option}</label>
				</div>
			))}
		</div >
	)
}