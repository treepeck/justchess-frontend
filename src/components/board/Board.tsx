import "./Board.css"

import { useReducer } from "react"
import { reducer, init, Action } from "./board.reducer"

import { PieceType } from "../../game/pieceType"
import { LegalMove } from "../../game/move"
import { FEN2Board, parseActiveColor, piece2ClassName } from "../../game/fen"
import { Color } from "../../game/enums"
import Dialog from "../dialog/Dialog"

type BoardProps = {
	fen: string
	side: Color
	onMove: Function
	checked: PieceType
	legalMoves: LegalMove[]
}

const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

export default function Board({ fen, side, onMove, checked, legalMoves }: BoardProps) {
	const [state, dispatch] = useReducer(reducer, init)

	function onSquareClick(ind: number, pt: PieceType) {
		dispatch({ type: Action.CLEAR_MARKED, payload: null })

		// If the clicked piece has the same color.
		if ((pt + 1) % 2 == (side ^ 1) && pt != PieceType.NoPiece) {
			dispatch({ type: Action.SET_SELECTED, payload: ind })
			return
		}

		for (const move of legalMoves) {
			if (move.s === state.selected && move.d === ind) {
				if (move.t < 6) {
					onMove(move)
					dispatch({ type: Action.SET_SELECTED, payload: null })
				} else {
					dispatch({ type: Action.TOGGLE_DIALOG, payload: true })
					dispatch({ type: Action.SET_PROMOTION_MOVE, payload: move })
				}
				return
			}
		}
	}

	function onPromotion(pt: PieceType) {
		if (!state.promotionMove) return

		const mt = state.promotionMove.t >= 10 ? 10 + pt : 6 + pt
		onMove(new LegalMove(state.isDialogActive.d, state.promotionMove.s, mt))

		dispatch({ type: Action.SET_SELECTED, payload: null })
		dispatch({ type: Action.TOGGLE_DIALOG, payload: false })
	}

	function onMarkSquare(ind: number) {
		if (state.marked.find(el => el === ind)) {
			dispatch({ type: Action.REMOVE_MARKED, payload: ind })
		} else {
			dispatch({ type: Action.ADD_MARKED, payload: ind })
		}
	}

	function formatClassName(ind: number, pt: PieceType): string {
		let name = "square " + piece2ClassName(pt)

		if (ind == state.selected) {
			name += " selected"
		}

		if (legalMoves.find(el => el.s === state.selected && el.d === ind)) {
			name += " legal"
		}

		if (state.marked.find(el => el === ind)) {
			name += " marked"
		}

		if (pt === checked && pt != PieceType.NoPiece) {
			name += " checked"
		}

		return name
	}

	return <div className={`board ${side == Color.White ? "white" : "black"}`}>
		{FEN2Board(fen).map((piece, ind) => <div
			key={ind}
			className={formatClassName(ind, piece)}
			// Left click.
			onClick={() => onSquareClick(ind, piece)}
			// Right click.
			onContextMenu={e => {
				e.preventDefault()
				onMarkSquare(ind)
			}}
		>
		</div>)}

		<Dialog
			isActive={state.isDialogActive}
			onClose={() => dispatch({ type: Action.TOGGLE_DIALOG, payload: false })}
			hasClose={true}
		>
			<div className={`${parseActiveColor(fen)}-knight`}
				onClick={() => onPromotion(0)}
			/>
			<div className={`${parseActiveColor(fen)}-bishop`}
				onClick={() => onPromotion(1)}
			/>
			<div className={`${parseActiveColor(fen)}-rook`}
				onClick={() => onPromotion(2)}
			/>
			<div className={`${parseActiveColor(fen)}-queen`}
				onClick={() => onPromotion(3)}
			/>
		</Dialog>

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
}