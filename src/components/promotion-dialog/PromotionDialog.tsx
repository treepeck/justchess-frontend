import "./PromotionDialog.css"

type PromotionDialogProps = {
	onClose: Function
	onClick: Function
	activeColor: string
	toFile: number // Needed to align the dialog properly.
}

const pieces = ["knight", "bishop", "rook", "queen"]

export default function PromotionDialog({ activeColor, onClose, onClick, toFile }:
	PromotionDialogProps) {

	return <div className="promotion-dialog-container" onClick={() => onClose()}>
		<div className="promotion-dialog" style={{
			marginLeft: `calc(12.5% * ${activeColor == "white" ? toFile % 8 : (7 - toFile) % 8})`
		}}>
			{pieces.map((piece, ind) => <div
				key={ind}
				className={`${activeColor}-${piece}`}
				onClick={() => onClick(ind)}
			/>)}
		</div>
	</div>
}