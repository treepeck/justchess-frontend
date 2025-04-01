import "./NotFound.css"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"

export default function NotFound() {
	const { theme } = useTheme()!

	return <main data-theme={theme}>
		<Header />

		<h1>
			The requested page wasn't found.
			<br />
			<a href="http://localhost:3000/">Home page</a>
		</h1>
	</main>
}