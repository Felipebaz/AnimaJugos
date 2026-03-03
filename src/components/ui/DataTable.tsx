import type { ReactNode } from "react";
import type { JSX } from "react/jsx-runtime";

export interface Column<T> {
	header: string;
	render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
	data: Array<T>;
	columns: Array<Column<T>>;
	getRowId: (item: T) => string | number;
}

export function DataTable<T>({ data, columns, getRowId }: DataTableProps<T>): JSX.Element {
	return (
		<div className="overflow-x-auto rounded-lg border border-gray-200">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-100">
					<tr>
						{columns.map((col) => (
							<th
								key={col.header}
								className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
							>
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100 bg-white">
					{data.map((item) => (
						<tr
							key={getRowId(item)}
							className="transition-colors hover:bg-gray-50"
						>
							{columns.map((col) => (
								<td
									key={col.header}
									className="whitespace-nowrap px-4 py-3 text-sm text-gray-700"
								>
									{col.render(item)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
