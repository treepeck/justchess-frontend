import "./Header.css"
import { useAuth } from "../../context/Auth"
import ThemeToggle from "../theme-toggle/ThemeToggle"
import { Role } from "../../http/http"

export default function Header() {
	const { user } = useAuth()!

	return (
		<header>
			<i>
				<a href="http://localhost:3000/">JustChess.org</a>
			</i>

			{user.role == Role.Guest ? <a href="http://localhost:3000/signup">SIGN UP</a>
				: <a href={`http://localhost:3000/user/${user.username}`}>{user.username}
				</a>}

			<ThemeToggle />
		</header>
	)
}