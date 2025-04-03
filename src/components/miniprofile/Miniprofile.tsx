import "./Miniprofile.css"
import { useEffect } from "react"

type MiniprofileProps = {
	id: string,
}

export default function Miniprofile({ id }: MiniprofileProps) {

	useEffect(() => {

	}, [])

	return (
		<a className="miniprofile" href={`http://localhost:3000/player/${id}`}>
			{id}
		</a>
	)
}