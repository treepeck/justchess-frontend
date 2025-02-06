import {
	useState,
	useContext,
	createContext,
	useEffect,
} from "react"
import { Outlet } from "react-router-dom"

type ThemeCtx = {
	theme: string,
	setTheme: (_: string) => void,
}

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", setTheme: () => { } })

export default function ThemeProvider() {
	const [_theme, _setTheme] = useState<string>("dark")

	useEffect(() => {
		const themeFromLocal = localStorage.getItem("theme")
		if (!themeFromLocal) {
			const preference = window.matchMedia("(prefers-color-scheme: dark)").matches
			localStorage.setItem("theme", preference ? "dark" : "light")
		}
		_setTheme(localStorage.getItem("theme") === "light" ? "light" : "dark")
	}, [])

	return (
		<ThemeContext.Provider value={{
			theme: _theme,
			setTheme: _setTheme,
		}}>
			{/* Render child components. */}
			<Outlet />
		</ThemeContext.Provider>
	)
}

export function useTheme() { return useContext(ThemeContext) }