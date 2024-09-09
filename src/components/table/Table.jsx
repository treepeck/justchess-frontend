import styles from "./table.module.css"

export default function Table({ tableHeaders, tableData }) {

  return (
    <table>
      <tr>
        {tableHeaders.map((header, _) =>
          <th>
            {header}
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