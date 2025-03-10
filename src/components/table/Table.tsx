import "./Table.css"

type TableProps = {
	caption: string,
	headerCols: string[],
	bodyRows: any[],
	bodyOnClick: React.MouseEventHandler<HTMLDivElement>,
}

export default function Table({ caption, headerCols, bodyRows, bodyOnClick }: TableProps) {

	return (
		<div className="table">
			<div className="t-caption">{caption}</div>

			<div className="t-header">
				{headerCols.map((col, index) => (
					<div className="col" key={index}>
						{col}
					</div>
				))}
			</div>

			<div className="t-body">
				{bodyRows.map((row, index) => (
					<div
						className="row"
						onClick={bodyOnClick}
						data-row={row.id}
						key={index}
					>
						{row}
					</div>
				))}
			</div>
		</div>
	)
}