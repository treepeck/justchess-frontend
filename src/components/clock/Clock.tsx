import "./Clock.css"
import { useEffect } from "react"
import { Action } from "../../pages/play/play.reducer"

type ClockProps = {
	time: number, // In seconds.
	color: string,
	dispatch: React.ActionDispatch<[action: any]>
	isActive: boolean,
}

export default function Clock({ time, color, dispatch, isActive }: ClockProps) {
	function formatTime(): string {
		const seconds = time % 60
		const minutes = Math.floor(time / 60)
		return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
	}

	useEffect(() => {
		let interval: number | undefined
		if (isActive && time > 0) {
			interval = window.setTimeout(() => {
				if (color == "white") {
					dispatch({ type: Action.SET_WHITE_TIME, payload: time - 1 })
				} else {
					dispatch({ type: Action.SET_BLACK_TIME, payload: time - 1 })
				}
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