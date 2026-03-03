import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react/jsx-runtime";
import { DataTable } from "../components/ui/DataTable";
// eslint-disable-next-line no-duplicate-imports
import type { Column } from "../components/ui/DataTable";
import { useAppStore } from "../store/appStore";
import type { Cliente } from "../domain/models/Cliente";

const columns: Array<Column<Cliente>> = [
	{ header: "ID", render: (c: Cliente): number => c.id },
	{ header: "Nombre", render: (c: Cliente): string => c.nombre },
	{ header: "Dirección", render: (c: Cliente): string => c.direccion },
	{ header: "Contacto", render: (c: Cliente): string => c.contacto },
];

function ClientesPage(): JSX.Element {
	const clientes = useAppStore((s) => s.clientes);

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Clientes</h1>
			<DataTable<Cliente>
				columns={columns}
				data={clientes}
				getRowId={(c: Cliente): number => c.id}
			/>
		</div>
	);
}

export const Route = createFileRoute("/clientes")({
	component: ClientesPage,
});
