import { useEffect } from "react"
import "./Clock.css"

type ClockProps = {
	time: number, // In seconds.
	setTime: React.Dispatch<React.SetStateAction<number>>,
	isActive: boolean,
}

export default function Clock({ time, setTime, isActive }: ClockProps) {
	function formatTime(): string {
		const seconds = time % 60
		const minutes = Math.floor(time / 60)
		return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
	}

	useEffect(() => {
		let interval: number | undefined
		if (isActive && time > 0) {
			interval = window.setTimeout(() => {
				setTime(prevTime => prevTime - 1)
			}, 1000)
		}

		return () => window.clearTimeout(interval)
	}, [isActive, time])

	return (
		<div className={"clock" + (isActive ? " active" : "")}>
			{formatTime()}
		</div>
	)
}