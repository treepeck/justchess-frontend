import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Home - JustChess.org"
}

export default function Home() {
	return (
		<main className="h-full max-w-screen-xl mx-auto " >
			<p className="flex justify-center items-center h-full text-4xl">
				Home page
			</p>
		</main>
	)
}