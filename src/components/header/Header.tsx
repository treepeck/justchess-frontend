import "./Header.css"
import { Link } from "react-router"
import ThemeToggle from "../theme-toggle/ThemeToggle"

export default function Sidebar() {
	return (
		<div className="header">
			<div>
				<Link to="http://localhost:3000/">JustChess.org</Link>
			</div>
			<ThemeToggle />
		</div>
	)
}