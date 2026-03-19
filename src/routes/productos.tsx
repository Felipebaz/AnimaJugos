import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { DataTable, type Column } from "../components/ui/DataTable";
import {
	useProductos,
	useInsertProducto,
	useUpdateProducto,
	useDeleteProducto,
} from "../hooks/queries";
import type { Producto } from "../lib/database.types";

const productoSchema = z.object({
	nombre: z.string().min(1, "El nombre es obligatorio"),
	tipo: z.enum(["JUGO", "SHOT"]),
	precio: z.number().min(0, "El precio debe ser >= 0"),
	activo: z.boolean(),
});

type ProductoForm = z.infer<typeof productoSchema>;

function ProductosPage(): JSX.Element {
	const { data: productos, isLoading, error } = useProductos();
	const insertMutation = useInsertProducto();
	const updateMutation = useUpdateProducto();
	const deleteMutation = useDeleteProducto();
	const [editingId, setEditingId] = useState<number | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProductoForm>({
		resolver: zodResolver(productoSchema),
		defaultValues: { nombre: "", tipo: "JUGO", precio: 0, activo: true },
	});

	function onSubmit(data: ProductoForm): void {
		if (editingId !== null) {
			updateMutation.mutate(
				{ id: editingId, campos: data },
				{
					onSuccess: () => {
						reset();
						setEditingId(null);
					},
				}
			);
		} else {
			insertMutation.mutate(data, { onSuccess: () => { reset(); } });
		}
	}

	function startEdit(producto: Producto): void {
		setEditingId(producto.id);
		reset({
			nombre: producto.nombre,
			tipo: producto.tipo as "JUGO" | "SHOT",
			precio: producto.precio,
			activo: producto.activo,
		});
	}

	function cancelEdit(): void {
		setEditingId(null);
		reset({ nombre: "", tipo: "JUGO", precio: 0, activo: true });
	}

	const columns: Array<Column<Producto>> = [
		{ header: "ID", render: (p: Producto): number => p.id },
		{ header: "Nombre", render: (p: Producto): string => p.nombre },
		{ header: "Tipo", render: (p: Producto): string => p.tipo },
		{
			header: "Precio",
			render: (p: Producto): string => `$${Number(p.precio).toFixed(2)}`,
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
		{
			header: "Acciones",
			render: (p: Producto): JSX.Element => (
				<div className="flex gap-2">
					<button
						className="rounded p-1 text-blue-600 hover:bg-blue-50"
						title="Editar"
						type="button"
						onClick={(): void => { startEdit(p); }}
					>
						<PencilIcon className="h-4 w-4" />
					</button>
					<button
						className="rounded p-1 text-red-600 hover:bg-red-50"
						disabled={deleteMutation.isPending}
						title="Eliminar"
						type="button"
						onClick={(): void => { deleteMutation.mutate(p.id); }}
					>
						<TrashIcon className="h-4 w-4" />
					</button>
				</div>
			),
		},
	];

	if (isLoading) return <p className="p-4 text-sm text-gray-500">Cargando...</p>;
	if (error) return <p className="p-4 text-sm text-red-600">Error: {error.message}</p>;

	const inputClasses =
		"rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Productos</h1>

			<form
				className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="nombre">
						Nombre
					</label>
					<input className={inputClasses} id="nombre" {...register("nombre")} />
					{errors.nombre && (
						<span className="text-xs text-red-600">{errors.nombre.message}</span>
					)}
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="tipo">
						Tipo
					</label>
					<select className={inputClasses} id="tipo" {...register("tipo")}>
						<option value="JUGO">Jugo</option>
						<option value="SHOT">Shot</option>
					</select>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="precio">
						Precio
					</label>
					<input
						className={inputClasses}
						id="precio"
						min="0"
						step="0.01"
						type="number"
						{...register("precio")}
					/>
					{errors.precio && (
						<span className="text-xs text-red-600">{errors.precio.message}</span>
					)}
				</div>
				<div className="flex items-center gap-2 pb-1">
					<input id="activo" type="checkbox" {...register("activo")} />
					<label className="text-xs font-medium text-gray-600" htmlFor="activo">
						Activo
					</label>
				</div>
				<button
					className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					disabled={insertMutation.isPending || updateMutation.isPending}
					type="submit"
				>
					{editingId !== null ? "Guardar" : "Agregar"}
				</button>
				{editingId !== null && (
					<button
						className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
						type="button"
						onClick={cancelEdit}
					>
						Cancelar
					</button>
				)}
			</form>

			<DataTable<Producto>
				columns={columns}
				data={productos ?? []}
				getRowId={(p: Producto): number => p.id}
			/>
		</div>
	);
}

export const Route = createFileRoute("/productos")({
	component: ProductosPage,
});
