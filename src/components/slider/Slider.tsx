import { useState } from "react"
import "./Slider.css"

type SliderProps = {
	value: number,
	setValue: React.Dispatch<React.SetStateAction<number>>
	min: number
	max: number
	text: string
}

export default function Slider({ value, setValue,
	min, max, text
}: SliderProps) {
	return (
		<label className="slider-container">
			{text} {value}
			<input
				type="range"
				value={value}
				onChange={e => setValue(parseInt(e.target.value))}
				min={min}
				max={max}
			/>
		</label>
	)
}