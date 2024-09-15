import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

import Home from "./pages/home/Home"
import Play from "./pages/play/Play"

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"

import { UserProvider } from "./context/useAuth"
import ConnectionProvider from "./context/connection"

const routes = createRoutesFromElements(
  <Route element={<UserProvider />}>
    <Route element={<ConnectionProvider />}>
      <Route path="/" element={<Home />} />
      <Route path="/play/:id" element={<Play />} />
    </Route>
  </Route>
)

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <RouterProvider router={router} />
)
