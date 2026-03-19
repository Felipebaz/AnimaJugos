import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useMemo, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
	usePedidos,
	useClientes,
	useProductos,
	useInsertPedido,
	useAddItemToPedido,
} from "../hooks/queries";
import { calcularTotalUnidades } from "../hooks/useBusinessLogic";
import type { PedidoConItems } from "../lib/database.types";

function weekToDateRange(semana: string): { start: string; end: string } {
	const [yearString, weekString] = semana.split("-W");
	const year = Number(yearString);
	const week = Number(weekString);
	const jan4 = new Date(year, 0, 4);
	const dayOfWeek = jan4.getDay() || 7;
	const monday = new Date(jan4);
	monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
	const friday = new Date(monday);
	friday.setDate(monday.getDate() + 4);
	return {
		start: monday.toISOString().split("T")[0] ?? "",
		end: friday.toISOString().split("T")[0] ?? "",
	};
}

function PedidosPage(): JSX.Element {
	const { data: pedidos, isLoading: loadingPedidos } = usePedidos();
	const { data: clientes } = useClientes();
	const { data: productos } = useProductos();
	const insertPedido = useInsertPedido();
	const addItem = useAddItemToPedido();

	const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
	const [semana, setSemana] = useState("");
	const [clienteId, setClienteId] = useState("");
	const [productoId, setProductoId] = useState("");
	const [cantidad, setCantidad] = useState("");

	const pedidosPorSemana = useMemo(() => {
		if (!pedidos) return [];
		const map = new Map<string, Array<PedidoConItems>>();
		for (const p of pedidos) {
			const array = map.get(p.semana) ?? [];
			array.push(p);
			map.set(p.semana, array);
		}
		return [...map.entries()].sort(([a], [b]) => b.localeCompare(a));
	}, [pedidos]);

	function toggleExpand(id: number): void {
		setExpandedIds((previous) => {
			const next = new Set(previous);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (!semana || !clienteId || !productoId || !cantidad) return;

		const existente = pedidos?.find((p) => p.semana === semana);

		if (existente) {
			// eslint-disable-next-line camelcase
			addItem.mutate({ pedido_id: existente.id, cliente_id: Number(clienteId), producto_id: Number(productoId), cantidad: Number(cantidad) });
		} else {
			const { start, end } = weekToDateRange(semana);
			// eslint-disable-next-line camelcase
			insertPedido.mutate({ semana, fecha_inicio: start, fecha_fin: end }, {
					onSuccess: (newPedido) => {
						// eslint-disable-next-line camelcase
						addItem.mutate({ pedido_id: newPedido.id, cliente_id: Number(clienteId), producto_id: Number(productoId), cantidad: Number(cantidad) });
					},
				}
			);
		}

		setCantidad("");
	}

	function getClienteNombre(id: number): string {
		return clientes?.find((c) => c.id === id)?.nombre ?? `Cliente #${id}`;
	}

	function getProductoNombre(id: number): string {
		return productos?.find((p) => p.id === id)?.nombre ?? `Producto #${id}`;
	}

	if (loadingPedidos) return <p className="p-4 text-sm text-gray-500">Cargando...</p>;

	const inputClasses =
		"rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Pedidos</h1>

			<form
				className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="semana">
						Semana
					</label>
					<input
						required
						className={inputClasses}
						id="semana"
						type="week"
						value={semana}
						onChange={(event): void => { setSemana(event.target.value); }}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="cliente">
						Cliente
					</label>
					<select
						required
						className={inputClasses}
						id="cliente"
						value={clienteId}
						onChange={(event): void => { setClienteId(event.target.value); }}
					>
						<option value="">Seleccionar...</option>
						{clientes?.map((c) => (
							<option key={c.id} value={c.id}>
								{c.nombre}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="producto">
						Producto
					</label>
					<select
						required
						className={inputClasses}
						id="producto"
						value={productoId}
						onChange={(event): void => { setProductoId(event.target.value); }}
					>
						<option value="">Seleccionar...</option>
						{productos
							?.filter((p) => p.activo)
							.map((p) => (
								<option key={p.id} value={p.id}>
									{p.nombre}
								</option>
							))}
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600" htmlFor="cantidad">
						Cantidad
					</label>
					<input
						required
						className={inputClasses}
						id="cantidad"
						min="1"
						type="number"
						value={cantidad}
						onChange={(event): void => { setCantidad(event.target.value); }}
					/>
				</div>

				<button
					className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					disabled={insertPedido.isPending || addItem.isPending}
					type="submit"
				>
					Agregar
				</button>
			</form>

			{pedidosPorSemana.map(([semanaKey, pedidosSemana]) => (
				<div key={semanaKey} className="space-y-2">
					<h2 className="text-lg font-semibold text-gray-800">
						Semana {semanaKey}
					</h2>

					{pedidosSemana.map((pedido) => {
						const isExpanded = expandedIds.has(pedido.id);
						const items = pedido.pedido_items;

						return (
							<div
								key={pedido.id}
								className="overflow-hidden rounded-lg border border-gray-200 bg-white"
							>
								<button
									className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
									type="button"
									onClick={(): void => { toggleExpand(pedido.id); }}
								>
									<div className="flex items-center gap-3">
										{isExpanded ? (
											<ChevronDownIcon className="h-4 w-4 text-gray-500" />
										) : (
											<ChevronRightIcon className="h-4 w-4 text-gray-500" />
										)}
										<span className="text-sm font-medium">
											Pedido #{pedido.id}
										</span>
										<span className="text-sm text-gray-500">
											{pedido.fecha_inicio} – {pedido.fecha_fin}
										</span>
									</div>
									<span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
										{calcularTotalUnidades(items)} unidades
									</span>
								</button>

								{isExpanded && (
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
													Cliente
												</th>
												<th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
													Producto
												</th>
												<th className="px-4 py-2 text-right text-xs font-semibold uppercase text-gray-600">
													Cantidad
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{items.map((item) => (
												<tr
													key={item.id}
													className="transition-colors hover:bg-gray-50"
												>
													<td className="px-4 py-2 text-sm text-gray-700">
														{getClienteNombre(item.cliente_id)}
													</td>
													<td className="px-4 py-2 text-sm text-gray-700">
														{getProductoNombre(item.producto_id)}
													</td>
													<td className="px-4 py-2 text-right text-sm text-gray-700">
														{item.cantidad}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}

export const Route = createFileRoute("/pedidos")({
	component: PedidosPage,
});
