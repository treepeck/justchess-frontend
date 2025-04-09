import "./Button.css"

type ButtonProps = {
	text: string
	onClick: React.ReactEventHandler
}

export default function Button({ text, onClick }: ButtonProps) {
	return (
		<button className="button" onClick={onClick}>
			{text}
		</button>
	)
}