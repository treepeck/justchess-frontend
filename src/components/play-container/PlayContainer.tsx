import "./PlayContainer.css"
import Game from "../../game/game"
import Board from "../board/Board"
import { CompletedMove, LegalMove } from "../../game/move"
import Miniprofile from "../miniprofile/Miniprofile"
import Clock from "../clock/Clock"

type PlayContainerProps = {
	game: Game,
	whiteId: string,
	blackId: string,
	whiteTime: number,
	blackTime: number,
	setWhiteTime: React.Dispatch<React.SetStateAction<number>>,
	setBlackTime: React.Dispatch<React.SetStateAction<number>>,
	activeColor: string,
	displayTimers: boolean,
	onMove: (_: LegalMove) => void,
}

export default function PlayContainer({ whiteId, blackId,
	whiteTime, blackTime, game, onMove, displayTimers, activeColor,
	setWhiteTime, setBlackTime
}: PlayContainerProps) {

	function formatFullmovePairs(moves: CompletedMove[]): {
		white: string,
		black: string
	}[] {
		const pairs: any = []
		for (let i = 0; i < moves.length; i += 2) {
			pairs.push({
				white: moves[i].s,
				black: moves[i + 1] ? moves[i + 1].s : "",
			})
		}
		return pairs
	}

	return (
		<div className="play-container">
			<div className="board-container">
				<div className="row">
					<Miniprofile id={blackId} />
					{displayTimers && (
						<Clock
							time={blackTime}
							isActive={"black" == activeColor}
							setTime={setBlackTime}
						/>
					)}
				</div>
				<Board
					fen={game.currentFEN}
					legalMoves={game.legalMoves}
					onMove={(move: LegalMove) => {
						onMove(move)
					}}
				/>
				<div>
					<Miniprofile id={whiteId} />
					{displayTimers && (
						<Clock
							time={whiteTime}
							isActive={"white" == activeColor}
							setTime={setWhiteTime}
						/>
					)}
				</div>
			</div>

			<div className="table">
				<div className="caption">Completed moves</div>

				<div className="table-header">
					<div className="col">
						#
					</div>

					<div className="col">
						White
					</div>

					<div className="col">
						Black
					</div>
				</div>

				<div className="table-body">
					{formatFullmovePairs(game.moves).map((fullmove, index) =>
						<div
							className="row"
							// TODO: add move undo.
							onClick={() => { }}
							key={index}
						>
							<div className="col">
								{index + 1}
							</div>

							<div className="col">
								{fullmove.white}
							</div>

							<div className="col">
								{fullmove.black}
							</div>
						</div>)}
				</div>
			</div>
		</div >
	)
}