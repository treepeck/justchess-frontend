import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

import Home from "./pages/home/Home"

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"

import { UserProvider } from "./context/useAuth"

const routes = createRoutesFromElements(
  <Route element={<UserProvider />}>
    <Route path="/" element={<Home />} />
  </Route>
)

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <RouterProvider router={router} />
)
