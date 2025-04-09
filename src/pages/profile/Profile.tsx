import "./Profile.css"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/Auth"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"
import { formatResult, formatWinner } from "../../game/enums"
import { getGamesByPlayerId, getPlayerById, Player, ShortGameDTO } from "../../http/http"
import Table from "../../components/table/Table"

const id = window.location.pathname.substring(8)

export default function Profile() {
	const { theme } = useTheme()!
	const { accessToken } = useAuth()!
	const [profileUser, setProfileUser] = useState<Player | null>(null)
	const [profileGames, setProfileGames] = useState<ShortGameDTO[]>([])

	useEffect(() => {
		const fetchUser = async function () {
			const _player = await getPlayerById(id ?? "", accessToken)

			if (!_player || _player.isEngine) {
				window.location.replace("/404")
				return
			}
			setProfileUser(_player)
		}
		fetchUser()

		const fetchGames = async function () {
			if (profileUser?.isEngine) return

			const _games = await getGamesByPlayerId(id ?? "", accessToken)

			if (_games) {
				setProfileGames(_games)
			}
		}
		fetchGames()
	}, [])

	function formatDate(timestamp: string | undefined): string {
		if (!timestamp) return ""
		return new Date(timestamp).toLocaleDateString("en-US", {
			month: "long",
			day: "2-digit",
			year: "numeric",
		})
	}

	return <main className="profile-container" data-theme={theme}>
		<Header />

		<section className="profile">
			<h2 className="item">{profileUser?.username}</h2>
			<p className="item">Registered <br /> {formatDate(profileUser?.createdAt)}</p>
		</section>

		<Table
			caption={"completed games"}
		/>
	</main>
}