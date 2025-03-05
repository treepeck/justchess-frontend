import "./Header.css"
import ThemeToggle from "../theme-toggle/ThemeToggle"

export default function Header() {
	return (
		<div className="header">
			<div>
				<a href="http://localhost:3000/">JustChess.org</a>
			</div>
			<ThemeToggle />
		</div>
	)
}