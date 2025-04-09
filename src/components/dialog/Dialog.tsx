import "./Dialog.css"

import Button from "../button/Button"

import { useEffect, useRef } from "react"

type DialogProps = {
	isActive: boolean
	onConfirm: React.ReactEventHandler
	onClose: React.ReactEventHandler
	children: any
}

export default function Dialog({ isActive,
	onConfirm, onClose, children
}: DialogProps) {
	const ref = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		if (isActive) {
			ref.current?.showModal()
		} else {
			ref.current?.close()
		}
	}, [isActive])

	return <dialog ref={ref} onCancel={onClose}>
		{children}

		<Button
			text="Confirm"
			onClick={onConfirm}
		/>

		<button id="close" onClick={onClose} />
	</dialog>
}