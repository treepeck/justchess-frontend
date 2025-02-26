import { useEffect, useState } from "react"
import "./Clock.css"

type ClockProps = {
	duration: number, // In seconds.
	isActive: boolean,
}

export default function Clock(props: ClockProps) {
	const [time, setTime] = useState<number>(props.duration)

	function formatTime(): string {
		const seconds = time % 60
		const minutes = Math.floor(time / 60)
		return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
	}

	useEffect(() => {
		const interval = setInterval(() => {
			if (props.isActive) {
				setTime(prevTime => prevTime - 1)
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [props.isActive])

	return (
		<div className="clock">
			{formatTime()}
		</div>
	)
}