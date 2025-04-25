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
			<a href={process.env.REACT_APP_DOMAIN}>Home page</a>
		</h1>
	</main>
}