import "./Miniprofile.css"

type MiniprofileProps = {
	id: string,
}

export default function Miniprofile({ id }: MiniprofileProps) {

	return (
		<div className="miniprofile">
			{id}
		</div>
	)
}