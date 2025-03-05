import "./Dialog.css"
import { ReactNode } from "react"

export default function Dialog({ children, onClick }: {
	children: ReactNode,
	onClick: () => void
}) {
	return (
		<div className="dialog-container" onClick={() => onClick()}>
			<div className="dialog" onClick={e => e.stopPropagation()}>
				{children}
			</div>
		</div>
	)
}