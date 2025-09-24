import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Home - JustChess.org"
}

export default function Home() {
	return (
		<p className="text-4xl m-auto">
			Home page
		</p>
	)
}