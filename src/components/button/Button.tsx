import "./Button.css"

export default function Button({ text, onClick, isCancel = false, isConfirm = false }: any) {
	return (
		<button
			className={`button ${isCancel ? "cancel" : ""} ${isConfirm ? "confirm" : ""}`}
			onClick={onClick}
		>
			{text}
		</button>
	)
}