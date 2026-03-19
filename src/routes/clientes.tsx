import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { DataTable, type Column } from "../components/ui/DataTable";
import {
	useClientes,
	useInsertCliente,
	useUpdateCliente,
	useDeleteCliente,
} from "../hooks/queries";
import type { Cliente } from "../lib/database.types";

const clienteSchema = z.object({
	nombre: z.string().min(1, "El nombre es obligatorio"),
	direccion: z.string(),
	contacto: z.string(),
});

type ClienteForm = z.infer<typeof clienteSchema>;

function ClientesPage(): JSX.Element {
	const { data: clientes, isLoading, error } = useClientes();
	const insertMutation = useInsertCliente();
	const updateMutation = useUpdateCliente();
	const deleteMutation = useDeleteCliente();
	const [editingId, setEditingId] = useState<number | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ClienteForm>({
		resolver: zodResolver(clienteSchema),
		defaultValues: { nombre: "", direccion: "", contacto: "" },
	});

	function onSubmit(data: ClienteForm): void {
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

	function startEdit(cliente: Cliente): void {
		setEditingId(cliente.id);
		reset({
			nombre: cliente.nombre,
			direccion: cliente.direccion,
			contacto: cliente.contacto,
		});
	}

	function cancelEdit(): void {
		setEditingId(null);
		reset({ nombre: "", direccion: "", contacto: "" });
	}

	const columns: Array<Column<Cliente>> = [
		{ header: "ID", render: (c: Cliente): number => c.id },
		{ header: "Nombre", render: (c: Cliente): string => c.nombre },
		{ header: "Direccion", render: (c: Cliente): string => c.direccion },
		{ header: "Contacto", render: (c: Cliente): string => c.contacto },
		{
			header: "Acciones",
			render: (c: Cliente): JSX.Element => (
				<div className="flex gap-2">
					<button
						className="rounded p-1 text-blue-600 hover:bg-blue-50"
						title="Editar"
						type="button"
						onClick={(): void => { startEdit(c); }}
					>
						<PencilIcon className="h-4 w-4" />
					</button>
					<button
						className="rounded p-1 text-red-600 hover:bg-red-50"
						disabled={deleteMutation.isPending}
						title="Eliminar"
						type="button"
						onClick={(): void => { deleteMutation.mutate(c.id); }}
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
			<h1 className="text-2xl font-bold">Clientes</h1>

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
					<label className="text-xs font-medium text-gray-600" htmlFor="direccion">
						Direccion
					</label>
					<input className={inputClasses} id="direccion" {...register("direccion")} />
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="contacto">
						Contacto
					</label>
					<input className={inputClasses} id="contacto" {...register("contacto")} />
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

			<DataTable<Cliente>
				columns={columns}
				data={clientes ?? []}
				getRowId={(c: Cliente): number => c.id}
			/>
		</div>
	);
}

export const Route = createFileRoute("/clientes")({
	component: ClientesPage,
});
