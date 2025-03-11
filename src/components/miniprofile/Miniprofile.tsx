import "./Miniprofile.css"

type MiniprofileProps = {
	id: string,
}

export default function Miniprofile(props: MiniprofileProps) {

	return (
		<div className="miniprofile">
			{props.id}
		</div>
	)
}