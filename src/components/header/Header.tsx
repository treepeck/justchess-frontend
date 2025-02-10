import "./Header.css"
import { Link } from "react-router"
import ThemeToggle from "../theme-toggle/ThemeToggle"

export default function Sidebar() {
	return (
		<header className="header">
			<nav>
				<Link to="http://localhost:3000/">JustChess.org</Link>
			</nav>
			<ThemeToggle />
		</header>
	)
}