import "./Board.css"
import { useEffect, useState } from "react"
import { LegalMove, MoveType } from "../../game/move"
import { PieceType } from "../../game/pieceType"
import { FEN2Board, parseActiveColor, piece2ClassName } from "../../game/fen"

type BoardProps = {
	fen: string
	legalMoves: LegalMove[]
	onMove: Function
}

export default function Board(props: BoardProps) {
	const [selected, setSelected] = useState<number | null>(null)
	const [board, setBoard] = useState<PieceType[]>(FEN2Board(props.fen))
	// Is piece selection window active.
	const [isPSWA, setIsPSWA] = useState<boolean>(false)
	const [promoMove, setPromoMove] = useState<LegalMove | null>(null)

	useEffect(() => {
		setBoard(FEN2Board(props.fen))
	}, [props.fen])

	function getClassName(index: number, piece: PieceType): string {
		let name = "board-square " + piece2ClassName(piece) + " "
		if (index == selected) {
			return name + " selected"
		}

		// TODO: Highlight legal moves only for allies pieces.
		for (const legalMove of props.legalMoves) {
			if (legalMove.from == selected && legalMove.to == index) {
				name += " legal"
				break
			}
		}
		return name
	}

	function handleClickSquare(index: number) {
		if (selected == null) { setSelected(index) }

		for (const legalMove of props.legalMoves) {
			if (legalMove.from == selected && legalMove.to == index) {
				if (legalMove.type < 6) { // If move type is not promotion.
					props.onMove(legalMove)
				} else {
					setIsPSWA(true)
					setPromoMove(legalMove)
				}
				return
			}
		}
		setSelected(index)
	}

	// pieceType - 0 - knight, 1 - bishop, 2 - rook, 3 - queen.
	function handlePromotion(pieceType: number) {
		if (!promoMove) { return }
		let mt: MoveType
		// If the move was a capture.
		if (promoMove.type >= 10) {
			mt = 10 + pieceType
		} else {
			mt = 6 + pieceType
		}
		const m = new LegalMove(promoMove.to, promoMove.from, mt)
		props.onMove(m)
		setIsPSWA(false)
	}

	return (
		<div className="board">
			{isPSWA && (
				<div className="piece-selection-container" onClick={() => setIsPSWA(false)}>
					<div className={`${parseActiveColor(props.fen)}-knight`}
						onClick={() => handlePromotion(0)}
					/>
					<div className={`${parseActiveColor(props.fen)}-bishop`}
						onClick={() => handlePromotion(1)}
					/>
					<div className={`${parseActiveColor(props.fen)}-rook`}
						onClick={() => handlePromotion(2)}
					/>
					<div className={`${parseActiveColor(props.fen)}-queen`}
						onClick={() => handlePromotion(3)}
					/>
				</div>
			)}

			{board.map((piece, index) =>
				<div
					key={index}
					className={getClassName(index, piece)}
					onClick={() => handleClickSquare(index)}
				>
				</div>
			)
			}
		</div >
	)
}