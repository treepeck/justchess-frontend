import "./Header.css"
import { useAuth } from "../../context/Auth"
import ThemeToggle from "../theme-toggle/ThemeToggle"
import { Role } from "../../http/http"

export default function Header() {
	const { player } = useAuth()!

	return (
		<header>
			<i>
				<a href="http://localhost:3000/">JustChess.org</a>
			</i>

			{player.role == Role.Guest ? <a href="http://localhost:3000/signup">SIGN UP</a>
				: <a href={`http://localhost:3000/player/${player.username}`}>{player.username}
				</a>}

			<ThemeToggle />
		</header>
	)
}