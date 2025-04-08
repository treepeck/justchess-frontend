import "./Header.css"
import { useAuth } from "../../context/Auth"
import ThemeToggle from "../theme-toggle/ThemeToggle"
import { Role } from "../../http/http"

export default function Header() {
	const { player } = useAuth()!

	return (
		<header>
			<a href="http://localhost:3000/">JustChess.org</a>

			{player.role == Role.Guest ? <a href="http://localhost:3000/signup">SIGN UP</a>
				: <a href={`http://localhost:3000/player/${player.id}`}>{player.username}
				</a>}
			<ThemeToggle />
		</header>
	)
}