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
import EngineConfProvider from "./context/EngineConf"
import AuthenticationProvider from "./context/Authentication"

const routes: RouteObject[] = createRoutesFromElements(
	<Route element={<ThemeProvider />}>
		<Route element={<AuthenticationProvider />}>
			<Route element={<EngineConfProvider />}>
				<Route element={<Home />} path="/" />
				<Route element={<Play />} path="/:roomId" />
			</Route>
		</Route>
	</Route>
)

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)