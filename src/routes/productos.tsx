import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react/jsx-runtime";
import { DataTable } from "../components/ui/DataTable";
// eslint-disable-next-line no-duplicate-imports
import type { Column } from "../components/ui/DataTable";
import { useAppStore } from "../store/appStore";
import type { Producto } from "../domain/models/Producto";

const columns: Array<Column<Producto>> = [
	{ header: "ID", render: (p: Producto): number => p.id },
	{ header: "Nombre", render: (p: Producto): string => p.nombre },
	{ header: "Tipo", render: (p: Producto): string => p.tipo },
	{
		header: "Precio",
		render: (p: Producto): string => `$${p.precio.toFixed(2)}`,
	},
	{
		header: "Estado",
		render: (p: Producto): JSX.Element => (
			<span
				className={`rounded-full px-2 py-0.5 text-xs font-medium ${
					p.activo
						? "bg-green-100 text-green-700"
						: "bg-red-100 text-red-700"
				}`}
			>
				{p.activo ? "Activo" : "Inactivo"}
			</span>
		),
	},
];

function ProductosPage(): JSX.Element {
	const productos = useAppStore((s) => s.productos);

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Productos</h1>
			<DataTable<Producto>
				columns={columns}
				data={productos}
				getRowId={(p: Producto): number => p.id}
			/>
		</div>
	);
}

export const Route = createFileRoute("/productos")({
	component: ProductosPage,
});
