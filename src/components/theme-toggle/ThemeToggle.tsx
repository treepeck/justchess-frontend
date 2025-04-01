import "./ThemeToggle.css"
import { useTheme } from "../../context/Theme"

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme()!

	return (
		<button
			className={"theme-toggle " + (theme == "dark" ? "day" : "night")}
			onClick={() => {
				const newTheme = theme === "dark" ? "light" : "dark"
				setTheme(newTheme)
				// Update theme record in a local storage.
				localStorage.setItem("theme", newTheme)
			}}
		/>
	)
}