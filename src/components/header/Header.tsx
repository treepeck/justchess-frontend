import "./Header.css"
import { Link } from "react-router"
import ThemeToggle from "../theme-toggle/ThemeToggle"

export default function Sidebar() {
	return (
		<aside className="header">
			<nav>
				<ul>
					<li><Link to="http://localhost:3000/">JustChess.org</Link></li>
					<li><Link to="http://localhost:3000/play">Play</Link></li>
					<li></li>
				</ul>
			</nav>
			<ThemeToggle />
		</aside>
	)
}