import { useEffect } from "react"
import "./Clock.css"

type ClockProps = {
	time: number, // In seconds.
	setTime: React.Dispatch<React.SetStateAction<number>>,
	isActive: boolean,
}

export default function Clock(props: ClockProps) {
	function formatTime(): string {
		const seconds = props.time % 60
		const minutes = Math.floor(props.time / 60)
		return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
	}

	useEffect(() => {
		let interval: NodeJS.Timeout | undefined
		if (props.isActive && props.time > 0) {
			interval = setInterval(() => {
				props.setTime(prevTime => prevTime - 1)
			}, 1000)
		}

		return () => clearInterval(interval)
	}, [props.isActive])

	return (
		<div className={"clock " + (props.isActive ? "active" : "")}>
			{formatTime()}
		</div>
	)
}