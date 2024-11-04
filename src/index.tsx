import ReactDOM from "react-dom/client"
import "./index.css"

import {
  Route,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import { AuthProvider } from "./context/Auth"
import ConnProvider from "./context/Conn"
import Home from "./pages/home/Home"
import Play from "./pages/play/Play"

const routes: RouteObject[] = createRoutesFromElements(
  <Route element={<AuthProvider />}>
    <Route element={<ConnProvider />}>
      <Route path="/" element={<Home />} />
      <Route path="/play/:id" element={<Play />} />
    </Route>
  </Route >
)

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <RouterProvider router={router} />
)
