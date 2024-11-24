import "./MovesTable.css"
import Move from "../../game/move"
import { MoveType } from "../../api/enums"

type MovesTableProps = {
  moves: Move[]
}

export default function MovesTable({ moves }: MovesTableProps) {
  return (
    <div className="moves">
      <table>
        <tbody>
          {moves.map((m, ind) => (
            <tr
              key={ind}
            >
              <td>
                {/* {m} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}