import "./Miniprofile.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/Auth"
import { getPlayerById, Player } from "../../http/http"

type MiniprofileProps = {
	id: string,
}

export default function Miniprofile({ id }: MiniprofileProps) {
	const { accessToken } = useAuth()!
	const [player, setPlayer] = useState<Player | null>(null)

	useEffect(() => {
		const fetchUser = async function () {
			const _player = await getPlayerById(id ?? "", accessToken)
			if (_player) { setPlayer(_player) }
		}
		fetchUser()
	}, [id])

	if (!player) {
		return <a className="miniprofile" href=""></a>
	}

	return (
		<>{player.isEngine ? <div className="miniprofile">
			{player.username}
		</div>
			: <a className="miniprofile" href={`http://localhost:3000/player/${player.id}`}>{player.username}</a>
		}</>
	)
}