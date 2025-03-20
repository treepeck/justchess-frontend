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
						data-row={index}
						key={index}
					>
						{Object.entries(row).map(([key, val]) => (
							<div className="col" key={key}>
								{val as any}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	)
}