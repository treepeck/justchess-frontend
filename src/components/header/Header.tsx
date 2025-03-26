import "./Header.css"
import ThemeToggle from "../theme-toggle/ThemeToggle"

export default function Header() {
	return (
		<div className="header">
			<a href="http://localhost:3000/">JustChess.org</a>
			<ThemeToggle />
		</div>
	)
}