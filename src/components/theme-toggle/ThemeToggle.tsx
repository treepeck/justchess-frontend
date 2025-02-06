import { useTheme } from "../../context/Theme"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        // Update theme record in a local storage.
        localStorage.setItem("theme", newTheme)
      }}
    >
      {theme === "dark" ? "Light theme" : "Dark theme"}
    </button>
  )
}