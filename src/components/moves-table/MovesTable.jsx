import styles from "./movesTable.module.css"

export default function MovesTable({ moves }) {

  return (
    <table>
      <tr>
        {tableHeaders.map((header, _) =>
          <th>
            <td></td>
          </th>
        )}
      </tr>
      <tr>
        {tableData.map((data, _) =>
          <td>
            {data}
          </td>
        )}
      </tr>
    </table>
  )
}