import "./MailVerify.css"

import { sendVerify } from "../../http/http"
import { useTheme } from "../../context/Theme"
import Header from "../../components/header/Header"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

export default function MailVerify() {
	const { userId } = useParams()
	const { theme } = useTheme()

	const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false)

	useEffect(() => {
		const verify = async function () {
			const res = await sendVerify(userId as string)
			if (res) {
				setIsSuccessfull(true)
			}
		}
		verify()
	}, [])

	return (
		<div className="main-container" data-theme={theme}>
			<Header />

			{isSuccessfull ? (
				<p className="verify">
					You have been successfully registered!
				</p>
			) : (
				<p className="verify">
					Verification is not valid.
				</p>
			)}
		</div>
	)
}