import "./Miniprofile.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/Auth"
import { getPlayerById, Player } from "../../http/http"

type MiniprofileProps = {
	id: string,
}

export default function Miniprofile({ id }: MiniprofileProps) {
	const { player, accessToken } = useAuth()!
	const [profile, setProfile] = useState<Player | null>(null)

	useEffect(() => {
		if (id == player.id) {
			setProfile(player)
		} else {
			const fetchUser = async function () {
				const _player = await getPlayerById(id ?? "", accessToken)
				if (_player) { setProfile(_player) }
			}
			fetchUser()
		}
	}, [id])

	if (!player) {
		return <a className="miniprofile" href=""></a>
	}

	return (
		<>{profile?.isEngine ? <div className="miniprofile">
			{profile?.username}
		</div>
			: <a className="miniprofile" href={`${process.env.REACT_APP_DOMAIN}/player/${profile?.id}`}>{profile?.username}</a>
		}</>
	)
}