import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react/jsx-runtime";
import { DataTable } from "../components/ui/DataTable";
// eslint-disable-next-line no-duplicate-imports
import type { Column } from "../components/ui/DataTable";
import { useAppStore } from "../store/appStore";
import type { Ingrediente } from "../domain/models/Ingrediente";

const columns: Array<Column<Ingrediente>> = [
	{ header: "ID", render: (index: Ingrediente): number => index.id },
	{ header: "Nombre", render: (index: Ingrediente): string => index.nombre },
	{ header: "Unidad", render: (index: Ingrediente): string => index.unidad },
];

function IngredientesPage(): JSX.Element {
	const ingredientes = useAppStore((s) => s.ingredientes);

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Ingredientes</h1>
			<DataTable<Ingrediente>
				columns={columns}
				data={ingredientes}
				getRowId={(index: Ingrediente): number => index.id}
			/>
		</div>
	);
}

export const Route = createFileRoute("/ingredientes")({
	component: IngredientesPage,
});
