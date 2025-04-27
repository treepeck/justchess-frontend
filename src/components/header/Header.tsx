import "./Header.css"
import { Role } from "../../http/http"
import { useAuth } from "../../context/Auth"
import ThemeToggle from "../theme-toggle/ThemeToggle"

export default function Header() {
	const { player } = useAuth()!

	return (
		<header>
			<a href={`${process.env.REACT_APP_DOMAIN}`}>JustChess.org</a>

			{player.role == Role.Guest ? <a href={`${process.env.REACT_APP_DOMAIN}/signup`}>SIGN UP</a>
				: <a href={`${process.env.REACT_APP_DOMAIN}/player/${player.id}`}>{player.username}
				</a>}
			<ThemeToggle />
		</header>
	)
}