import "./PasswordReset.css"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"

export default function PasswordReset() {
	const { theme } = useTheme()!

	return <main data-theme={theme}>
		<form>
			<Header />

		</form>
	</main>
}