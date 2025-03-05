import "./Miniprofile.css"
import Clock from "../clock/Clock"

type MiniprofileProps = {
	id: string,
	time: number,
	setTime: React.Dispatch<React.SetStateAction<number>>,
	isActive: boolean,
}

export default function Miniprofile(props: MiniprofileProps) {

	return (
		<div className="miniprofile">
			<p>{props.id}</p>

			<Clock
				time={props.time}
				setTime={props.setTime}
				isActive={props.isActive}
			/>
		</div>
	)
}