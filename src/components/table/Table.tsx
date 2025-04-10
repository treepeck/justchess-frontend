import "./Table.css"

type TableProps = {
	caption: string
	headerCols: string[]
	children: any
}

export default function Table({ caption, headerCols,
	children
}: TableProps) {

	return <div className="table">
		<div className="t-caption">{caption}</div>

		<div className="t-header">
			{headerCols.map((col, index) => (
				<div className="col" key={index}>
					{col}
				</div>
			))}
		</div>

		<div className="t-body">
			{children}
		</div>
	</div>
}