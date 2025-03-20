// Styling.
import "./Board.css"

// React stuff.
import { useReducer } from "react"
import { reducer, init, Action } from "./board.reducer"

// Game "logic".
import { PieceType } from "../../game/pieceType"
import { LegalMove } from "../../game/move"
import { FEN2Board, parseActiveColor, piece2ClassName } from "../../game/fen"

type BoardProps = {
	fen: string
	side: number // 0 - White, 1 - Black.
	onMove: Function
	checked: PieceType
	legalMoves: LegalMove[]
}

const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

export default function Board({ fen, side, onMove, checked, legalMoves }: BoardProps) {
	const [state, dispatch] = useReducer(reducer, init)

	function getClassName(index: number, piece: PieceType): string {
		let name = "board-square " + piece2ClassName(piece)

		name += index == state.selected ? " selected" : ""

		if (legalMoves.find(el => el.s == state.selected && el.d == index)) {
			name += " legal"
		}

		if (state.marked.find(el => el === index)) {
			name += " marked"
		}

		return piece === checked ? name + " checked" : name
	}

	function handleClickSquare(index: number, piece: PieceType) {
		dispatch({ type: Action.CLEAR_MARKED, payload: null })

		if ((piece + 1) % 2 == (side ^ 1) && piece != PieceType.NoPiece) {
			dispatch({ type: Action.SET_SELECTED, payload: index })
			return
		}

		for (const legalMove of legalMoves) {
			if (legalMove.s == state.selected && legalMove.d == index) {
				if (legalMove.t < 6) { // If move type is not promotion.
					onMove(legalMove)
					dispatch({ type: Action.SET_SELECTED, payload: null })
				} else {
					dispatch({ type: Action.TOGGLE_DIALOG, payload: true })
					dispatch({ type: Action.SET_PROMOTION_MOVE, payload: legalMove })
				}
				return
			}
		}
	}

	// pieceType - 0 - knight, 1 - bishop, 2 - rook, 3 - queen.
	function handlePromotion(pieceType: number) {
		if (!state.promotionMove) return

		let mt = state.promotionMove.t >= 10 ? 10 + pieceType : 6 + pieceType
		onMove(new LegalMove(state.promotionMove.d, state.promotionMove.s, mt))

		dispatch({ type: Action.SET_SELECTED, payload: null })
		dispatch({ type: Action.TOGGLE_DIALOG, payload: false })
	}

	function handleMarkSquare(index: number) {
		if (state.marked.find(el => el === index)) {
			dispatch({ type: Action.REMOVE_MARKED, payload: index })
		} else {
			dispatch({ type: Action.ADD_MARKED, payload: index })
		}
	}

	return (
		<div className={`board ${side && "black"}`}>
			{state.isDialogActive && (
				<div className="piece-selection-container" onClick={() => dispatch({
					type: Action.TOGGLE_DIALOG, payload: false
				})}>
					<div className={`${parseActiveColor(fen)}-knight`}
						onClick={() => handlePromotion(0)}
					/>
					<div className={`${parseActiveColor(fen)}-bishop`}
						onClick={() => handlePromotion(1)}
					/>
					<div className={`${parseActiveColor(fen)}-rook`}
						onClick={() => handlePromotion(2)}
					/>
					<div className={`${parseActiveColor(fen)}-queen`}
						onClick={() => handlePromotion(3)}
					/>
				</div>
			)}

			{FEN2Board(fen).map((piece, index) =>
				<div
					key={index}
					className={getClassName(index, piece)}
					// Left click.
					onClick={() => handleClickSquare(index, piece)}
					// Right click.
					onContextMenu={e => {
						e.preventDefault()
						handleMarkSquare(index)
					}}
				/>
			)}

			<div className="files">
				{files.map((file, index) => (
					<div key={index}>
						{file}
					</div>
				))}
			</div>

			<div className="ranks">
				{ranks.map((rank, index) => (
					<div key={index}>
						{rank}
					</div>
				))}
			</div>
		</div>
	)
}