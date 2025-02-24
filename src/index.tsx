import "./index.css"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import {
	Route,
	RouteObject,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom"
import Home from "./pages/home/Home"
import Play from "./pages/play/Play"
import ThemeProvider from "./context/Theme"
import ConnectionProvider from "./context/Connection"
import AuthenticationProvider from "./context/Authentication"

const routes: RouteObject[] = createRoutesFromElements(
	<Route element={<ThemeProvider />}>
		<Route element={<AuthenticationProvider />}>
			<Route element={<ConnectionProvider />}>
				<Route element={<Play />} path="/:roomId" />
				<Route element={<Home />} path="/" />
			</Route>
		</Route>
	</Route>
)

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)