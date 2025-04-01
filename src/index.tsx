import "./index.css"

import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import {
	Navigate,
	Route,
	Routes,
	BrowserRouter,
} from "react-router-dom"

import Home from "./pages/home/Home"
import AuthProvider from "./context/Auth"
import Signup from "./pages/signup/Signup"
import Signin from "./pages/signin/Signin"
import ThemeProvider from "./context/Theme"
import NotFound from "./pages/not-found/NotFound"
import MailVerify from "./pages/mail-verify/MailVerify"
import Play from "./pages/play/Play"
import EngineConfProvider from "./context/EngineConf"
import PasswordReset from "./pages/password-reset/PasswordReset"

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<ThemeProvider />}>
					<Route element={<AuthProvider />}>
						<Route element={<EngineConfProvider />}>
							<Route path="/" element={<Home />} />

							<Route path="/:roomId" element={<Play />} />
						</Route>

						<Route path="/signup" element={<Signup />} />

						<Route path="/signin" element={<Signin />} />

						<Route path="/verify" element={<MailVerify />} />

						<Route path="/404" element={<NotFound />} />

						<Route path="/reset" element={<PasswordReset />} />

						<Route path="*" element={<Navigate to="/404" />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
)