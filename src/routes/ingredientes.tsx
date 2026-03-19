import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { DataTable, type Column } from "../components/ui/DataTable";
import {
	useIngredientes,
	useInsertIngrediente,
	useUpdateIngrediente,
	useDeleteIngrediente,
} from "../hooks/queries";
import type { Ingrediente } from "../lib/database.types";

const ingredienteSchema = z.object({
	nombre: z.string().min(1, "El nombre es obligatorio"),
	unidad: z.string().min(1, "La unidad es obligatoria"),
});

type IngredienteForm = z.infer<typeof ingredienteSchema>;

function IngredientesPage(): JSX.Element {
	const { data: ingredientes, isLoading, error } = useIngredientes();
	const insertMutation = useInsertIngrediente();
	const updateMutation = useUpdateIngrediente();
	const deleteMutation = useDeleteIngrediente();
	const [editingId, setEditingId] = useState<number | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IngredienteForm>({
		resolver: zodResolver(ingredienteSchema),
		defaultValues: { nombre: "", unidad: "" },
	});

	function onSubmit(data: IngredienteForm): void {
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

	function startEdit(ingrediente: Ingrediente): void {
		setEditingId(ingrediente.id);
		reset({ nombre: ingrediente.nombre, unidad: ingrediente.unidad });
	}

	function cancelEdit(): void {
		setEditingId(null);
		reset({ nombre: "", unidad: "" });
	}

	const columns: Array<Column<Ingrediente>> = [
		{ header: "ID", render: (index: Ingrediente): number => index.id },
		{ header: "Nombre", render: (index: Ingrediente): string => index.nombre },
		{ header: "Unidad", render: (index: Ingrediente): string => index.unidad },
		{
			header: "Acciones",
			render: (index: Ingrediente): JSX.Element => (
				<div className="flex gap-2">
					<button
						className="rounded p-1 text-blue-600 hover:bg-blue-50"
						title="Editar"
						type="button"
						onClick={(): void => { startEdit(index); }}
					>
						<PencilIcon className="h-4 w-4" />
					</button>
					<button
						className="rounded p-1 text-red-600 hover:bg-red-50"
						disabled={deleteMutation.isPending}
						title="Eliminar"
						type="button"
						onClick={(): void => { deleteMutation.mutate(index.id); }}
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
			<h1 className="text-2xl font-bold">Ingredientes</h1>

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
					<label className="text-xs font-medium text-gray-600" htmlFor="unidad">
						Unidad (u, g, ml)
					</label>
					<input className={inputClasses} id="unidad" {...register("unidad")} />
					{errors.unidad && (
						<span className="text-xs text-red-600">{errors.unidad.message}</span>
					)}
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

			<DataTable<Ingrediente>
				columns={columns}
				data={ingredientes ?? []}
				getRowId={(index: Ingrediente): number => index.id}
			/>
		</div>
	);
}

export const Route = createFileRoute("/ingredientes")({
	component: IngredientesPage,
});
