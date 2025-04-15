import { useEffect, useState } from "react"

import Home from "./pages/home/Home"
import Play from "./pages/play/Play"
import AuthProvider from "./context/Auth"
import Signup from "./pages/signup/Signup"
import Signin from "./pages/signin/Signin"
import ThemeProvider from "./context/Theme"
import Profile from "./pages/profile/Profile"
import NotFound from "./pages/not-found/NotFound"
import EngineConfProvider from "./context/EngineConf"
import MailVerify from "./pages/mail-verify/MailVerify"

export default function Router() {
	const [currentPath, setCurrentPath] = useState<string>(window.location.pathname + window.location.search)

	useEffect(() => {
		const onPathChange = function () {
			setCurrentPath(window.location.pathname + window.location.search)
		}

		window.addEventListener("popstate", onPathChange)

		return () => {
			window.removeEventListener("popstate", onPathChange)
		}
	}, [])

	function route() {
		if (currentPath.match(/^\/$/) ||
			// RegExp for UUID.	
			(currentPath.match(/^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/))) {
			return <EngineConfProvider>
				{currentPath.length == 1
					? <Home />
					: <Play />}
			</EngineConfProvider>
		}
		else if (currentPath.match(/^\/player\/[a-zA-Z0-9\-]{2,}$/)) {
			return <Profile />
		}
		else if (currentPath.match(/^\/verify\?action\=((reset)|(registration))\&token\=[A-Z0-9]+$/)) {
			return <MailVerify />
		}
		else if (currentPath.match(/^\/signup$/)) {
			return <Signup />
		}
		else if (currentPath.match(/^\/signin$/)) {
			return <Signin />
		}

		return <NotFound />
	}

	return <ThemeProvider>
		<AuthProvider>
			{route()}
		</AuthProvider>
	</ThemeProvider>
}