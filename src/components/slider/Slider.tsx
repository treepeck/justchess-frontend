import { useState } from "react"
import "./Slider.css"

type SliderProps = {
	value: number,
	setValue: React.Dispatch<React.SetStateAction<number>>
	min: number,
	max: number,
	text: string,
}

export default function Slider(props: SliderProps) {
	return (
		<div className="slider-container">
			<div className="label">
				{props.text} {props.value}
			</div>

			<input
				type="range"
				value={props.value}
				onChange={(e) => props.setValue(parseInt(e.target.value))}
				min={props.min}
				max={props.max}
			/>
		</div>
	)
}