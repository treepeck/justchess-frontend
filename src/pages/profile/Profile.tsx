import "./Profile.css"
import { useState, useEffect } from "react"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"
import { commend, getUserByName, Player } from "../../http/http"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../context/Auth"
import Table from "../../components/table/Table"

export default function Profile() {
	const { theme } = useTheme()!
	const { name } = useParams()
	const navigate = useNavigate()
	const { player, accessToken } = useAuth()!
	// const [games, setGames] = useState<Player>
	const [profileUser, setProfileUser] = useState<Player | null>(null)

	useEffect(() => {
		const fetchUser = async function () {
			const _user = await getUserByName(name ?? "", accessToken)

			if (!_user) {
				navigate("/404")
				return
			}
			setProfileUser(_user)
		}
		fetchUser()
	}, [])

	function formatRegistratioDate(timestamp: string): string {
		return new Date(timestamp).toLocaleDateString("en-US", {
			month: "long",
			day: "2-digit",
			year: "numeric",
		})
	}

	if (!profileUser) return <main></main>

	return <main className="profile-container" data-theme={theme}>
		<Header />

		<section className="profile">
			<h2 className="item">{profileUser.username}</h2>
			<p className="item">Games <br /> {123} </p>
			<p className="item">Registered <br /> {formatRegistratioDate(profileUser.createdAt)}</p>
		</section>

		<Table
			caption="Completed games"
			headerCols={["Players", "Result", "Moves", "Date"]}
			bodyRows={[]}
			bodyOnClick={() => { }}
		/>
	</main>
}