import "./Board.css"
import { useEffect, useState } from "react"
import { LegalMove } from "../../game/move"
import { PieceType } from "../../game/pieceType"
import { parseFEN, piece2ASCII } from "../../game/fen"

type BoardProps = {
	fen: string
	legalMoves: LegalMove[]
	onMove: Function
}

export default function Board(props: BoardProps) {
	const [selected, setSelected] = useState<number | null>(null)
	const [board, setBoard] = useState<PieceType[]>(parseFEN(props.fen))

	useEffect(() => {
		setBoard(parseFEN(props.fen))
	}, [props.fen])

	function getClassName(index: number): string {
		let name = "board-square"
		if (index == selected) {
			return name + " selected"
		}
		for (const legalMove of props.legalMoves) {
			if (legalMove.from == selected && legalMove.to == index) {
				name += " legal"
				break
			}
		}
		return name
	}

	function handleClickSquare(index: number) {
		if (selected == null) {
			setSelected(index)
		}
		for (const legalMove of props.legalMoves) {
			if (legalMove.from == selected && legalMove.to == index) {
				props.onMove(legalMove)
				return
			}
		}
		setSelected(index)
	}

	return (
		<div className="board">
			{board.map((piece, index) =>
				<div
					key={index}
					className={getClassName(index)}
					onClick={() => handleClickSquare(index)}
				>
					{piece2ASCII(piece)}
				</div>
			)
			}
		</div >
	)
}