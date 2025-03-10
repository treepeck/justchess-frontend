import "./Dialog.css"
import { ReactNode } from "react"

type DialogProps = {
	caption: string,
	children: ReactNode,
	onClick: () => void,
}

export default function Dialog({ caption, children, onClick }: DialogProps) {
	return (
		<div className="dialog-container" onClick={() => onClick()}>
			<div className="dialog" onClick={e => e.stopPropagation()}>
				<p>{caption}</p>
				{children}
			</div>
		</div>
	)
}