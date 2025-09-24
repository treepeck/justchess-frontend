import "./globals.css"

import React from "react"
import type { Metadata } from "next"

import Header from "./components/Header"
import Footer from "./components/Footer"

export const metadata: Metadata = {
	icons: { icon: "/favicon.png" },
}

export default function RootLayout({ children }: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className="
				h-screen
				w-full
				leading-[1.5]
				flex
				flex-col
				bg-[var(--background)]
				text-[var(--foreground)]
				font-sans
			">
				<React.StrictMode>
					<Header />
					<main className="flex grow">{children}</main>
					<Footer />
				</React.StrictMode>
			</body>
		</html>
	)
}