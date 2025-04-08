import {
	useState,
	useEffect,
	useContext,
	createContext,
} from "react"

type ThemeCtx = {
	theme: string
	setTheme: React.Dispatch<React.SetStateAction<string>>
}

const ThemeContext = createContext<ThemeCtx | null>(null)

export default function ThemeProvider({ children }: any) {
	const [theme, setTheme] = useState<string>("dark")

	useEffect(() => {
		const themeFromLocal = localStorage.getItem("theme")

		// Set dark by default.
		if (!themeFromLocal) localStorage.setItem("theme", "dark")

		setTheme(localStorage.getItem("theme") === "light" ? "light" : "dark")
	}, [])

	return <ThemeContext.Provider value={{ theme, setTheme }}>
		{children}
	</ThemeContext.Provider>
}

export function useTheme() { return useContext(ThemeContext) } 