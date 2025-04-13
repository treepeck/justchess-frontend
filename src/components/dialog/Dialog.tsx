import "./Dialog.css"

import { useEffect, useRef } from "react"

type DialogProps = {
	isActive: boolean
	onClose: Function
	children: any
	hasClose: boolean
}

export default function Dialog({ isActive,
	onClose, children, hasClose
}: DialogProps) {
	const ref = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		if (isActive) {
			ref.current?.showModal()
		} else {
			ref.current?.close()
		}
	}, [isActive])

	return <dialog ref={ref} onCancel={e => { e.preventDefault(); onClose() }}>
		{children}
		{hasClose && <button id="close" onClick={e => onClose()} />}
	</dialog>
}