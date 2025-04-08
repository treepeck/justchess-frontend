import "./Profile.css"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/Auth"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"
import { formatResult, formatWinner } from "../../game/enums"
import { getGamesByPlayerId, getPlayerById, Player, ShortGameDTO } from "../../http/http"

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

		{profileGames.length ? <div className="table">
			<div className="t-caption">Completed games</div>

			<div className="t-header">
				<div className="col">
					Control
				</div>
				<div className="col">
					Players
				</div>
				<div className="col">
					Result
				</div>
				<div className="col">
					Moves
				</div>
				<div className="col">
					Date
				</div>
			</div>

			<div className="t-body">
				{profileGames.map((game, index) => (
					<div className="row" key={index}>
						<div className="col">
							{game.tc / 60} + {game.tb}
						</div>
						<div className="col">
							W: <a href={`http://localhost:3000/player/${game.wid}`}>{game.wn}</a>
							<br />
							B: <a href={`http://localhost:3000/player/${game.bid}`}>{game.bn}</a>
						</div>
						<div className="col">
							{formatWinner(game.w)}
							<br />
							{formatResult(game.r)}
						</div>
						<div className="col">
							{game.m}
						</div>
						<div className="col">
							{formatDate(game.ca)}
						</div>
					</div>
				))}
			</div>
		</div>
			: <p>Completed games will be displayed here.</p>}
	</main>
}