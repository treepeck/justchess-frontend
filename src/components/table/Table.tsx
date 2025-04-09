import "./Table.css"

type TableProps = {
	caption: string,
}

export default function Table({ caption }: TableProps) {

	return <table>
		{/* Caption */}
		<h2>{caption}</h2>

		{/* Header */}
		<tr>
			<th></th>
		</tr>

	</table>
}