import "./RadioButtons.css"
import { useState } from "react"

type RadioButtonsProps = {
	caption: string,
	options: string[],
	onChange: React.ChangeEventHandler<HTMLInputElement>,
}

export default function RadioButtons({ caption, options, onChange }: RadioButtonsProps) {
	const [checked, setChecked] = useState<number>(0)

	return (
		<div className="radio-group">
			<div className="r-caption">{caption}</div>

			{options.map((option, index) => (
				<div key={index} className="r-option">
					<input
						type="radio"
						id={option}
						name="option"
						value={option}
						onChange={(e) => {
							setChecked(index)
							onChange(e)
						}}
						checked={index == checked}
					/>
					<label htmlFor={option}>{option}</label>
				</div>
			))}
		</div >
	)
}