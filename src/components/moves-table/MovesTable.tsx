import "./MovesTable.css"
import Move from "../../game/move"

type MovesTableProps = {
  moves: Move[]
}

export default function MovesTable({ moves }: MovesTableProps) {

  const movePairs = []
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([moves[i].lan, moves[i + 1] ? moves[i + 1].lan : ""])
  }

  return (
    <div className="moves">
      <div className="headRow">
        <div className="ind">
          №
        </div>
        <div className="halfmove">
          White
        </div>
        <div className="halfmove">
          Black
        </div>
      </div>
      <div className="movesTable">
        {movePairs.map((pair, ind) => (
          <div className="row">
            <div className="ind">
              {ind + 1}
            </div>
            <div className="halfmove">
              {pair[0]}
            </div>
            <div className="halfmove">
              {pair[1]}
            </div>
          </div>
        ))}
      </div>
    </div >
  )
}