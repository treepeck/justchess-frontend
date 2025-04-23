import "./Profile.css"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/Auth"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"
import { Color, formatResult, formatWinner } from "../../game/enums"
import { getGamesByPlayerId, getPlayerById, Player, ShortGameDTO } from "../../http/http"
import Table from "../../components/table/Table"

const id = window.location.pathname.substring(8)

export default function Profile() {
	const { theme } = useTheme()!
	const { accessToken } = useAuth()!
	const [profile, setProfile] = useState<Player | null>(null)
	const [games, setGames] = useState<ShortGameDTO[]>([])

	useEffect(() => {
		const fetchUser = async function () {
			const _player = await getPlayerById(id ?? "", accessToken)

			if (!_player || _player.isEngine) {
				window.location.replace("/404")
				return
			}
			setProfile(_player)
		}
		fetchUser()

		const fetchGames = async function () {
			if (profile?.isEngine) return

			const _games = await getGamesByPlayerId(id ?? "", accessToken)

			if (_games) {
				setGames(_games)
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

	function formatColor(winner: Color, whiteId: string, blackId: string): string {
		if (winner == Color.None) return ""

		if ((winner == Color.White && whiteId == profile?.id) ||
			(winner == Color.Black && blackId == profile?.id)) {
			return "green"
		}
		return "red"
	}

	return <main className="profile-container" data-theme={theme}>
		<Header />

		<section>
			<b>{profile?.username}</b>

			<p>Registered at <br /> {formatDate(profile?.createdAt)}</p>
		</section>

		{games.length ? <Table
			caption="Completed games"
			headerCols={["Result", "Players", "Control", "Moves", "Date"]}
		>
			<div className="t-body">

				{games.map((game, ind) => <a key={ind} className="row" href={`http://localhost:3000/${game.id}`}>
					<div className={`col ${formatColor(game.w, game.wid, game.bid)}`}>
						{formatWinner(game.w)}
						<br />
						{formatResult(game.r)}
					</div>

					<div className="col">
						{game.wn}
						<br />
						{game.bn}
					</div>

					<div className="col">
						{game.tc / 60}m + {game.tb}s
					</div>

					<div className="col">
						{game.m}
					</div>

					<div className="col">
						{formatDate(game.ca)}
					</div>
				</a>)}
			</div>
		</Table> : <h2>Completed games will be displayed here.</h2>}
	</main>
}